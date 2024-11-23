import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../tag_view/IndexView.vue')
    },
    {
      path: '/qq_export',
      component: () => import('../tag_view/qq/QQExport.vue')
    },
    {
      path: '/qq_add_in_bulk',
      component: () => import('../tag_view/qq/QQAddInBulk.vue')
    },
    {
      path: '/qq_delete',
      component: () => import('../tag_view/qq/QQDelete.vue')
    },
    {
      path: '/qq_group_export',
      component: () => import('../tag_view/group/QQGroupExport.vue')
    },
    {
      path: '/group_export',
      component: () => import('../tag_view/group/GroupExport.vue')
    },
    {
      path: '/qq_group_add_in_bulk',
      component: () => import('../tag_view/group/QQGroupAddInBulk.vue')
    },
    {
      path: '/qq_group_supervision_and_scraping',
      component: () => import('../tag_view/group/QQGroupSupervisionAndScraping.vue')
    },
    {
      path: '/setting',
      component: () => import('../tag_view/Settings.vue')
    },
    {
      path: '/qq_message',
      component: () => import('../tag_view/message/QQMessage.vue')
    },
    {
      path: '/email_send',
      component: () => import('../tag_view/message/EmailSend.vue')
    }
  ]
})

export default router