import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

function DecodingControls({ method, onMethodChange }) {
  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel>Sampling Method</InputLabel>
        <Select
          value={method}
          onChange={(e) => onMethodChange(e.target.value)}
          label="Sampling Method"
        >
          <MenuItem value="greedy">Greedy</MenuItem>
          <MenuItem value="sampling">Sampling</MenuItem>
          <MenuItem value="beam">Beam Search</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default DecodingControls;