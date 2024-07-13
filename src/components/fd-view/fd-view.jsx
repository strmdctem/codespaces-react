import { useMemo, useState } from 'react';
import FDBankView from '../fd-bank-view/fd-bank-view';
import FDFilter from '../fd-filter/fd-filter';
import { DEFAULT_VALUES } from '../fd-filter/fd-filter-constants';
import FDSpecialTable from '../fd-special-table/fd-special-table';
import FDTable from '../fd-table/fd-table';
import { getData, getSpecialData } from './data';

const FDView = () => {
  const [filters, setFilters] = useState({ ...DEFAULT_VALUES });
  const [showBankView, setShowBankView] = useState(false);
  const [activeBank, setActiveBank] = useState(undefined);

  const onFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const data = useMemo(() => {
    return getData(filters);
  }, [filters]);

  const specialData = useMemo(() => {
    return getSpecialData(filters);
  }, [filters]);

  const onBankClick = (bankKey) => {
    setActiveBank(bankKey);
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
      {showBankView && (
        <FDBankView
          name={activeBank}
          backClick={onBackClick}
          calc={filters.calc}
        />
      )}
    </>
  );
};

export default FDView;
