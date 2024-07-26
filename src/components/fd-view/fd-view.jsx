import { useMemo, useState } from 'react';
import FDFilter from '../fd-filter/fd-filter';
import { DEFAULT_VALUES } from '../fd-filter/fd-filter-constants';
import FDSpecialTable from '../fd-special-table/fd-special-table';
import FDTable from '../fd-table/fd-table';
import { getData, getSpecialData } from './data';

const FDView = () => {
  const [filters, setFilters] = useState({ ...DEFAULT_VALUES });

  const onFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const data = useMemo(() => {
    return getData(filters);
  }, [filters]);

  const specialData = useMemo(() => {
    return getSpecialData(filters);
  }, [filters]);

  return (
    <>
      <FDFilter value={filters} onChange={onFilterChange} />
      {filters.scheme === 'Special' ? (
        <FDSpecialTable filters={filters} data={specialData} />
      ) : (
        <FDTable filters={filters} data={data} />
      )}
    </>
  );
};

export default FDView;
