import { useMemo, useState } from 'react';
import FDFilter from "../fd-filter/filter";
import FDTable from "../fd-table/table";
import { defaultValues } from '../fd-filter/default-values';
import getData from './data';

const FDView = () => {
    const [filters, setFilters] = useState({ ...defaultValues });

    const onFilterChange = (newFilters) => {
        console.log("filters", newFilters);
        setFilters(newFilters);
    }

    const data = useMemo(() => {
        return getData(filters);
    }, [filters.bankTypes, filters.bankNames, filters.category]);

    return (
        <>
            <FDFilter value={defaultValues} onChange={onFilterChange} />
            <FDTable filters={filters} data={data} />
        </>
    );
};

export default FDView;