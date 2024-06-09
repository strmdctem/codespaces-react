import { isMobile } from "../utils";

export const fdColumns = [
    {
        accessorKey: 'tenure',
        header: 'Tenure',
        enableColumnPinning: true,
        enableSorting: false,
        Cell: ({ renderedCellValue }) => {
            return isMobile()
                ? <div className="i-cell-value">{renderedCellValue}</div> : renderedCellValue;
        }
    },
    {
        accessorKey: 'general',
        header: 'General',
        size: 0,
        Cell: ({ renderedCellValue, row, column }) => {
            return (
                <span className={row.original[`general_isTop`] ? "isTop" : ""}>
                    {renderedCellValue}
                </span>
            );
        },
        sortingFn: (rowA, rowB, columnId) => {
            let valA = rowA.original[columnId];
            let valB = rowB.original[columnId];
            return Number(valB) - Number(valA);
        }
    },
    {
        accessorKey: 'senior',
        header: 'Senior',
        senior: 0,
        Cell: ({ renderedCellValue, row, column }) => {
            return (
                <span className={row.original[`senior_isTop`] ? "isTop" : ""}>
                    {renderedCellValue}
                </span>
            );
        },
        sortingFn: (rowA, rowB, columnId) => {
            let valA = rowA.original[columnId];
            let valB = rowB.original[columnId];
            return Number(valB) - Number(valA);
        }
    }
];

export default fdColumns;