<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { get } from '../hooks/request';
import { Notice } from '../entity';
import { MdPreview, MdCatalog } from 'md-editor-v3';
// preview.css相比style.css少了编辑器那部分样式
import 'md-editor-v3/lib/preview.css';

const id = 'preview-only';
const scrollElement = document.documentElement;

//获取公告
let query_notice_all = () => {
  get<Notice[]>('/notice/query/all')
    .then(r => {
      notice_all.value = r
    })
}
const notice_all = ref<Notice[]>([])
onMounted(() => {
  query_notice_all()
})

const bodyStyle = {
  width: '600px'
}
const segmented = {
  content: 'soft',
  footer: 'soft'
} as const
const showModal = ref(false)

//打开公告
let show_notice = () => {
  showModal.value = !showModal.value
}
</script>

<template>
  <h1>首页</h1>
  <n-card title="公告">
    <div v-for="i in notice_all" :key="i.announcement_id">
      <n-card @click="show_notice" hoverable>{{ i.title }}</n-card>


      <n-modal v-model:show="showModal" class="custom-card" preset="card" :style="bodyStyle" :title="i.title"
        size="huge" :bordered="false" :segmented="segmented">
        <template #header-extra>
          {{ i.user_id }}
        </template>
        <MdPreview :id="id" :modelValue="i.content" />
        <MdCatalog :editorId="id" :scrollElement="scrollElement" />
        <template #footer>
          发布时间:{{ i.publish_date }}
        </template>
      </n-modal>
    </div>
  </n-card>

  <n-tag type="error">
    免责声明：本软件用于学习交流，请勿用于非法用途！否则造成一切后果由使用者自行承担。使用本软件即代表同意此免责条款。
  </n-tag>
</template>

<style scoped></style>