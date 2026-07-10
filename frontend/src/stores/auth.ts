/**
 * Auth Store — frontend authentication framework.
 *
 * Temporary credentials: admin / admin123
 *
 * Persistence: isAuthenticated + user saved to localStorage.
 * Token is reserved for future backend JWT integration.
 *
 * Architecture:
 *   Router Guard → authStore.checkAuth() → redirect or proceed
 *   LoginCard → authStore.login() → navigate to dashboard
 *   UserMenu → authStore.logout() → redirect to /login
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const AUTH_KEY = 'hospital_auth'
const TEMP_USER = 'admin'
const TEMP_PASS = 'admin123'

export interface AuthUser {
  username: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  // ── State ──
  const isAuthenticated = ref(false)
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(null)

  // ── Getters ──
  const isLoggedIn = computed(() => isAuthenticated.value && user.value !== null)

  // ── Actions ──

  /** Restore auth state from localStorage. Called once on app init. */
  function checkAuth(): boolean {
    try {
      const raw = localStorage.getItem(AUTH_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        isAuthenticated.value = data.isAuthenticated === true
        user.value = data.user ?? null
        token.value = data.token ?? null
        return isAuthenticated.value
      }
    } catch {
      clearAuthData()
    }
    return false
  }

  /** Attempt login with temporary credentials. */
  function login(username: string, password: string): boolean {
    if (username === TEMP_USER && password === TEMP_PASS) {
      isAuthenticated.value = true
      user.value = { username: TEMP_USER, role: 'Administrator' }
      token.value = 'temp-jwt-token'
      persistAuth()
      return true
    }
    return false
  }

  /** Logout — clear all state and localStorage. */
  function logout(): void {
    isAuthenticated.value = false
    user.value = null
    token.value = null
    clearAuthData()
  }

  // ── Private helpers ──

  function persistAuth(): void {
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      isAuthenticated: isAuthenticated.value,
      user: user.value,
      token: token.value,
    }))
  }

  function clearAuthData(): void {
    localStorage.removeItem(AUTH_KEY)
  }

  return {
    isAuthenticated,
    user,
    token,
    isLoggedIn,
    checkAuth,
    login,
    logout,
  }
})
