import { Link } from "@mui/material";
import { isMobile } from "../utils";

const commonColumnConfig = {
    enableColumnPinning: false,
    size: 0
};

const fdColumns = [
    {
        accessorKey: 'name',
        header: 'Name',
        size: 50,
        Cell: ({ renderedCellValue, row }) => {
            const cellValueClass = `cell-value ${isMobile() ? 'cell-value-m' : ''}`;
            const logoSrc = `/logos/${row.original.key}.svg`;

            return (
                <Link underline="none">
                    <div className={cellValueClass}>
                        <img className="logo" src={logoSrc} />
                        <span className="cell-label">{renderedCellValue}</span>
                    </div>
                </Link>
            );
        }
    },
    {
        accessorKey: 'tenure',
        header: 'Tenure',
        ...commonColumnConfig
    },
    {
        accessorKey: 'rate',
        header: 'Rate',
        ...commonColumnConfig,
        Cell: ({ renderedCellValue, row, column }) => {
            return (
                <span className={row.original[`isTop`] ? "isTop" : ""}>
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
        accessorKey: 'schemeName',
        header: 'Scheme',
        enableSorting: false
    }
];

const getColumns = (tenureCategories) => {
    return fdColumns.filter(column => column.tenureCategory === undefined
        || tenureCategories.includes(column.tenureCategory));
};

export default getColumns;