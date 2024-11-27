<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { post } from '../../hooks/request_local';
import { QQGroup } from '../../entity';
import { message } from '../../hooks/discrete_api';


const showOuter = ref(false)
function doShowOuter() {
    showOuter.value = true
}


//初始化加载上次关键词
onMounted(() => {
    const message_config = localStorage.getItem('qq_message')

    if(message_config) {
        qq_message_config.value = JSON.parse(message_config)
    }
})


const add_group_all = () => {
    qq_group_all.value.forEach(r => {
        qq_message_config.value.select_group_all.push(r.value)
    })
}

const get_group_all = () => {
    post<QQGroup[]>('/get_group_list',
        {
            "no_cache": true
        }
    )
        .then(r => {
            r.forEach(group => {
                qq_group_all.value.push({
                    label: group.group_id + '(' + group.group_name + ')',
                    value: group.group_id
                })
            })
        })
}
interface TempGroup {
    label: string
    value: number
}
//qq所有群组
const qq_group_all = ref<TempGroup[]>([])

const qq_message_config = ref<{
    send_time: number
    select_group_all: number[]
}>({
    send_time: 1,
    select_group_all: []
})

const save = () => {
    //保存到本地
    localStorage.setItem('qq_message', JSON.stringify(qq_message_config.value))
    message.success('保存成功')
}
</script>

<template>
    <n-button @click="doShowOuter">
        参数
    </n-button>
    <n-drawer v-model:show="showOuter" :width="350">
        <n-drawer-content title="参数调整">
            <n-card title="定时器" hoverable>
                <n-input-number v-model:value="qq_message_config.send_time" placeholder="定时发送时间(秒为单位)" clearable :precision="0" />
            </n-card>
            
            <n-space>
                <n-button @click="get_group_all" type="primary">
                    刷新群组
                </n-button>
                <n-button @click="add_group_all" type="primary">
                    全部添加
                </n-button>

                <n-button @click="qq_message_config.select_group_all.length = 0" type="primary">
                    一键删除
                </n-button>
            </n-space>
            <n-select v-model:value="qq_message_config.select_group_all" multiple :options="qq_group_all" />




            <template #footer>
                <n-button @click="save">
                    保存
                </n-button>
            </template>
        </n-drawer-content>
    </n-drawer>
</template>

<style scoped></style>