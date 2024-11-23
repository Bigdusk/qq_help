<script setup lang="ts">
import { ref } from 'vue';
import { get, post } from '../../hooks/request_local';
import { QQFriendInfo, QQGroup } from '../../entity';
import { message } from '../../hooks/discrete_api';


const value = ref('')

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
        .then(r => {
            console.log(JSON.parse(r as string));

        })
}

const send_group = (qq_group: number) => {
    post('/send_group_msg',
        {
            "group_id": qq_group,
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
        .then(r => {
            console.log(JSON.parse(r as string));

        })
}

//发送群组
const send_group_all = async () => {
    post<QQGroup[]>('/get_group_list',
        {
            "no_cache": true
        }
    )
        .then(r => {
            r.forEach(group => {
                send_group(group.group_id)
            })
            message.success('发送成功')
        })
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
</script>

<template>
    <h1>一键群发</h1>
    <n-card hoverable>
        <n-input v-model:value="value" type="textarea" placeholder="群发内容" />


        <n-space>
            <n-button @click="send_friend_all" type="primary">
                发送所有好友
            </n-button>
            <n-button @click="send_group_all" type="primary">
                发送所有群组
            </n-button>
        </n-space>
    </n-card>
</template>

<style scoped></style>