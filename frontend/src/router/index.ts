import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/pages/DashboardPage.vue'),
    },
    {
      path: '/assets',
      name: 'assets',
      component: () => import('@/pages/AssetsPage.vue'),
    },
    {
      path: '/snmp',
      name: 'snmp',
      component: () => import('@/pages/SnmpPage.vue'),
    },
    {
      path: '/topology',
      name: 'topology',
      component: () => import('@/pages/TopologyPage.vue'),
    },
    {
      path: '/inspection',
      name: 'inspection',
      component: () => import('@/pages/InspectionPage.vue'),
    },
    {
      path: '/alarms',
      name: 'alarms',
      component: () => import('@/pages/AlarmsPage.vue'),
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/pages/ReportsPage.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/SettingsPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// ── Auth Guard ──
router.beforeEach((to, _from) => {
  // Lazy access to avoid Pinia-not-initialized errors
  const auth = useAuthStore()

  // On first navigation, restore from localStorage
  if (!auth.isLoggedIn) {
    auth.checkAuth()
  }

  // Login page: redirect to dashboard if already authenticated
  if (to.name === 'login' && auth.isLoggedIn) {
    return { name: 'dashboard' }
  }

  // Protected routes: redirect to login if not authenticated
  const publicRoutes = ['login']
  if (!publicRoutes.includes(to.name as string) && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router
