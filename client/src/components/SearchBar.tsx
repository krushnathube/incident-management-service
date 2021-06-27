import React from 'react';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

const SearchBar: React.FC<{
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  label: string;
  size?: 'small' | 'medium';
}> = ({ searchValue, setSearchValue, label, size }) => {
  return (
    <div>
      <div>
        <TextField
          value={searchValue}
          fullWidth
          size={size || 'medium'}
          type="text"
          label={`Search ${label}`}
          variant="outlined"
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  color="primary"
                  fontSize={size === 'small' ? 'default' : 'large'}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="start">
                {searchValue !== '' ? (
                  <IconButton onClick={() => setSearchValue('')} size="small">
                    <ClearIcon
                      color="primary"
                      fontSize={size === 'small' ? 'default' : 'large'}
                    />
                  </IconButton>
                ) : (
                  <div></div>
                )}
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
