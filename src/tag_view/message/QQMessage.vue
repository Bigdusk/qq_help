<script setup lang="ts">
import { ref } from 'vue';
import { get, post } from '../../hooks/request_local';
import { QQFriendInfo } from '../../entity';
import { message } from '../../hooks/discrete_api';
import { TabsProps } from 'naive-ui';
import QQMessageSetting from '../../components/message/QQMessageSetting.vue';
import { sleep } from '../../hooks';
import { darkTheme } from 'naive-ui'

const value = ref('')
const group_value = ref({
    value: '',
    img: ''
})
const send_friend = (qq: number) => {
    post('/send_private_msg',
        {
            "user_id": qq,
            "message": [
                {
                    "type": "text",
                    "data": {
                        "text": value.value
                    }
                }
            ]
        }
    )
}

const send_group = (qq_group: number) => {

    //组织数据体
    let body = null
    if (!group_active.value) {
        body = {
            "group_id": qq_group,
            "message": [
                {
                    "type": "text",
                    "data": {
                        "text": group_value.value.value
                    }
                }
            ]
        }
    } else {
        body = {
            "group_id": qq_group,
            "message": [
                {
                    "type": "text",
                    "data": {
                        "text": group_value.value.value
                    }
                },
                {
                    "type": "image",
                    "data": {
                        "file": group_value.value.img
                    }
                }
            ]
        }
    }

    post('/send_group_msg', body).then((r: any) => {
        console.log(r);
        
        if (r === null) {
            //添加到消息队列
            message_queues.value.push('在' + new Date().toString() + '----发送失败')
        } else {
            //添加到消息队列
            message_queues.value.push('在' + new Date().toString() + '----发送成功')
        }
    })
}

//发送群组
const send_group_all_temp = async () => {
    timing_active.value = true
    //获取参数
    let qq_message_temp = localStorage.getItem('qq_message')

    if (!qq_message_temp) {
        message.warning('请设置参数')
        return
    }

    while (timing_active.value) {
        let qq_message: {
            send_time: number
            select_group_all: number[]
        } = JSON.parse(qq_message_temp)

        qq_message.select_group_all.forEach((group_id: number) => {
            send_group(group_id)
        })
        console.log(111);
        
        //暂停
        await sleep(qq_message.send_time * 1000)
    }
}

//发送群组
const send_group_all = async () => {
    //获取参数
    let qq_message_temp = localStorage.getItem('qq_message')

    if (!qq_message_temp) {
        message.warning('请设置参数')
        return
    }
    let qq_message: {
        send_time: number
        select_group_all: number[]
    } = JSON.parse(qq_message_temp)

    qq_message.select_group_all.forEach((group_id: number) => {
        send_group(group_id)
    })
    message.success('发送成功')
}

//发送好友
const send_friend_all = async () => {
    get<QQFriendInfo[]>('/get_friends_with_category')
        .then(r => {
            r.forEach(qq_info => {
                qq_info.buddyList.forEach(qq => {
                    send_friend(qq.user_id)
                })
            })
            message.success('发送成功')
        })
}

//选
const placement = ref<NonNullable<TabsProps['placement']>>('top')
const type = ref<TabsProps['type']>('card')

const group_active = ref(false)
const timing_active = ref(false)

const message_queues = ref<string[]>([])
</script>

<template>
    <h1>一键群发</h1>
    <n-card hoverable>

        <n-tabs :key="type + placement" :type="type" animated :placement="placement">
            <n-tab-pane name="index" tab="群组群发">
                <n-space vertical>
                    <n-input v-model:value="group_value.value" type="textarea" placeholder="群发内容" />


                    <div><n-switch v-model:value="group_active">
                            <template #checked>
                                请输入图片链接
                            </template>
                            <template #unchecked>
                                添加图片
                            </template>
                        </n-switch>
                        临时上传图片https://imgimg.cc/
                    </div>

                    <n-input v-show="group_active" v-model:value="group_value.img" type="text" placeholder="图片连接地址" />
                    <n-space>
                        <n-button @click="send_group_all" type="primary">
                            发送
                        </n-button>
                        <n-button v-show="!timing_active" @click="send_group_all_temp" type="primary">
                            定时发送
                        </n-button>
                        <n-button v-show="timing_active" @click="timing_active = false" type="primary">
                            取消发送
                        </n-button>
                        <QQMessageSetting />
                    </n-space>


                    <n-infinite-scroll style="max-height: 30vh;" :distance="10">
                        <n-config-provider :theme="darkTheme">
                            <n-card hoverable>
                                <n-space style="display: flex; flex-direction: column-reverse;">
                                    <div v-for="m in message_queues">
                                        <n-tag>
                                            {{ m }}
                                        </n-tag>
                                    </div>
                                </n-space>
                            </n-card>
                        </n-config-provider>
                    </n-infinite-scroll>

                </n-space>


            </n-tab-pane>
            <n-tab-pane name="email" tab="QQ好友群发">
                <n-input v-model:value="value" type="textarea" placeholder="群发内容" />
                <n-space>
                    <n-button @click="send_friend_all" type="primary">
                        发送所有好友
                    </n-button>
                </n-space>

            </n-tab-pane>
        </n-tabs>
    </n-card>
</template>

<style scoped></style>