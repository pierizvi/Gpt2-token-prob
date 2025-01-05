import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

function DecodingControls() {
  const [method, setMethod] = useState('greedy');

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel>Sampling Method</InputLabel>
        <Select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
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