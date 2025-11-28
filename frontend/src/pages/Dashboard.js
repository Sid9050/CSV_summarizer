import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import { downloadCSV, downloadJSON } from "../utils/download";

export default function Dashboard() {
    const API = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8); 

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        setFile(f);
    };

    const handleUpload = async () => {
        if (!file) return alert("Select CSV file first");
        if (!token) return alert("Login required");

        setLoading(true);
        const form = new FormData();
        form.append("file", file);

        try {
            const res = await fetch(`${API}/api/upload`, {
                method: "POST",
                headers: { Authorization: "Bearer " + token },
                body: form,
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || "Upload failed");
                setLoading(false);
                return;
            }
            setSummary(data);
            setPage(1);
        } catch (err) {
            alert("Upload failed");
        }
        setLoading(false);
    };

    const filteredColumns = summary
        ? summary.columns.filter((c) =>
              c.toLowerCase().includes(filter.trim().toLowerCase())
          )
        : [];

    const totalPages = Math.max(
        1,
        Math.ceil(filteredColumns.length / pageSize)
    );
    const startIdx = (page - 1) * pageSize;
    const pageCols = filteredColumns.slice(startIdx, startIdx + pageSize);

    const handleDownloadCSV = () => {
        if (!summary) return alert("Upload CSV file first");
        const headers = [
            "Sr No",
            "Column Name",
            "Data Type",
            "Missing",
            "Values Present",
        ];

        const rows = summary.columns.map((col, idx) => {
            const missing = summary.missing_values[col] ?? 0;
            const present = summary.total_rows - missing;
            const dtype = summary.data_types[col] ?? "";
            return [idx + 1, col, dtype, missing, present];
        });

        downloadCSV("summary.csv", headers, rows);
    };

    const handleDownloadJSON = () => {
        if (!summary) return alert("Upload CSV file first");
        downloadJSON("summary.json", summary);
    };

    const handleClear = () => {
        setSummary(null);
        setFile(null);
        setFilter("");
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar onLogout={handleClear} />

            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <input
                            accept=".csv"
                            type="file"
                            onChange={handleFileChange}
                            className="p-2 border rounded bg-white dark:bg-gray-700"
                        />
                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? "Processing..." : "Upload CSV"}
                        </button>

                        <div className="ml-auto flex items-center gap-2">
                            <button
                                onClick={handleDownloadCSV}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                disabled={!summary}
                            >
                                Download CSV
                            </button>
                            <button
                                onClick={handleDownloadJSON}
                                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                disabled={!summary}
                            >
                                Download JSON
                            </button>
                        </div>
                    </div>
                </div>

                {summary && (
                    <>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm">
                                    Filter columns:
                                </label>
                                <input
                                    value={filter}
                                    onChange={(e) => {
                                        setFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    className="px-3 py-2 border rounded bg-white dark:bg-gray-700"
                                    placeholder="Search column name"
                                />
                            </div>

                            <div className="ml-auto flex items-center gap-3">
                                <label className="text-sm">Rows per page</label>
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="px-2 py-1 border rounded bg-white dark:bg-gray-700"
                                >
                                    {[5, 8, 10, 15].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                            <h3 className="text-lg font-semibold mb-3">
                                Column Details
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300 dark:border-gray-700">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                        <tr>
                                            <th className="border px-4 py-2 text-left">
                                                Sr. No.
                                            </th>
                                            <th className="border px-4 py-2 text-left">
                                                Column Name
                                            </th>
                                            <th className="border px-4 py-2 text-left">
                                                Data Type
                                            </th>
                                            <th className="border px-4 py-2 text-left">
                                                Missing Values
                                            </th>
                                            <th className="border px-4 py-2 text-left">
                                                Values Present
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {pageCols.map((col, idx) => {
                                            const globalIndex = startIdx + idx;
                                            const missing =
                                                summary.missing_values[col] ??
                                                0;
                                            const present =
                                                summary.total_rows - missing;
                                            const dtype =
                                                summary.data_types[col] ?? "";

                                            return (
                                                <tr
                                                    key={col}
                                                    className="odd:bg-white even:bg-gray-50 dark:even:bg-gray-800"
                                                >
                                                    <td className="border px-4 py-2">
                                                        {globalIndex + 1}
                                                    </td>
                                                    <td className="border px-4 py-2 font-medium">
                                                        {col}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {dtype}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        <span
                                                            className={
                                                                missing === 0
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }
                                                        >
                                                            {missing}
                                                        </span>
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {present}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
