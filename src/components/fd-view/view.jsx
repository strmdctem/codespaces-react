import { useMemo, useState } from 'react';
import FDFilter from "../fd-filter/filter";
import FDTable from "../fd-table/table";
import { defaultValues } from '../fd-filter/default-values';
import { getData, getSpecialData } from './data';
import FDSpecialTable from '../fd-special-table/table';
import FDSchemeSelector from '../fd-scheme/scheme';
import FDBankView from '../fd-bank-view/view';

const FDView = () => {
    const [filters, setFilters] = useState({ ...defaultValues });
    const [scheme, setScheme] = useState("Regular");
    const [showBankView, setShowBankView] = useState(false);
    const [activeBank, setActiveBank] = useState(undefined);

    const onFilterChange = (newFilters) => {
        console.log("filters", newFilters);
        setFilters(newFilters);
    }

    const onSchemeChange = (scheme) => {
        console.log("scheme", scheme);
        setScheme(scheme);
    }

    const data = useMemo(() => {
        return getData(filters);
    }, [filters.bankTypes, filters.bankNames, filters.category]);

    const specialData = useMemo(() => {
        return getSpecialData(filters);
    }, [filters.bankTypes, filters.bankNames, filters.category]);

    const onBankClick = (bankName) => {
        console.log('bank clicked', bankName);
        setActiveBank(bankName);
        setShowBankView(true);
    }

    const onBackClick = () => {
        setShowBankView(false);
    }

    return (
        <>
            {!showBankView && (
                <>
                    <FDFilter value={filters} onChange={onFilterChange} />
                    <FDSchemeSelector onChange={onSchemeChange} />
                    {scheme === "Special" ? (
                        <FDSpecialTable filters={filters} data={specialData} />
                    ) : (
                        <FDTable filters={filters} data={data} onNameClick={onBankClick} />
                    )}
                </>
            )}
            {showBankView && <FDBankView name={activeBank} backClick={onBackClick} />}
        </>
    );
};

export default FDView;