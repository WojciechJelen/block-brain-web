import { createClient as createServerClient } from './server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Server-side API call helper (for use in server components, server actions, and API routes)
export async function serverApiCall(endpoint: string, options: RequestInit = {}) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  }
  
  // Add Authorization header if user is authenticated
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })
  
  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorData}`)
  }
  
  return response.json()
}

// Type-safe wrapper for common HTTP methods (server-side only)
export const api = {
  get: (endpoint: string) => serverApiCall(endpoint, { method: 'GET' }),
  post: (endpoint: string, data: any) => serverApiCall(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  put: (endpoint: string, data: any) => serverApiCall(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  delete: (endpoint: string) => serverApiCall(endpoint, { method: 'DELETE' }),
} 