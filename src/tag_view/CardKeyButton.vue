<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { post } from '../hooks/request';
import { notification } from '../hooks/discrete_api';


const showModal = ref(false)

const computer = ref({
    computer_id: '',
    card_key: ''
})
//兑换
function use_card_key() {
    post<string>('/card_key/redeem', computer.value).then(r => {

        if (typeof r === 'string') {
            notification.info({ title: r, duration: 10000, })
        }
    })
}

onMounted(() => {
    //初始化获取设备码
    const uuid = localStorage.getItem('uuid');
    if (!uuid) {
        notification.error({ title: '设备码获取出错', duration: 5000, });
        return;
    }

    computer.value.computer_id = uuid;
})
</script>

<template>
    <n-button type="info" dashed @click="showModal = true">
        卡密兑换
    </n-button>


    <n-modal v-model:show="showModal">

        <n-card style="width: 500px" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <h3>卡密兑换</h3>
            <n-tag :bordered="false" type="info">
                设备码：{{ computer.computer_id }}
            </n-tag>
            <n-input v-model:value.trim="computer.card_key" type="textarea" placeholder="请联系你的代理商购买卡密" />

            <n-button @click="use_card_key" type="primary">
                兑换
            </n-button>
        </n-card>
    </n-modal>
</template>

<style scoped></style>