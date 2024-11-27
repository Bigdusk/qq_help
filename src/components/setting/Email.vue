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
        port: 25
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

    if (email_server_list) {
        customValue.value = JSON.parse(email_server_list)
    }
})
const delete_all = () => {
    customValue.value.length = 0
}

</script>

<template>
    <n-alert title="提示" type="info">
        请尽量避免同一ip或者同一内容频繁发送
    </n-alert>
    <n-flex justify="space-between">
        <n-button @click="save" type="primary">
            保存
        </n-button>
        <n-button @click="delete_all" type="error">
            一键清除所有(保存后生效)
        </n-button>
    </n-flex>

    <n-infinite-scroll style="max-height: 70vh;" :distance="10">
        <n-dynamic-input v-model:value="customValue" :on-create="onCreate">
            <template #default="{ value }">
                <div style="display: flex; align-items: center; width: 89%">
                    <n-input v-model:value="value.smtp_url" style="width: 400px;" type="text" placeholder="smtp" />
                    <n-input-number v-model:value="value.port" style="width: 200px;" placeholder="端口" />
                    <n-input v-model:value="value.smtp_username" style="width: 400px;" type="text" placeholder="邮箱" />
                    <n-input v-model:value="value.smtp_password" style="width: 400px;" type="text" placeholder="授权码" />
                </div>
            </template>
        </n-dynamic-input>
    </n-infinite-scroll>

</template>

<style scoped></style>