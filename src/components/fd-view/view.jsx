import { useState } from 'react';
import FDFilter from "../fd-filter/filter";
import FDTable from "../fd-table/table";

const FDView = () => {
    const [tenureCategories, settenureCategories] = useState("2");

    const onFilterChange = (filters) => {
        console.log("filters", filters);
        settenureCategories(filters.tenureCategories);
    }

    return (
        <div>
            <FDFilter onChange={onFilterChange} />
            <FDTable tenureCategories={tenureCategories} />
        </div>
    );
};

export default FDView;