import { useMemo, useState } from 'react';
import FDBankView from '../fd-bank-view/view';
import { defaultValues } from '../fd-filter/default-values';
import FDFilter from '../fd-filter/filter';
import FDSpecialTable from '../fd-special-table/table';
import FDTable from '../fd-table/table';
import { getData, getSpecialData } from './data';

const FDView = () => {
  const [filters, setFilters] = useState({ ...defaultValues });
  const [showBankView, setShowBankView] = useState(false);
  const [activeBank, setActiveBank] = useState(undefined);

  const onFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const data = useMemo(() => {
    return getData(filters);
  }, [
    filters.bankTypes,
    filters.bankNames,
    filters.category,
    filters.tenureCategories,
    filters.search,
    filters.calc
  ]);

  const specialData = useMemo(() => {
    return getSpecialData(filters);
  }, [
    filters.bankTypes,
    filters.bankNames,
    filters.category,
    filters.tenureCategories,
    filters.search
  ]);

  const onBankClick = (bankName) => {
    setActiveBank(bankName);
    setShowBankView(true);
  };

  const onBackClick = () => {
    setShowBankView(false);
  };

  return (
    <>
      {!showBankView && (
        <>
          <FDFilter value={filters} onChange={onFilterChange} />
          {filters.scheme === 'Special' ? (
            <FDSpecialTable
              filters={filters}
              data={specialData}
              onNameClick={onBankClick}
            />
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
