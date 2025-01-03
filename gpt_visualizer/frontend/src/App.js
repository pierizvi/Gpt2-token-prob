import React, { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TokenGraph from './components/TokenGraph';
import TokenTable from './components/TokenTable';
import PromptInput from './components/PromptInput';
import DecodingControls from './components/DecodingControls';
import axios from 'axios';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [tokens, setTokens] = useState([]);
  const [probabilities, setProbabilities] = useState([]);
  const [generatedText, setGeneratedText] = useState('');

  const handleGenerate = async (prompt, method) => {
    try {
      console.log('Sending request to generate text with prompt:', prompt);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/generate`, { prompt });
      console.log('Received response:', response.data);
      setGeneratedText(response.data.generated_text);
      setProbabilities(response.data.token_probabilities);

      // Convert tokenized prompt text to nodes for the graph
      const tokenNodes = response.data.tokenized_prompt.map((token, index) => ({
        id: index,
        text: token,
      }));
      setTokens(tokenNodes);
    } catch (error) {
      console.error('Error generating text:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <PromptInput onGenerate={handleGenerate} />
        <DecodingControls />
        <TokenGraph data={{ nodes: tokens, links: [] }} />
        <TokenTable tokens={probabilities} />
        <div>
          <h3>Generated Text:</h3>
          <p>{generatedText}</p>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;