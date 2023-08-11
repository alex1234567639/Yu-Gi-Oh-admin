import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

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
        meta: { title: 'Dashboard', icon: 'el-icon-s-home', affix: true }
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
  // 戰報管理
  {
    path: '/battle_paper',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/battlePaper/index'),
        name: 'battle_paper',
        meta: {
          title: 'battlePaper',
          icon: 'excel',
          roles: ['battle_paper']
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
  // 富文本範例
  {
    path: '/tinymce',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tinymceDemo/index.vue'),
        name: 'Tinymce',
        meta: {
          title: '富文本範例',
          icon: 'documentation'
        }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },
  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'Example',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'Create Article', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: {
          title: 'Edit Article',
          noCache: true,
          activeMenu: '/example/list'
        },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },
  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'Zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'Export Zip' }
      }
    ]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'PDF', icon: 'pdf' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'Theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
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
