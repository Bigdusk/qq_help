<script setup lang="ts">
// import { invoke } from '@tauri-apps/api/core';
// import { EmailConfig, EmailPacket } from '../../entity';
import { onMounted, ref } from 'vue';
import { EmailConfig } from '../../entity';
import { message } from '../../hooks/discrete_api';
//加群触发
// group_id
// : 
// 373094745
// notice_type
// : 
// "group_increase"
// operator_id
// : 
// 2831828656
// post_type
// : 
// "notice"
// self_id
// : 
// 2831828656
// sub_type
// : 
// "approve"
// time
// : 
// 1732226413
// user_id
// : 
// 3953047135

//退群触发
// group_id
// : 
// 373094745
// notice_type
// : 
// "group_decrease"
// operator_id
// : 
// 3953047135
// post_type
// : 
// "notice"
// self_id
// : 
// 2831828656
// sub_type
// : 
// "leave"
// time
// : 
// 1732226206
// user_id
// : 
// 3953047135

// const e = () => {
//     //测试邮件发送
//     try {
//         const e: EmailPacket = {
//             config: {
//                 smtp_url: 'smtp.163.com',
//                 smtp_username: '19558797134@163.com',
//                 smtp_password: 'DH8YMPn32D2PQkiA',
//                 port: 25,
//                 max_size: 30
//             },
//             from: {
//                 name: '网易邮箱',
//                 email: '19558797134@163.com'
//             },
//             reply: {
//                 name: '回复邮箱',
//                 email: '19558797134@163.com'
//             },
//             to: {
//                 name: 'q邮箱',
//                 email: '2831828656@qq.com'
//             },
//             content: {
//                 subject: '主题',
//                 plain: 'plain',
//                 html: '网页'
//             }
//         }
//         const r = invoke('send_email', { emailPacket: e });
//         console.log(r);
//     } catch (error) {
//         console.log(error);

//     }
// }
//分割线----------------------------------------------------------------------
const customValue = ref<EmailConfig[]>([])

const onCreate = () => {
    return {
        smtp_url: 'smtp.xxx.com',
        smtp_username: 'xxxxx@xxxx.com',
        smtp_password: 'DH8YMPn32D2PQkil',
        port: 25,
        max_size: 30
    }
}

//保存
const save = () => {
    localStorage.setItem('email_server_list', JSON.stringify(customValue.value))
    message.success('保存成功')
}

onMounted(() => {
    //初始化配置
    const email_server_list = localStorage.getItem('email_server_list')

    if(email_server_list) {
        customValue.value = JSON.parse(email_server_list)
    }
})
</script>

<template>
    <n-card title="邮件设置" hoverable>
        <n-button @click="save" type="primary">
            保存
        </n-button>
        <n-tag :bordered="false" type="info">
            邮件服务器矩阵，通过添加多个邮件服务器轮播发送，避免单一邮件服务器或者账号被拉黑或者被判定垃圾邮件。tip:建议添加不同厂商的邮件服务器以避免被邮件服务器厂商拉黑ip地址。
        </n-tag>
        <n-dynamic-input v-model:value="customValue" :on-create="onCreate">
            <template #default="{ value }">
                <div style="display: flex; align-items: center; width: 100%">
                    <n-card title="邮件服务器地址" size="small" hoverable>
                        <n-input v-model:value="value.smtp_url" type="text" />
                    </n-card>
                    <n-card title="发送邮箱" size="small" hoverable>
                        <n-input v-model:value="value.smtp_username" type="text" />
                    </n-card>
                    <n-card title="授权码" size="small" hoverable>
                        <n-input v-model:value="value.smtp_password" type="text" />
                    </n-card>
                    <n-card title="服务器端口" size="small" hoverable>
                        <n-input-number v-model:value="value.port" clearable />
                    </n-card>
                    <n-card title="超时时间" size="small" hoverable>
                        <n-input-number v-model:value="value.max_size" clearable />
                    </n-card>
                </div>
            </template>
        </n-dynamic-input>
    </n-card>
</template>

<style scoped></style>