<script setup lang="ts">
import { DataTableColumns, DataTableInst, NButton } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { QQGroup, QQGroupMember, QQInfo } from '../../entity';
import { axios_util } from '../../hooks/request_local';
import { changeTime, exportExcel } from '../../hooks';


function createColumns(): DataTableColumns<QQInfo> {
  return [
    {
      title: '群名',
      key: 'group_name'
    },
    {
      title: '群组',
      key: 'group_id'
    },
    {
      title: 'QQ号',
      key: 'user_id'
    },
    {
      title: '昵称',
      key: 'nickname'
    },
    {
      title: '群名片',
      key: 'card'
    },
    {
      title: '性别',
      key: 'sex'
    },
    {
      title: '年龄',
      key: 'age'
    },
    {
      title: '等级',
      key: 'qq_level'
    },
    {
      title: '加群时间',
      key: 'join_time'
    },
    {
      title: '最近发言时间',
      key: 'last_sent_time'
    },
    {
      title: '头衔',
      key: 'title'
    },
    {
      title: '角色',
      key: 'role'
    },
    {
      title: '邮箱',
      key: 'email'
    }
  ]
}

const data = ref<QQGroupMember[]>([])

const tableRef = ref<DataTableInst>()

const exportSorterAndFilterCsv = () => {
  tableRef.value?.downloadCsv({
    fileName: 'QQ群:' + select.value,
    keepOriginalData: false
  })
}
  

const columns = createColumns()

const show = ref(false)

const select = ref<null | number>(null)
//获取群名称
const qq_group = ref<QQGroup[]>([])

const get_group_name = (group_id: number|null): string => {
  let name = ''
  qq_group.value.forEach(r => {
    if (r.group_id === group_id) {
      name = r.group_name
    }
  })

  return name
}

const options = ref<{
  label: string
  value: number
}[]>([])

onMounted(() => {
  get_qq_group_list()
})


//获取群列表
let controller: AbortController | null = null

const get_qq_group_list = async () => {
  //有控制器先取消
  controller && controller.abort()
  controller = new AbortController()

  const r = await axios_util.post('/get_group_list', { "no_cache": true }, { signal: controller.signal })
  qq_group.value = r.data
  //添加到动态数组
  options.value.length = 0
  r.data.forEach((qq_group: QQGroup) => {
    options.value.push(
      {
        label: qq_group.group_id + qq_group.group_name + '(' + qq_group.member_count + '/' + qq_group.max_member_count + ')',
        value: qq_group.group_id
      }
    )
  })
}

//导出qq群数据
var controller2: AbortController = controller2 = new AbortController()

const get_qq_group_member_all = async () => {
  show.value = true
  //有控制器先取消
  if (controller2) {
    controller2.abort()
    controller2 = new AbortController()
  }

  const r = await axios_util.post('/get_group_member_list', { "group_id": select.value, "no_cache": true }, { signal: controller2.signal })

  data.value.length = 0
  //批量请求
  let index = 0
  let timeoutId = await setInterval(async () => {
    if (index >= 0 && index < r.data.length) {
      const qq_group = await axios_util.post('/get_group_member_info', { "group_id": select.value, "user_id": r.data[index++].user_id }, { signal: controller2.signal })
      data.value.push(transformMember(qq_group.data))
    } else {
      clearInterval(timeoutId)
      return
    }
  }, 100);
  index = 0
  show.value = false
}

const transformMember = (member: QQGroupMember): QQGroupMember => {
  if (member.sex === 'male') {
    member.sex = '男';
  } else if (member.sex === 'female') {
    member.sex = '女';
  }

  if (member.role === 'owner') {
    member.role = '群主';
  } else if (member.role === 'admin') {
    member.role = '管理';
  } else if (member.role === 'member') {
    member.role = '成员';
  }

  member.join_time = changeTime(member.join_time);
  member.last_sent_time = changeTime(member.last_sent_time);
  member.email = member.user_id + '@qq.com';
  member.group_name = get_group_name(member.group_id);

  return member;
};
//快速导出
var controller3: AbortController = controller3 = new AbortController()
const fast_qq_group_member = async () => {
  show.value = true
  //有控制器先取消
  if (controller3) {
    controller3.abort()
    controller3 = new AbortController()
  }

  const r = await axios_util.post('/get_group_member_list', { "group_id": select.value, "no_cache": true }, { signal: controller3.signal })
  data.value.length = 0
  r.data.forEach((qq_group_member: QQGroupMember) => {
    data.value.push(transformMember(qq_group_member))
  })
  show.value = false
}

//群组所有导出
var controller4: AbortController = controller4 = new AbortController()
const fast_qq_group_member_all = async () => {
  show.value = true
  //有控制器先取消
  if (controller4) {
    controller4.abort()
    controller4 = new AbortController()
  }

  data.value.length = 0
  options.value.forEach(async (group) => {
    const group_member = await axios_util.post('/get_group_member_list', { "group_id": group.value, "no_cache": true }, { signal: controller4.signal })
    group_member.data.forEach((qq_group_member: QQGroupMember) => {
      data.value.push(transformMember(qq_group_member))
    })
    show.value = false
  })
}


const titleArr = ['群号','QQ号','昵称','群名片','性别','年龄','等级','加群时间','最近发言时间','角色','头衔','邮箱']
</script>

<template>
  <h1>QQ群数据导出</h1>

  <n-flex>
    <n-select style="width: 400px;" v-model:value="select" :options="options" />

    <n-button @click="get_qq_group_list">
      刷新群列表
    </n-button>

    <n-space>
      <n-button @click="fast_qq_group_member" type="success">
        快速抓取
      </n-button>
      <n-button @click="get_qq_group_member_all" type="warning">
        慢速抓取(信息比较全)
      </n-button>
      <n-button @click="fast_qq_group_member_all" type="error">
        全部群组成员抓取
      </n-button>
    </n-space>
  </n-flex>
  <n-badge :value="data.length">
    <n-button @click="exportSorterAndFilterCsv">
      导出 CSV
    </n-button>
    -
    <n-button @click="exportExcel(data, 'QQ群:' + get_group_name(select)+'('+ select +')', titleArr, 'QQ群:' + select)">
      导出 EXCEL
    </n-button>
  </n-badge>

  <n-spin :show="show">
    <template #description>
      喝杯咖啡吧
    </template>

    <n-card content-style="padding: 10px;" :bordered="false" hoverable>
      <n-data-table ref="tableRef" :columns="columns" :data="data" :max-height="700" :scroll-x="1800" virtual-scroll />
    </n-card>
  </n-spin>
</template>

<style scoped></style>