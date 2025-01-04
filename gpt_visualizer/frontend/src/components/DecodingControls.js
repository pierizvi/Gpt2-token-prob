import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function DecodingControls() {
  const [method, setMethod] = useState('greedy');

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel>Decoding Method</InputLabel>
      <Select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        label="Decoding Method"
      >
        <MenuItem value="greedy">Greedy</MenuItem>
        <MenuItem value="sampling">Sampling</MenuItem>
      </Select>
    </FormControl>
  );
}

export default DecodingControls;