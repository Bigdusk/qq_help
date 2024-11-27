<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

import Papa from 'papaparse';
import { message, notification } from '../../hooks/discrete_api';
import EmailSendSetting from '../../components/message/EmailSendSetting.vue';
import axios from 'axios';
import { EmailConfig, EmailPacket, EmailParameter } from '../../entity';
import { sleep } from '../../hooks';
import { invoke } from '@tauri-apps/api/core';
import { darkTheme } from 'naive-ui'
import EmailOfSmtpAndList from '../../components/message/EmailOfSmtpAndList.vue';


const email_content = ref({
    subject: '',
    content: ''
});

const csv_file_upload = async (event: any) => {
    email_data.value.length = 0
    Papa.parse(event.target.files[0], {
        step: function (results: any, _parser) {
            results.data.forEach((r: any) => {
                if (isValidEmail(r)) {
                    email_data.value.push(r)
                }
            })
        }
    });
}
const email_data = ref<string[]>([])

function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

//获取html内容
const onSave = (_v: string, h: Promise<any>) => {
    h.then(html => {
        email_content.value.content = html
        message.success('保存成功')
        localStorage.setItem('email_content', JSON.stringify(email_content.value))
        localStorage.setItem('email_temp', JSON.stringify(temp_text.value))
    })

};
onMounted(() => {
    const t = localStorage.getItem('email_temp')
    if (t) {
        temp_text.value = JSON.parse(t)
    }
    const e = localStorage.getItem('email_content')
    if (e) {
        email_content.value = JSON.parse(e)
    }
})
const temp_text = ref('# Hello QQ_HELP')


const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
    notification.warning({ title: '暂时不支持直接上传图片，请使用图片链接方式。访问https://imgimg.cc/上传图片获取链接。' })
    return
    const res = await Promise.all(
        files.map((file) => {
            return new Promise((rev, rej) => {
                const form = new FormData();
                form.append('file', file);

                axios
                    .post('/api/img/upload', form, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    .then((res) => rev(res))
                    .catch((error) => rej(error));
            });
        })
    );

    callback(res.map((item: any) => item.data.url));
};

//邮件群发系统
const email_send_all = async () => {
    message_queues.value.length = 0
    //检测是否配置矩阵
    const email_server_list = localStorage.getItem('email_server_list')
    if (!email_server_list) {
        message.warning('邮件服务器未配置')
        return
    }
    const email_parameter = localStorage.getItem('email_parameter')
    if (!email_parameter) {
        message.warning('参数未设置')
        return
    }

    //进行邮件包组装
    let email_send_list: EmailPacket[] = []//用于存储邮箱信息
    const email_server_all: EmailConfig[] = JSON.parse(email_server_list)

    const email_parameter_all: EmailParameter = JSON.parse(email_parameter)

    email_server_all.forEach(email_config => {
        const e: EmailPacket = {
            config: {
                smtp_url: email_config.smtp_url,
                smtp_username: email_config.smtp_username,
                smtp_password: email_config.smtp_password,
                port: email_config.port
            },
            from: {
                name: email_parameter_all.from.name,
                email: email_config.smtp_username
            },
            reply: {
                name: email_parameter_all.reply.name,
                email: email_parameter_all.reply.email
            },
            to: {
                name: null,
                email: null
            },
            content: {
                subject: email_content.value.subject,
                plain: 'QQ_HELP',
                html: email_content.value.content
            }
        }

        email_send_list.push(e)
    })

    //最重要配置开始
    //初始化两个指针
    let email_index = 0
    let email_send_index = 0

    is_run_send_email.value = true
    //创建一个定时器循环
    while (is_run_send_email.value) {
        //邮箱数组判断是否越界
        if (email_index > email_data.value.length - 1) {
            //代表邮件已经发送完毕
            //重置计数
            email_index = 0
            email_send_index = 0

            message.success('执行完毕')
            break
        }
        //判断邮件服务器下标
        if (email_send_index > email_send_list.length - 1) {
            //遍历完一圈重置
            email_send_index = 0
        }

        //准备发送数据
        email_send_list[email_send_index].to.name = JSON.stringify(email_data.value[email_index])//填充收件人名称
        email_send_list[email_send_index].to.email = email_data.value[email_index]//填充邮箱
        //执行时间间隔
        await sleep(email_parameter_all.time)
        //开始执行
        try {
            await invoke('send_email', { emailPacket: email_send_list[email_send_index] });
            console.log(email_send_list[email_send_index].to.email);

            message_queues.value.push({
                id: email_index,
                from_email: email_send_list[email_send_index].from.email,
                to_email: email_send_list[email_send_index].to.email,
                is_ok: '发送成功'
            })

        } catch (e) {
            message_queues.value.push({
                id: email_index,
                from_email: email_send_list[email_send_index].from.email,
                to_email: email_send_list[email_send_index].to.email,
                is_ok: String(e)
            })
        }

        email_index++
        email_send_index++

    }

    is_run_send_email.value = false
}

