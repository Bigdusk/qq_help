<script setup lang="ts">
import { ref } from 'vue';
import EmailSendSetting2 from './EmailSendSetting2.vue';
import Email from '../setting/Email.vue';

const showModal = ref(false)
</script>

<template>
    <n-button @click="showModal = true">
        配置发件箱
    </n-button>

    <n-modal v-model:show="showModal">
        <n-card style="width: 900px" title="粘贴配置发件箱" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <n-tabs type="line" animated>
                <n-tab-pane name="1" tab="通用添加">
                    <EmailSendSetting2/>
                </n-tab-pane>
                <n-tab-pane name="2" tab="发件箱详情">
                    <Email/>
                </n-tab-pane>
            </n-tabs>
        </n-card>
    </n-modal>

</template>

<style scoped></style>