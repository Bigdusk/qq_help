<script setup lang="ts">
import { DataTableColumns, DataTableInst, NButton } from 'naive-ui';
import { ref } from 'vue';
import { QQFriendInfo, QQInfo } from '../../entity';
import { axios_util } from '../../hooks/request_local';


function createColumns(): DataTableColumns<QQInfo> {
  return [
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
    },
    {
      title: '邮箱',
      key: 'email'
    },
  ]
}

const data = ref<QQInfo[]>([])

const pagination = false as const

const tableRef = ref<DataTableInst>()

const exportSorterAndFilterCsv = () =>
  tableRef.value?.downloadCsv({
    fileName: 'QQ好友',
    keepOriginalData: false
  })

const columns = createColumns()

//加载幕布
const show = ref(false)


//声明控制器
let controller: AbortController | null = null

const get_qq_friend_all = async () => {
  //先取消异步运行时
  cancelController()

  show.value = true
  //创建临时控制器
  controller = new AbortController
  //获取qq好友数据包括分组所有
  const r = await axios_util.get('/get_friends_with_category', {
    signal: controller.signal
  })

  //进行格式整理
  r.data.forEach((qq_group: QQFriendInfo) => {
    qq_group.buddyList.forEach(qq_info => {
      //拼装好友到表格
      qq_info['group'] = qq_group.categoryName
      //替换
      if (qq_info.sex === 'male') {
        qq_info.sex = '男'
      } else {
        qq_info.sex = '女'
      }
      qq_info.email = qq_info.user_id + '@qq.com'
      data.value.push(qq_info)
    })
  })

  console.log(r.data);
  show.value = false
}

//取消异步执行
const cancelController = () => {
  controller && controller.abort()
}

</script>

<template>
  <h1>QQ好友一键导出</h1>
  <n-button @click="get_qq_friend_all" type="success">
    获取所有好友
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