/**
 * Centralized API Client — the ONLY module allowed to call fetch().
 *
 * Responsibilities:
 *   - Base URL configuration
 *   - Request timeout
 *   - JSON serialization / deserialization
 *   - Consistent error handling
 *   - Response envelope unwrapping
 *
 * Future extension points:
 *   - Authentication headers (Bearer token)
 *   - Retry logic (exponential backoff)
 *   - Request cancellation (AbortController)
 *   - Request/response interceptors
 *   - Rate limiting
 *
 * No Vue component, Pinia store, or service may call fetch() directly.
 */

import type { APIResponse, APIError } from '@/types/api'

// ── Configuration ─────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
const DEFAULT_TIMEOUT_MS = 10_000

// ── Custom Error ──────────────────────────────────────

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly detail?: string,
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

// ── Data Source Audit ──
const AUDIT_TAG = '[DataAudit:apiClient]'

// ── Helpers ───────────────────────────────────────────

function buildUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(`${BASE_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, v)
    })
  }
  return url.toString()
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: Record<string, string>,
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }

    const url = buildUrl(path, params)
    console.log(AUDIT_TAG, method, url)
    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    if (!response.ok) {
      let detail: string
      try {
        const errorBody = await response.json()
        // FastAPI validation errors return detail as array of objects
        const raw = errorBody.detail ?? errorBody.message ?? errorBody
        if (Array.isArray(raw)) {
          detail = raw.map((e: any) => e.msg || JSON.stringify(e)).join('; ')
        } else if (typeof raw === 'object' && raw !== null) {
          detail = JSON.stringify(raw)
        } else {
          detail = String(raw || response.statusText)
        }
      } catch {
        detail = response.statusText || `Request failed with status ${response.status}`
      }
      throw new ApiClientError(
        detail || `Request failed with status ${response.status}`,
        response.status,
        detail,
      )
    }

    // Unwrap the standard API envelope { success, message, data }
    const envelope: APIResponse<T> = await response.json()
    const result = envelope.data as T
    if (Array.isArray(result)) {
      console.log(AUDIT_TAG, method, url, '→', result.length, 'items')
    } else if (result && typeof result === 'object' && 'devices' in result) {
      const devs = (result as any).devices
      console.log(AUDIT_TAG, method, url, '→ wrapper with', Array.isArray(devs) ? devs.length : '?', 'devices')
    }
    return result
  } catch (err) {
    if (err instanceof ApiClientError) throw err

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiClientError('Request timed out', 408)
    }

    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new ApiClientError('Network error — is the backend running?', 0)
    }

    throw new ApiClientError(
      err instanceof Error ? err.message : 'Unknown error',
      0,
    )
  } finally {
    clearTimeout(timeoutId)
  }
}

// ── Public API ────────────────────────────────────────

export const apiClient = {
  get<T>(path: string, params?: Record<string, string>): Promise<T> {
    return request<T>('GET', path, undefined, params)
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('POST', path, body)
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('PUT', path, body)
  },

  delete<T>(path: string): Promise<T> {
    return request<T>('DELETE', path)
  },
}