//控制是否执行邮件发送
const is_run_send_email = ref(false)
//监控消息队列
const message_queues = ref <{
    id: number
    from_email: string|null
    to_email: string|null
    is_ok: string
}[] > ([])
//粘贴复制邮箱
const copy_email_show = ref(false)
//保存粘贴邮箱
const copy_email_value = ref('')
//将粘贴邮箱导入
const copy_email_add = () => {
    const email = copy_email_value.value.trim().split('\n')
    email_data.value = email
    message.success('导入成功')
    copy_email_show.value = false
}
</script>

<template>
    <h1>邮件一键群发</h1>
    <n-flex>
        <n-card content-style="padding: 0;" style="width: 78%;" hoverable>
            <n-alert title="提示" type="info">
                1.配置发件箱
                2.配置参数
                3.保存邮件内容。
                4.导入发送邮箱列表
                5.发送
            </n-alert>
            <div>
                <n-input v-model:value="email_content.subject" style="width: 300px;" type="text" placeholder="主题" />
                <EmailSendSetting />
                <EmailOfSmtpAndList />
            </div>

            <MdEditor @onUploadImg="onUploadImg" @on-save="onSave" v-model="temp_text" />
            <n-button v-show="!is_run_send_email" @click="email_send_all" style="width: 100%;"
                type="primary">开始执行</n-button>
            <n-button v-show="is_run_send_email" @click="is_run_send_email = false" style="width: 100%;"
                type="primary">取消执行</n-button>

            <n-infinite-scroll style="max-height: 20vh;" :distance="10">
                <n-config-provider :theme="darkTheme">
                    <n-card hoverable>
                        <n-space style="display: flex; flex-direction: column-reverse;">
                            <div v-for="m in message_queues" :key="m.id">
                                <n-tag v-if="m.is_ok === '发送成功'" type="success">
                                    {{ '由' + m.from_email + '到' + m.to_email + '发送到服务器：' +
                                        m.is_ok }}
                                </n-tag>
                                <n-tag v-else type="error">
                                    {{ '由' + m.from_email + '到' + m.to_email + '发送到服务器：' +
                                        m.is_ok }}
                                </n-tag>
                            </div>
                        </n-space>
                    </n-card>
                </n-config-provider>
            </n-infinite-scroll>
        </n-card>

        <n-card style="width: 20%;" hoverable>
            <h3>导入目标邮箱</h3>
            <n-button>
                <label for="fileInput" class="custom-file-upload">
                    CSV文件导入
                </label>
            </n-button>

            <n-button @click="copy_email_show = true">粘贴导入</n-button>
            <input style="display: none;" type="file" id="fileInput" accept=".csv" @change="csv_file_upload" single>

            <n-infinite-scroll style="max-height: 70vh;" :distance="10">
                <div v-for="e in email_data">
                    <n-blockquote align-text>
                        {{ e }}
                    </n-blockquote>
                </div>
            </n-infinite-scroll>

        </n-card>
    </n-flex>




    <!-- 粘贴导入发送邮箱 -->
    <n-modal v-model:show="copy_email_show">
        <n-card style="width: 600px" title="粘贴邮箱导入" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <n-button @click="copy_email_add">导入</n-button>
            {{ copy_email_value }}
            <n-infinite-scroll style="max-height: 60vh;" :distance="10">

                <n-input type="textarea" v-model:value="copy_email_value" placeholder="xxx@.com
xxx@.com
xxx@.com
xxx@.com
xxx@.com
xxx@.com
...
                " />

            </n-infinite-scroll>
        </n-card>
    </n-modal>
</template>

<style scoped></style>