<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { message } from '../../hooks/discrete_api';


const showOuter = ref(false)
function doShowOuter() {
    showOuter.value = true
}

const key_string = ref([])
//缓存关键字
const save_key = () => {
    const s = JSON.stringify(key_string.value)
    localStorage.setItem('key_string', s)
    message.success('保存成功')
    showOuter.value = false
}

//初始化加载上次关键词
onMounted(() => {
    const local_key_string = localStorage.getItem('key_string');
    if (!local_key_string) {
        return;
    }
    key_string.value = JSON.parse(local_key_string)
})
</script>

<template>
    <n-button @click="doShowOuter">
        参数
    </n-button>
    <n-drawer v-model:show="showOuter" :width="502">
        <n-drawer-content title="参数调整">
            <h5>
                设置关键词保存，将自动抓取聊天包含该关键词成员的数据。
            </h5>
            <n-card title="关键词参数设置" hoverable>
                <n-dynamic-tags v-model:value="key_string" />
            </n-card>




            <template #footer>
                <n-button @click="save_key">
                    保存
                </n-button>
            </template>
        </n-drawer-content>
    </n-drawer>
</template>

<style scoped></style>