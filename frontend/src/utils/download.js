export function downloadJSON(filename, obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export const downloadCSV = (filename, headers, rows) => {
    let csvContent = "";

    csvContent += headers.join(",") + "\n";

    rows.forEach((row) => {
        const safeRow = row.map((cell) => {
            if (cell === null || cell === undefined) return "";
            const str = String(cell);
            return str.includes(",") ? `"${str}"` : str;
        });

        csvContent += safeRow.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};
