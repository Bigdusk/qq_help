<script setup lang="ts">
import { ref } from 'vue'
import type { TabsProps } from 'naive-ui'

const placement = ref<NonNullable<TabsProps['placement']>>('left')
const type = ref<TabsProps['type']>('card')

</script>

<template>
  <h1>设置</h1>

  <n-tabs
      :key="type + placement"
      :type="type"
      animated
      :placement="placement">
      <n-tab-pane name="index" tab="通用设置">
        建设
      </n-tab-pane>
    </n-tabs>
</template>

<style scoped>

</style>