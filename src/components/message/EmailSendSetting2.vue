<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { EmailConfig } from '../../entity';
import { message } from '../../hooks/discrete_api';
const customValue = ref<EmailConfig[]>([])

const add_config = ref({
    port: 25,
    split: '',
    emai_and_key: ''
})

//保存
const save = () => {
    if(add_config.value.split.length < 1) {
        message.warning('请输入分割符')
        return
    }
    //拆解组装
    const emai_and_key = add_config.value.emai_and_key.trim().split('\n')
    emai_and_key.forEach(r => {
        const e_k = r.split(add_config.value.split)
        const smtp = 'smtp.' + e_k[0].split('@')[1]
        customValue.value.push({
            smtp_url: smtp,
            smtp_username: e_k[0],
            smtp_password: e_k[1],
            port: add_config.value.port
        })
    })
    localStorage.setItem('email_server_list', JSON.stringify(customValue.value))
    message.success('保存成功')
    console.log(customValue.value);

}

onMounted(() => {
    //初始化配置
    const email_server_list = localStorage.getItem('email_server_list')

    if (email_server_list) {
        customValue.value = JSON.parse(email_server_list)
    }
})

</script>

<template>
    <n-space vertical>
        <n-alert title="提示" type="info">
            分割符是用于批量添加的比如123123@163.com----xxxxxxxx的分隔符就是----
        </n-alert>
        <n-input-group>
            <n-input-group-label>端口</n-input-group-label>
            <n-input-number v-model:value="add_config.port" style="width: 10%" placeholder="端口" />
            -
            <n-input-group-label>xxxxxx@xx.com</n-input-group-label>
            <n-input v-model:value="add_config.split" placeholder="分割符" :style="{ width: '11%' }" />
            <n-input-group-label>xxxxxxx</n-input-group-label>
            -
            <n-button @click="save" type="primary">
                通用导入
            </n-button>
        </n-input-group>

        <n-input style="height: 200px;" type="textarea" v-model:value="add_config.emai_and_key" placeholder="xxx@.com分割符xxxxxx
xxx@.com分割符xxxxxx
xxx@.com分割符xxxxxx
xxx@.com分割符xxxxxx
xxx@.com分割符xxxxxx
xxx@.com分割符xxxxxx
...
                " />
    </n-space>
</template>

<style scoped></style>