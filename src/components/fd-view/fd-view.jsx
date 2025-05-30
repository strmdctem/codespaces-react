import { useMemo, useState } from 'react';
import FDFilter from '../fd-filter/fd-filter';
import { DEFAULT_VALUES } from '../fd-filter/fd-filter-constants';
import FDSpecialTable from '../fd-special-table/fd-special-table';
import FDTable from '../fd-table/fd-table';
import FDTenureTable from '../fd-tenure-table/fd-tenure-table';
import usePageInfo from '../page-info/use-page-info';
import {
  getData,
  getHighestData,
  getSpecialData,
  getTenureWiseRatesTable
} from './data';

const FDView = () => {
  const [filters, setFilters] = useState({ ...DEFAULT_VALUES });

  usePageInfo({
    title: 'Latest Fixed Deposit Rates of All Banks',
    description:
      'Check and compare fixed deposit interest rates of 2025 from all banks. Use FinRates screener to compare rates, calculate returns, filter, sort, search, and find the best FD schemes for your needs.'
  });

  const onFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const data = useMemo(() => {
    return getData(filters);
  }, [filters]);

  const specialData = useMemo(() => {
    return getSpecialData(filters);
  }, [filters]);

  const highestData = useMemo(() => {
    return getHighestData(filters);
  }, [filters]);

  const tenureWiseData = useMemo(() => {
    return getTenureWiseRatesTable(filters);
  }, [filters]);

  return (
    <>
      <FDFilter value={filters} onChange={onFilterChange} />
      {filters.scheme === 'Special' ? (
        <FDSpecialTable filters={filters} data={specialData} />
      ) : filters.scheme === 'Highest' ? (
        <FDSpecialTable filters={filters} data={highestData} />
      ) : filters.scheme === 'Specific' ? (
        <FDTenureTable filters={filters} data={tenureWiseData} />
      ) : (
        <FDTable filters={filters} data={data} />
      )}
    </>
  );
};

export default FDView;
