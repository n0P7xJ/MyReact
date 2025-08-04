import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    siblingCount?: number; // скіко сторінок зліва/справа
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   totalPages,
                                                   siblingCount = 3,
                                                   onPageChange,
                                               }) => {
    const range = (start: number, end: number) => {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const DOTS = '...';

    const getPaginationRange = (): (number | string)[] => {
        const totalPageNumbers = siblingCount * 2 + 5;

        if (totalPages <= totalPageNumbers) {
            return range(1, totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const showLeftDots = leftSiblingIndex > 2;
        const showRightDots = rightSiblingIndex < totalPages - 1;

        const pagination: (number | string)[] = [];

        if (!showLeftDots && showRightDots) {
            const leftItemCount = siblingCount * 2 + 2;
            const leftRange = range(1, leftItemCount);
            pagination.push(...leftRange, DOTS, totalPages);
        } else if (showLeftDots && !showRightDots) {
            const rightItemCount = siblingCount * 2 + 2;
            const rightRange = range(totalPages - rightItemCount + 1, totalPages);
            pagination.push(1, DOTS, ...rightRange);
        } else if (showLeftDots && showRightDots) {
            pagination.push(1, DOTS, ...range(leftSiblingIndex, rightSiblingIndex), DOTS, totalPages);
        }

        return pagination;
    };

    const paginationRange = getPaginationRange();

    return (
        <div className="flex justify-center mt-6 gap-2 flex-wrap text-sm text-gray-700 dark:text-gray-300">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="btn px-3"
            >
                ←
            </button>

            {paginationRange.map((page, idx) =>
                typeof page === "number" ? (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`btn px-3 ${page === currentPage ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                    >
                        {page}
                    </button>
                ) : (
                    <button
                        key={`dots-${idx}`}
                        onClick={() => {
                            const prev = paginationRange[idx - 1];
                            const next = paginationRange[idx + 1];

                            if (typeof next === "number" && typeof prev === "number") {
                                const isLeftDots = prev === 1;
                                const isRightDots = next === totalPages;

                                if (isLeftDots) {
                                    onPageChange(next - 1); // наприклад, з 6 → 5
                                } else if (isRightDots) {
                                    onPageChange(prev + 1); // наприклад, з 10 → 11
                                }
                            }

                        }}
                        className="px-2">...</button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="btn px-3"
            >
                →
            </button>
        </div>
    );
};

export default Pagination;
