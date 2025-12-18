import { saveAs } from "file-saver";
import * as XLSX from "xlsx-js-style";

export const ExportDataToExcel = (data, fileName = "ExportedData") => {
    if (!data || data.length === 0) {
        alert("Không có dữ liệu để xuất Excel!");
        return;
    }

    const headers = Object.keys(data[0]);

    // Chuyển dữ liệu thành dạng Excel
    const formattedData = [
        headers,
        ...data.map((row) => headers.map((header) => row[header] || "")),
    ];

    // Tạo sheet từ dữ liệu
    const worksheet = XLSX.utils.aoa_to_sheet(formattedData);

    // ======= Định dạng Header =======
    headers.forEach((key, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex }); // Lấy ô header
        worksheet[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 }, // Chữ trắng, in đậm
            alignment: { horizontal: "center", vertical: "center" },
            fill: { patternType: "solid", fgColor: { rgb: "4CAF50" } }, // Nền xanh lá
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
        };
    });

    // ======= Định dạng nội dung bảng =======
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = 1; R <= range.e.r; R++) {
        for (let C = 0; C <= range.e.c; C++) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            if (!worksheet[cellAddress]) continue;

            worksheet[cellAddress].s = {
                font: { color: { rgb: "000000" }, sz: 11 },
                alignment: {
                    horizontal: C === 0 ? "center" : "left",
                    vertical: "center",
                },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };
        }
    }

    // ======= Thêm filter =======
    worksheet["!autofilter"] = { ref: XLSX.utils.encode_range(range) };

    // ======= Độ rộng cột =======
    worksheet["!cols"] = headers.map(() => ({ wch: 20 }));

    // Tạo workbook & xuất file
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const excelBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const uniqueFileName = fileName || `Export_${Date.now()}.xlsx`;
    saveAs(excelBlob, uniqueFileName);
};
