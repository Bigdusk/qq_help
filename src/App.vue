<script setup lang="ts">
import { RouterView } from 'vue-router';
import { to_index, to_qq_add_in_bulk, to_qq_delete, to_qq_export, to_qq_group_add_in_bulk, to_qq_group_export, to_qq_group_supervision_and_scraping } from './hooks/router';
import { onMounted, ref } from 'vue';
import { createFingerprint } from './hooks';
import { Computer } from './entity';
import { post } from './hooks/request';
import { auth } from './hooks/auth';
const computer = ref<Computer>({
  authorization_id: 0,
  computer_id: '',
  expires_at: null,
  is_active: null
})

//获取电脑信息
async function get_computer_info() {
  computer.value.computer_id = localStorage.getItem('fingerprint') as string

  post<Computer>('/computer/info', computer.value).then(r => {
        computer.value = r
    })
}

onMounted(async () => {
  console.log('系统初始化');
  //将游览器指纹缓存
  localStorage.setItem('fingerprint', await createFingerprint())
  get_computer_info()
  auth(() => {})
})
</script>

<template>
  <n-layout embedded style="height: 100vh">
    <n-layout-header style="height: 64px; padding: 24px" bordered>
      QQ_HELP
    </n-layout-header>
    <n-layout position="absolute" style="top: 64px; bottom: 64px" has-sider>

      <n-layout-sider collapse-mode="width" :collapsed-width="120" :width="240" show-trigger="arrow-circle"
        content-style="padding: 12px;" bordered>
        <n-layout>
          <n-button @click="to_index" style="width: 100%;" type="primary">
            首页
          </n-button>
          <n-button style="width: 100%;">设置</n-button>
          <n-divider title-placement="left">
            QQ
          </n-divider>
          <n-button @click="auth(to_qq_export)">好友数据导出</n-button>
          <n-button @click="auth(to_qq_add_in_bulk)">批量好友添加</n-button>
          <n-button @click="auth(to_qq_delete)">好友一键删除</n-button>
          <n-divider title-placement="left">
            群
          </n-divider>
          <n-button @click="auth(to_qq_group_export)">群成员数据导出</n-button>
          <n-button @click="auth(to_qq_group_add_in_bulk)">批量加群</n-button>
          <n-button @click="auth(to_qq_group_supervision_and_scraping)">关键词监控抓取成员数据</n-button>
        </n-layout>

      </n-layout-sider>

      <n-layout content-style="padding: 24px;" :native-scrollbar="false">

        <KeepAlive>
          <RouterView />
        </KeepAlive>

      </n-layout>
    </n-layout>
    <n-layout-footer position="absolute" style="height: 64px; padding: 24px" bordered>
      版本: 0.0.1 | 软件使用到期时间: {{computer.expires_at}} <n-button>卡密兑换</n-button>
    </n-layout-footer>
  </n-layout>
</template>

<style scoped></style>