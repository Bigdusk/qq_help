<script setup lang="ts">
import { DataTableColumns, DataTableInst, NButton } from 'naive-ui';
import { ref } from 'vue';
import { QQGroup } from '../../entity';
import { post } from '../../hooks/request_local';
import { changeTime } from '../../hooks';


function createColumns(): DataTableColumns<QQGroup> {
  return [
    {
      title: '群号',
      key: 'group_id'
    },
    {
      title: '群名称',
      key: 'group_name'
    },
    {
      title: '人数',
      key: 'member_count'
    },
    {
      title: '最大人数',
      key: 'max_member_count'
    },
    {
      title: '创建时间',
      key: 'group_create_time'
    }
  ]
}

const data = ref<QQGroup[]>([])

const pagination = false as const

const tableRef = ref<DataTableInst>()

const exportSorterAndFilterCsv = () =>
  tableRef.value?.downloadCsv({
    fileName: 'QQ好友',
    keepOriginalData: false
  })

const columns = createColumns()

//获取qq群列表
async function get_qq_group_list() {
  post<QQGroup[]>('/get_group_list', {
    "no_cache": true
  })
    .then(r => {
        r.forEach(group => {
            group.group_create_time = changeTime(group.group_create_time)
            data.value.push(group)
        })
    })
}

const show = ref(false)
</script>

<template>
  <h1>群数据导出</h1>
  <n-button @click="get_qq_group_list" type="success">
    获取所有群
  </n-button>
  -
  <n-button @click="exportSorterAndFilterCsv">
    导出 CSV
  </n-button>
  <n-spin :show="show">
    <template #description>
      喝杯咖啡吧
    </template>

    <n-card :bordered="false" hoverable>

      <n-data-table ref="tableRef" :columns="columns" :data="data" :pagination="pagination" :bordered="false" />

    </n-card>
  </n-spin>
</template>

<style scoped></style>