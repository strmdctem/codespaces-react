import * as React from 'react';
import { useState, useEffect } from 'react';
import BankTypesFilter from './bank-type';
import BankNamesFilter from './bank-names';
import TenureFilter from './tenure';
import './filter.css';
import CategoryFilter from './catergory';
import { defaultValues } from './default-values';

export default function FDFilter({ onChange }) {
  const [filters, setFilters] = useState({ ...defaultValues });

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
    <>
      <TenureFilter value={filters.tenureCategories} onChange={handleChange('tenureCategories')} />
      <BankTypesFilter value={filters.bankTypes} onChange={handleChange('bankTypes')} />
      <BankNamesFilter value={filters.bankNames} onChange={handleChange('bankNames')} />
      <CategoryFilter value={filters.category} onChange={handleChange('category')} />
    </>
  );
}