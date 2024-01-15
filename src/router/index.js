import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// 通用路由（不需權限也可訪問）
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'el-icon-s-home', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

// 動態路由以及權限控制，roles控制權限（主要邏輯在permission.js）
export const asyncRoutes = [
  // 會員管理
  {
    path: '/member',
    component: Layout,
    redirect: '/member/list',
    hidden: false,
    alwaysShow: true,
    name: 'member',
    meta: {
      title: 'member',
      icon: 'user',
      roles: ['member']
    },
    children: [
      // 會員列表
      {
        path: 'list',
        component: () => import('@/views/memberManage/memberList'),
        name: 'member_list',
        meta: {
          title: 'memberList' // 給i18n用
        }
      },
      // Form測試
      {
        path: 'form_test',
        component: () => import('@/views/memberManage/formTest'),
        name: 'form_test',
        meta: {
          title: 'Form測試'
        }
      }
    ]
  },
  // banner管理
  {
    path: '/banner',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/bannerManage/bannerList'),
        name: 'banner_list',
        meta: {
          title: 'banner', // 給i18n用
          icon: 'star',
          roles: ['banner']
        }
      }
    ]
  },
  // 文章列表-系列介紹
  {
    path: '/series_introduction',
    component: Layout,
    redirect: '/series_introduction/theme',
    hidden: false,
    alwaysShow: true,
    name: 'series_introduction',
    meta: {
      title: 'seriesIntroduction',
      icon: 'excel',
      roles: ['series_introduction']
    },
    children: [
      // 主題牌組
      {
        path: 'theme',
        component: () => import('@/views/seriesIntroduction/theme'),
        name: 'theme',
        meta: {
          title: 'theme'
        }
      },
      // 外掛
      {
        path: 'plugins',
        component: () => import('@/views/seriesIntroduction/plugins'),
        name: 'plugins',
        meta: {
          title: 'plugins'
        }
      }
    ]
  },
  // 文章列表-泛用卡介紹
  {
    path: '/useful_card_introduction',
    component: Layout,
    redirect: '/useful_card_introduction/single_card',
    hidden: false,
    alwaysShow: true,
    name: 'useful_card_introduction',
    meta: {
      title: 'usefulCardIntroduction',
      icon: 'excel',
      roles: ['useful_card_introduction']
    },
    children: [
      // 單卡介紹
      {
        path: 'single_card',
        component: () => import('@/views/usefulCardIntroduction/singleCard'),
        name: 'single_card',
        meta: {
          title: 'singleCard'
        }
      },
      // 戰術分析
      {
        path: 'strategy',
        component: () => import('@/views/usefulCardIntroduction/strategy'),
        name: 'strategy',
        meta: {
          title: 'strategy'
        }
      }
    ]
  },
  // 文章列表-上位卡表
  {
    path: '/meta_deck',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/metaDeck/index'),
        name: 'meta_deck',
        meta: {
          title: 'metaDeck',
          icon: 'excel',
          roles: ['meta_deck']
        }
      }
    ]
  },
  // 文章列表-產品介紹
  {
    path: '/production_information',
    component: Layout,
    redirect: '/production_information/pack',
    hidden: false,
    alwaysShow: true,
    name: 'production_information',
    meta: {
      title: 'productionInformation',
      icon: 'excel',
      roles: ['production_information']
    },
    children: [
      // 補充包
      {
        path: 'pack',
        component: () => import('@/views/productionInformation/pack'),
        name: 'pack',
        meta: {
          title: 'pack'
        }
      },
      // 預組
      {
        path: 'deck',
        component: () => import('@/views/productionInformation/deck'),
        name: 'deck',
        meta: {
          title: 'deck'
        }
      },
      // RD
      {
        path: 'rushDuel',
        component: () => import('@/views/productionInformation/rushDuel'),
        name: 'rushDuel',
        meta: {
          title: 'rushDuel'
        }
      },
      // Box
      {
        path: 'box',
        component: () => import('@/views/productionInformation/box'),
        name: 'box',
        meta: {
          title: 'box'
        }
      },
      // Other
      {
        path: 'other',
        component: () => import('@/views/productionInformation/other'),
        name: 'other',
        meta: {
          title: 'other'
        }
      }
    ]
  },
  // 文章列表-規則相關
  {
    path: '/rules',
    component: Layout,
    redirect: '/rules/precedent',
    hidden: false,
    alwaysShow: true,
    name: 'rules',
    meta: {
      title: 'rules',
      icon: 'excel',
      roles: ['rules']
    },
    children: [
      // 判例
      {
        path: 'precedent',
        component: () => import('@/views/rules/precedent'),
        name: 'precedent',
        meta: {
          title: 'precedent'
        }
      },
      // 禁卡表
      {
        path: 'forbidden_list',
        component: () => import('@/views/rules/forbiddenList'),
        name: 'forbidden_list',
        meta: {
          title: 'forbiddenList'
        }
      }
    ]
  },
  // 文章列表-卡片故事
  {
    path: '/series_story',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/seriesStory/index'),
        name: 'series_story',
        meta: {
          title: 'seriesStory',
          icon: 'excel',
          roles: ['series_story']
        }
      }
    ]
  },
  // 行事曆
  {
    path: '/calendar',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/calendar/index.vue'),
        name: 'calendar',
        meta: {
          title: 'calendar',
          icon: 'form',
          roles: ['calendar']
        }
      }
    ]
  },
  // 卡片管理
  {
    path: '/card',
    component: Layout,
    redirect: '/card/index',
    hidden: false,
    alwaysShow: true,
    name: 'cards',
    meta: {
      title: 'cards',
      icon: 'list',
      roles: ['cards']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/card/index.vue'),
        name: 'cards_list',
        meta: {
          title: 'cardsList'
        }
      },
      {
        path: 'add',
        component: () => import('@/views/card/cardAdd.vue'),
        name: 'cards_add',
        meta: {
          title: 'cardsAdd'
        }
      }
    ]
  },
  // Tag管理
  {
    path: '/tag',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tag/index.vue'),
        name: 'tag',
        meta: {
          title: 'tag',
          icon: 'table',
          roles: ['tag']
        }
      }
    ]
  },
  // 包裝分類管理
  {
    path: '/pack_type',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/packType/index.vue'),
        name: 'pack_type',
        meta: {
          title: 'packType',
          icon: 'tree',
          roles: ['pack_type']
        }
      }
    ]
  },
  // 權限管理
  {
    path: '/permit',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/permit/index.vue'),
        name: 'permit',
        meta: {
          title: 'permit',
          icon: 'lock',
          roles: ['permit']
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
