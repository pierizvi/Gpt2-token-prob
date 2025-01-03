import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

function PromptInput({ onGenerate }) {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = () => {
    console.log('Generating text for prompt:', prompt);
    onGenerate(prompt, 'greedy');
  };

  return (
    <div>
      <TextField
        label="Enter Prompt"
        variant="outlined"
        fullWidth
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleGenerate}>
        Generate
      </Button>
    </div>
  );
}

export default PromptInput;