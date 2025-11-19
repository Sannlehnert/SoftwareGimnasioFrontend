import { useState, useMemo } from 'react';

interface UsePaginationProps {
  totalItems: number;
  pageSize?: number;
  initialPage?: number;
}

export const usePagination = ({
  totalItems,
  pageSize = 10,
  initialPage = 1,
}: UsePaginationProps): any => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / pageSize);

  const paginationRange = useMemo(() => {
    const delta = 2; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [totalItems, pageSize, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    totalPages,
    paginationRange,
    goToPage,
    nextPage,
    prevPage,
    startIndex: (currentPage - 1) * pageSize,
    endIndex: Math.min(currentPage * pageSize - 1, totalItems - 1),
  };
};