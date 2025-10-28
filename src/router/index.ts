import { createRouter, createWebHistory } from 'vue-router';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
    },
    {
      path: '/verify-otp',
      name: 'verify-otp',
      component: () => import('../views/auth/VerifyOTPView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/documents',
      name: 'documents',
      component: () => import('../views/documents/DocumentsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('../views/documents/UploadView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/folders',
      name: 'folders',
      component: () => import('../views/folders/FoldersView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard for authentication
router.beforeEach((
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some((record: any) => record.meta.requiresAuth);

  if (requiresAuth && !token) {
    // Redirect to login if trying to access protected route without token
    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'register') && token) {
    // Redirect to dashboard if trying to access auth pages while logged in
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;
