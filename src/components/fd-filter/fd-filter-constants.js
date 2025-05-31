export const BANK_TYPES = [
  { value: 'Public', label: 'Nationalized' },
  { value: 'Private', label: 'Private' },
  { value: 'NBFC', label: 'NBFC' },
  { value: 'Small Finance', label: 'Small Finance' }
];

export const FD_SCHEMES = [
  { value: 'Regular', label: 'Regular' },
  { value: 'Special', label: 'Special' },
  { value: 'Highest', label: 'Highest' }
];

export const FD_CATEGORIES = [
  { value: false, label: 'General' },
  { value: true, label: 'Senior' }
];

export const FD_TENURE_CATEGORIES = [
  { value: '1', label: '<= 1 Year' },
  { value: '2', label: '1 -2 Years' },
  { value: '3', label: '2 Years +' }
];

export const DEFAULT_VALUES = {
  bankTypes: BANK_TYPES.map((type) => type.value),
  category: FD_CATEGORIES[0].value,
  scheme: FD_SCHEMES[2].value,
  tenureCategories: ['1', '2', '3'],
  bankNames: [],
  search: '',
  calc: ''
};
