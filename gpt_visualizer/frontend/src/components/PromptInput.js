import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function PromptInput({ onGenerate }) {
  const [prompt, setPrompt] = useState('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Enter Prompt"
        variant="outlined"
        multiline
        rows={3}
        fullWidth
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#fff'
          }
        }}
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => prompt.trim() && onGenerate(prompt, 'greedy')}
        sx={{ 
          alignSelf: 'flex-start',
          minWidth: '120px'
        }}
      >
        Generate
      </Button>
    </Box>
  );
}

export default PromptInput;