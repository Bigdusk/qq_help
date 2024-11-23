<script setup lang="ts">
import { ref } from 'vue'
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { QQFriendInfo, QQInfo } from '../../entity';
import { get, post } from '../../hooks/request_local';
import { dialog, message } from '../../hooks/discrete_api';


function createColumns(): DataTableColumns<QQInfo> {
  return [
    {
      type: 'selection'
    },
    {
      title: '组',
      key: 'group'
    },
    {
      title: 'QQ',
      key: 'user_id'
    },
    {
      title: '名称',
      key: 'nickname'
    },
    {
      title: '备注',
      key: 'remark'
    },
    {
      title: '年龄',
      key: 'age'
    },
    {
      title: '性别',
      key: 'sex'
    }
  ]
}

const data = ref<QQInfo[]>([])

const show = ref(false)
const checkedRowKeysRef = ref<DataTableRowKey[]>([])

const columns = createColumns()
const pagination = {
  pageSize: 14
}

const rowKey = (row: QQInfo) => row.user_id

function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeysRef.value = rowKeys
}

//获取qq好友
async function get_qq_friend_all() {
  show.value = true
  data.value.length = 0
  get<QQFriendInfo[]>('/get_friends_with_category')
    .then(r => {
      r.forEach(qq_group => {
        qq_group.buddyList.forEach(qq_info => {
          //拼装好友到表格
          qq_info['group'] = qq_group.categoryName
          //替换
          if (qq_info.sex === 'male') {
            qq_info.sex = '男'
          } else {
            qq_info.sex = '女'
          }
          data.value.push(qq_info)
        })
      });
      show.value = false
    })
}

//批量删除
async function delete_qq_friend() {
  is_button.value = true
  //循环删除QQ号
  checkedRowKeysRef.value.forEach(qq_number => {
    post('/delete_friend', {
      "user_id": qq_number
    })
      .then(() => {
      })
  })
  //刷新选择qq
  checkedRowKeysRef.value.length = 0
  message.success('删除成功')
  is_button.value = false
}

function handleConfirm() {
  dialog.warning({
    title: '警告',
    content: '你确定？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      delete_qq_friend()
    },
    onNegativeClick: () => {
      message.error('取消')
    }
  })
}

const is_button = ref(false)
</script>

<template>
  <h1>QQ好友一键删除</h1>
  <n-button @click="get_qq_friend_all" :disabled="is_button" type="success">
    刷新好友
  </n-button>
  -
  <n-button @click="handleConfirm" :disabled="is_button" type="error">
    删除选中好友
  </n-button>
  -
  <n-tag :bordered="false" type="error">
    如果想要恢复好友请访问: https://huifu.qq.com/index.html
  </n-tag>
  <n-spin :show="show">
    <template #description>
      喝杯咖啡吧
    </template>

    <n-card :bordered="false" hoverable>

      <n-data-table :columns="columns" :data="data" :pagination="pagination" :row-key="rowKey"
        @update:checked-row-keys="handleCheck" />

    </n-card>
  </n-spin>
</template>

<style scoped></style>