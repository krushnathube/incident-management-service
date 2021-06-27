import React from 'react';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@material-ui/core';
import FilterIcon from '@material-ui/icons/FilterList';

const FilterBar: React.FC<{
  filterBy: string;
  handleFilterChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
  menuItems: { value: string; label: string }[];
  label: string;
  size?: 'small' | 'medium';
}> = ({ filterBy, handleFilterChange, menuItems, label, size }) => {
  return (
    <FormControl variant="outlined" fullWidth size={size || 'medium'}>
      <InputLabel id="filter-label">Filter {label} By Type</InputLabel>
      <Select
        labelId="filter-label"
        value={filterBy}
        onChange={handleFilterChange}
        label={`Filter ${label} By Type`}
        startAdornment={
          <InputAdornment position="start">
            <FilterIcon
              color="primary"
              fontSize={size === 'small' ? 'default' : 'large'}
            />
          </InputAdornment>
        }
      >
        {menuItems.map((m) => (
          <MenuItem key={m.value} value={m.value}>
            {m.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterBar;
