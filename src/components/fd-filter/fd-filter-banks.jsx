import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { getBankNames } from '../fd-view/data';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 400,
      maxWidth: 200,
      width: 200
    }
  }
};

export default function FDFilterBanks({ value = [], onChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const names = getBankNames();
  const sortedNames = menuOpen
    ? names
    : names.sort((a, b) => {
        const aSelected = value.includes(a);
        const bSelected = value.includes(b);
        if (aSelected && !bSelected) {
          return -1;
        }
        if (!aSelected && bSelected) {
          return 1;
        }
        return 0;
      });

  return (
    <Select
      multiple
      value={value}
      size="small"
      fullWidth
      onChange={handleChange}
      renderValue={(selected) => `${selected.length} selected`}
      MenuProps={MenuProps}
      onOpen={() => setMenuOpen(true)}
      onClose={() => setMenuOpen(false)}
    >
      {sortedNames.map((name) => (
        <MenuItem key={name} value={name}>
          <Checkbox checked={value.indexOf(name) > -1} />
          <ListItemText primary={name} />
        </MenuItem>
      ))}
    </Select>
  );
}
