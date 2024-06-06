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
        Cell: ({ renderedCellValue }) => {
            return isMobile()
                ? <div className="cell-value">{renderedCellValue}</div> : renderedCellValue;
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