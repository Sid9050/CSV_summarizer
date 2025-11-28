import React from "react";

export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <div className="flex items-center gap-2 mt-4">
            <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={page === 1}
            >
                Prev
            </button>

            {start > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="px-2 py-1 border rounded"
                    >
                        1
                    </button>
                    {start > 2 && <span className="px-2">...</span>}
                </>
            )}

            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-1 border rounded ${
                        p === page ? "bg-blue-600 text-white" : ""
                    }`}
                >
                    {p}
                </button>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span className="px-2">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="px-3 py-1 border rounded"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={page === totalPages}
            >
                Next
            </button>
        </div>
    );
}
