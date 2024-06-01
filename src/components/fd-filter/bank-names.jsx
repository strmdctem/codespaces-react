import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { getBankNames } from '../fd-view/data';
import { ListItemText } from '@mui/material';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 250,
      width: 250,
      maxWidth: 250
    },
  },
};

export default function BankNamesFilter({ value = [], onChange }) {

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const names = getBankNames();

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 250 }} size="small">
      <InputLabel>Names</InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        renderValue={(selected) => `${selected.length} selected`}
        MenuProps={MenuProps}
      >
        {names.map((name) => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={value.indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}