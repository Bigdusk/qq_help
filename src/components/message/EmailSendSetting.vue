<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { message } from '../../hooks/discrete_api';
import { EmailParameter } from '../../entity';


const showOuter = ref(false)
function doShowOuter() {
    showOuter.value = true
}

const email_parameter = ref<EmailParameter>({
    from: {
        name: null,
        email: null
    },
    reply: {
        name: null,
        email: null
    },
    to: {
        name: null,
        email: null
    },
    time: 0
})
//缓存关键字
const save = () => {
    const s = JSON.stringify(email_parameter.value)
    localStorage.setItem('email_parameter', s)
    message.success('保存成功')
    showOuter.value = false
}

//初始化加载上次关键词
onMounted(() => {
    const local_email_parameter = localStorage.getItem('email_parameter');
    if (!local_email_parameter) {
        return;
    }
    email_parameter.value = JSON.parse(local_email_parameter)
})
</script>

<template>
    <n-button @click="doShowOuter">
        参数
    </n-button>
    <n-drawer v-model:show="showOuter" :width="502">
        <n-drawer-content title="参数调整">
            <n-card title="每封邮件间隔(毫秒级)" hoverable>
                <n-input-number v-model:value="email_parameter.time" clearable />
            </n-card>
            <n-card title="发件人" hoverable>
                <n-input v-model:value="email_parameter.from.name" type="text" style="width: 300px;" placeholder="发件人" />
            </n-card>
            <n-card title="回复人" hoverable>
                <n-input v-model:value="email_parameter.reply.name" type="text" style="width: 300px;" placeholder="回复人" />
                
                <n-input v-model:value="email_parameter.reply.email" type="text" style="width: 300px;" placeholder="回复人邮件地址" />
            </n-card>
            <n-card title="收件人" hoverable>
                <n-input v-model:value="email_parameter.to.name" type="text" style="width: 300px;" placeholder="收件人" />
            </n-card>
            <template #footer>
                <n-button @click="save">
                    保存
                </n-button>
            </template>
        </n-drawer-content>
    </n-drawer>
</template>

<style scoped></style>