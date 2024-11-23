<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { notification } from '../../hooks/discrete_api';
import { QQGroupMember, QQInfo, SocketMessage } from '../../entity';
import { changeTime, uniqueArrayOfObjects } from '../../hooks';
import QQGroupSupervisionAndScrapingSetting from '../../components/group/QQGroupSupervisionAndScrapingSetting.vue';
import { DataTableColumns, DataTableInst } from 'naive-ui';
import { post } from '../../hooks/request_local';

//开启监听
const socket = ref<WebSocket | null>(null);
const openWebSocket = () => {
  open_or_close.value = !open_or_close.value
  socket.value = new WebSocket('ws://127.0.0.1:3001')

  socket.value.onopen = () => {
    notification.success({ title: '开始监听', duration: 5000, })
  }

  socket.value.onmessage = (event) => {
    const t = JSON.parse(event.data)
    console.log(t);
    //写入数据
    if (JSON.parse(event.data).sub_type === 'normal') {
      //先判断数据长度，过长清除
      if (items.value.length > 30) {
        items.value.length = 0
      }

      //判断是否存在关键字然后根据关键字存储数据
      const key_string = localStorage.getItem('key_string')

      if (key_string !== null && Array(JSON.parse(key_string)).length > 0) {
        //记录数据
        Array(JSON.parse(key_string)).forEach(key => {
          if (String(t.raw_message).includes(key)) {
            //调用接口获取详细数据
            post<QQGroupMember>('/get_group_member_info',
              {
                "group_id": t.group_id,
                "user_id": t.user_id
              }
            )
              .then(r => {
                //替换
                if (r.sex === 'male') {
                  r.sex = '男'
                } else {
                  r.sex = '女'
                }

                if (r.role === 'owner') {
                  r.role = '群主'
                }
                if (r.role === 'admin') {
                  r.role = '管理'
                }
                if (r.role === 'member') {
                  r.role = '成员'
                }
                r.join_time = changeTime(r.join_time)
                r.last_sent_time = changeTime(r.last_sent_time)
                r.email = r.user_id + '@qq.com'
                data.value.push(r)
                //缓存所抓取数据
                localStorage.setItem('data', JSON.stringify(data.value))
              })


          }
        })
      }
      items.value.push(t)
    }

  }

  socket.value.onerror = (error) => {
    notification.success({ title: JSON.stringify(error) })
  }

  socket.value.onclose = () => {
    notification.warning({ title: '关闭监听', duration: 10000, })
  }
}
//关闭监听
const closeWebSocket = () => {
  open_or_close.value = !open_or_close.value
  socket.value?.close()
}

//http://q1.qlogo.cn/g?b=qq&nk=QQ号码&s=100
const items = ref<SocketMessage[]>([])

const open_or_close = ref(true)


//数据
const tableRef = ref<DataTableInst>()
const exportSorterAndFilterCsv = () =>
  tableRef.value?.downloadCsv({
    fileName: '抓取数据',
    keepOriginalData: false
  })

function createColumns(): DataTableColumns<QQInfo> {
  return [
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
const columns = createColumns()
const pagination = false as const

//一键去重复
const set_arry = () => {
  data.value = uniqueArrayOfObjects(data.value)
  localStorage.setItem('data', JSON.stringify(data.value))
}
//一键删除缓存数据
const delete_data = () => {
  data.value.length = 0
  localStorage.removeItem('data')
}

//初始化加载上次数据
onMounted(() => {
  const t = localStorage.getItem('data')
  if(t) {
    data.value = JSON.parse(t)
  }
})
</script>

<template>
  <h1>关键词抓取</h1>
  <n-button v-if="open_or_close" @click="openWebSocket">
    开启监听
  </n-button>
  <n-button v-if="!open_or_close" @click="closeWebSocket">
    关闭监听
  </n-button>-
  <QQGroupSupervisionAndScrapingSetting />
  <n-tabs type="line" animated>
    <n-tab-pane name="JK" tab="监控">

      <n-card :bordered="false" hoverable>

        <n-infinite-scroll style="max-height: 70vh;" :distance="10">
          <div v-for="i in items" :key="i.message_id" class="item">
            <n-card embedded :bordered="false">
              <n-space v-if="i.sub_type === 'normal'">

                <n-tag round :bordered="false">
                  {{ i.user_id }}
                  <template #avatar>
                    <n-avatar :src="'http://q1.qlogo.cn/g?b=qq&nk=' + i.user_id + '&s=100'" />
                  </template>
                </n-tag>
                <n-tag type="info">
                  群{{ i.group_id }}
                </n-tag>
                <n-tag checkable> {{ changeTime(i.time) }} </n-tag>
              </n-space>

              <n-space v-if="i.sub_type === 'friend'">

                <n-tag round :bordered="false">
                  {{ i.user_id }}
                  <template #avatar>
                    <n-avatar :src="'http://q1.qlogo.cn/g?b=qq&nk=' + i.user_id + '&s=100'" />
                  </template>
                </n-tag>
                <n-tag type="success">
                  好友
                </n-tag>
                <n-tag checkable> {{ changeTime(i.time) }} </n-tag>
              </n-space>
              说: {{ i.raw_message }}
            </n-card>
          </div>
        </n-infinite-scroll>

      </n-card>

    </n-tab-pane>
    <n-tab-pane name="data" tab="数据">
        <n-button @click="exportSorterAndFilterCsv">
          导出 CSV
        </n-button>
        <n-button @click="set_arry">
          一键去重
        </n-button>
        <n-button @click="delete_data">
          一键清除表格数据
        </n-button>
      <n-card :bordered="false" hoverable>

        <n-data-table ref="tableRef" :columns="columns" :data="data" :pagination="pagination" :bordered="false" />

      </n-card>

    </n-tab-pane>
  </n-tabs>
</template>

<style scoped></style>