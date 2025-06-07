import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FDFilter from '../fd-filter/fd-filter';
import { DEFAULT_VALUES, FD_SCHEMES } from '../fd-filter/fd-filter-constants';
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
  const { scheme } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ ...DEFAULT_VALUES });
  // Sync scheme from URL parameter
  useEffect(() => {
    if (scheme) {
      const validSchemes = FD_SCHEMES.map((s) => s.value.toLowerCase());
      const normalizedScheme = scheme.toLowerCase();

      if (validSchemes.includes(normalizedScheme)) {
        console.log('Setting scheme from URL:', normalizedScheme);
        setFilters((prev) => {
          // Only update if the scheme is actually different to prevent infinite loops
          if (prev.scheme !== normalizedScheme) {
            return { ...prev, scheme: normalizedScheme };
          }
          return prev;
        });
      }
    }
  }, [scheme]); // Remove filters.scheme from dependency array to prevent infinite loop

  usePageInfo({
    title: 'Latest Fixed Deposit Rates of All Banks',
    description:
      'Check and compare fixed deposit interest rates of 2025 from all banks. Use FinRates screener to compare rates, calculate returns, filter, sort, search, and find the best FD schemes for your needs.'
  });

  const onFilterChange = (newFilters) => {
    setFilters(newFilters); // Update URL when scheme changes
    if (newFilters.scheme !== filters.scheme) {
      const schemeParam = newFilters.scheme.toLowerCase();
      navigate(`/fixed-deposit/view/${schemeParam}`, { replace: true });
    }
  };
  // Only compute data for the active scheme to improve performance
  const currentData = useMemo(() => {
    switch (filters.scheme) {
      case 'special':
        return getSpecialData(filters);
      case 'highest-rates':
        return getHighestData(filters);
      case 'specific-tenures':
        return getTenureWiseRatesTable(filters);
      default:
        return getData(filters);
    }
  }, [filters]);

  // Render the appropriate table component based on the scheme
  const renderTable = () => {
    switch (filters.scheme) {
      case 'special':
        return <FDSpecialTable filters={filters} data={currentData} />;
      case 'highest-rates':
        return <FDSpecialTable filters={filters} data={currentData} />;
      case 'specific-tenures':
        return <FDTenureTable filters={filters} data={currentData} />;
      default:
        return <FDTable filters={filters} data={currentData} />;
    }
  };

  return (
    <>
      <FDFilter value={filters} onChange={onFilterChange} />
      {renderTable()}
    </>
  );
};

export default FDView;
