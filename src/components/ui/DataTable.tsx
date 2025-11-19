import React, { useState, useMemo } from 'react';
import { usePagination } from '../../hooks/usePagination';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  totalItems?: number;
  serverSidePagination?: boolean;
  onPageChange?: (page: number) => void;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
  actions?: (row: any) => React.ReactNode;
  searchable?: boolean;
  onSearch?: (search: string) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: any[]) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  totalItems = 0,
  serverSidePagination = false,
  onPageChange,
  onSort,
  loading = false,
  actions,
  searchable = false,
  onSearch,
  selectable = false,
  onSelectionChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: string } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());

  const pagination = usePagination({
    totalItems: serverSidePagination ? totalItems : data.length,
    pageSize,
    initialPage: currentPage,
  });

  const processedData = useMemo(() => {
    let processed = [...data];

    // Client-side sorting
    if (!serverSidePagination && sortConfig) {
      processed.sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Client-side search
    if (!serverSidePagination && search) {
      processed = processed.filter(row =>
        columns.some(col => {
          const value = row[col.key];
          return value?.toString().toLowerCase().includes(search.toLowerCase());
        })
      );
    }

    // Client-side pagination
    if (!serverSidePagination) {
      const start = (currentPage - 1) * pageSize;
      processed = processed.slice(start, start + pageSize);
    }

    return processed;
  }, [data, sortConfig, search, currentPage, pageSize, serverSidePagination, columns]);

  const handleSort = (columnKey: string) => {
    if (!columns.find(col => col.key === columnKey)?.sortable) return;

    const newDirection = sortConfig?.field === columnKey && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    const newSortConfig = { field: columnKey, direction: newDirection };
    
    setSortConfig(newSortConfig);
    onSort?.(columnKey, newDirection);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    if (serverSidePagination) {
      onSearch?.(value);
    }
  };

  const handleRowSelect = (row: any, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(row.id);
    } else {
      newSelected.delete(row.id);
    }
    setSelectedRows(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? new Set(processedData.map(row => row.id)) : new Set();
    setSelectedRows(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  const allSelected = processedData.length > 0 && processedData.every(row => selectedRows.has(row.id));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header con búsqueda */}
      {(searchable || selectable) && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {searchable && (
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}
            {selectable && selectedRows.size > 0 && (
              <div className="text-sm text-gray-600">
                {selectedRows.size} elemento(s) seleccionado(s)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {selectable && (
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="hover:text-gray-700 transition-colors"
                      >
                        {sortConfig?.field === column.key ? (
                          sortConfig.direction === 'asc' ? '↑' : '↓'
                        ) : (
                          '↕'
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  className="px-6 py-8 text-center"
                >
                  <div className="flex justify-center items-center space-x-2">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-600">Cargando...</span>
                  </div>
                </td>
              </tr>
            ) : processedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              processedData.map((row, index) => (
                <tr
                  key={row.id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={(e) => handleRowSelect(row, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {pagination.startIndex + 1} a {pagination.endIndex + 1} de{' '}
            {serverSidePagination ? totalItems : data.length} registros
          </div>
          <div className="flex gap-1">
            <button
              onClick={pagination.prevPage}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            
            {pagination.paginationRange.map((page: number | string, index: number) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && pagination.goToPage(page)}
                disabled={page === '...'}
                className={`px-3 py-1 border rounded-md min-w-[40px] ${
                  page === pagination.currentPage
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'border-gray-300 hover:bg-gray-50'
                } disabled:bg-transparent disabled:cursor-default`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={pagination.nextPage}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;