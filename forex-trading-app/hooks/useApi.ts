// hooks/useApi.ts (Custom hook para llamadas API)
import { useState, useCallback } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  showErrorToast?: boolean
}

export const useApi = <T = any>(options: UseApiOptions = {}) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const execute = useCallback(async (
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const result = await apiCall()
      setState({ data: result, loading: false, error: null })
      
      if (options.onSuccess) {
        options.onSuccess(result)
      }
      
      return result
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      
      if (options.onError) {
        options.onError(errorMessage)
      }
      
      if (options.showErrorToast) {
        // Aquí puedes integrar tu sistema de toasts
        console.error('API Error:', errorMessage)
      }
      
      return null
    }
  }, [options])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset
  }
}
