import * as React from 'react';
import { useState, useEffect } from 'react';
import BankTypeFilter from './bank-type';
import BankNamesFilter from './bank-names';
import TenureFilter from './tenure';
import './filter.css';
import CategoryFilter from './catergory';

export default function FDFilter({ onChange }) {
  const [filters, setFilters] = useState({
    tenureCategories: ["2"],
    bankNames: [],
    bankType: ["nationalized", "private"],
    category: false,
  });

  const handleChange = (filterName) => (value) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [filterName]: value };
      onChange(newFilters);
      return newFilters;
    });
  };

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  return (
    <div>
      <TenureFilter value={filters.tenureCategories} onChange={handleChange('tenureCategories')} />
      <BankNamesFilter value={filters.bankNames} onChange={handleChange('bankNames')} />
      <BankTypeFilter value={filters.bankType} onChange={handleChange('bankType')} />
      <CategoryFilter value={filters.category} onChange={handleChange('category')} />
    </div>
  );
}