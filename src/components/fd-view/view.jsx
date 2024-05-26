import { useState } from 'react';
import FDFilter from "../fd-filter/filter";
import FDTable from "../fd-table/table";
import { defaultValues } from '../fd-filter/default-values';

const FDView = () => {
    const [filters, setFilters] = useState({ ...defaultValues });

    const onFilterChange = (newFilters) => {
        console.log("filters", newFilters);
        setFilters(newFilters);
    }

    return (
        <>
            <FDFilter value={defaultValues} onChange={onFilterChange} />
            <FDTable filters={filters} />
        </>
    );
};

export default FDView;