import { FolderArrowDownIcon } from "@heroicons/react/24/outline";
import { ExportDataToExcel } from "./ExportToExcel.js"

const ExportExcelButton = ({ data, fileName = "ExportedData" }) => {
    return (
        <button
            type="button"
            onClick={() => ExportDataToExcel(data, fileName)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-green-700 transition"
        >
            <span>Xuất excel</span>
            <FolderArrowDownIcon className="w-6 h-6" />
        </button>
    );
};

export default ExportExcelButton;
