// hooks/useTableFilters.ts (Hook para filtros de tabla)
import { useState, useMemo, useCallback } from 'react'

interface TableFilters {
  search: string
  sortField: string
  sortDirection: 'asc' | 'desc'
  page: number
  pageSize: number
  filters: Record<string, any>
}

export const useTableFilters = (initialFilters: Partial<TableFilters> = {}) => {
  const [filters, setFilters] = useState<TableFilters>({
    search: '',
    sortField: '',
    sortDirection: 'asc',
    page: 1,
    pageSize: 20,
    filters: {},
    ...initialFilters
  })

  const updateFilter = useCallback((key: keyof TableFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset page when filtering
      page: key !== 'page' ? 1 : value
    }))
  }, [])

  const updateCustomFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value
      },
      page: 1
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      sortField: '',
      sortDirection: 'asc',
      page: 1,
      pageSize: 20,
      filters: {},
      ...initialFilters
    })
  }, [initialFilters])

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    
    if (filters.search) params.set('search', filters.search)
    if (filters.sortField) params.set('sortField', filters.sortField)
    if (filters.sortDirection !== 'asc') params.set('sortDirection', filters.sortDirection)
    if (filters.page > 1) params.set('page', filters.page.toString())
    if (filters.pageSize !== 20) params.set('pageSize', filters.pageSize.toString())
    
    Object.entries(filters.filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.set(key, value.toString())
      }
    })
    
    return params.toString()
  }, [filters])

  return {
    filters,
    updateFilter,
    updateCustomFilter,
    resetFilters,
    queryString,
    // Helpers
    setSearch: (search: string) => updateFilter('search', search),
    setSort: (field: string, direction: 'asc' | 'desc' = 'asc') => {
      updateFilter('sortField', field)
      updateFilter('sortDirection', direction)
    },
    setPage: (page: number) => updateFilter('page', page),
    setPageSize: (pageSize: number) => updateFilter('pageSize', pageSize)
  }
}