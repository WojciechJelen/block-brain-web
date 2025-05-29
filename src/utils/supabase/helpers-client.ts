import { createClient } from './client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Client-side API call helper (for use in client components)
export async function clientApiCall(endpoint: string, options: RequestInit = {}) {
  const supabase = createClient()
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

// Type-safe wrapper for common HTTP methods (client-side only)
export const api = {
  get: (endpoint: string) => clientApiCall(endpoint, { method: 'GET' }),
  post: (endpoint: string, data: any) => clientApiCall(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  put: (endpoint: string, data: any) => clientApiCall(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  delete: (endpoint: string) => clientApiCall(endpoint, { method: 'DELETE' }),
} 