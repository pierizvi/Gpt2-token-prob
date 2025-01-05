import React, { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TokenGraph from './components/TokenGraph';
import TokenTable from './components/TokenTable';
import PromptInput from './components/PromptInput';
import DecodingControls from './components/DecodingControls';
import axios from 'axios';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#404040',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Space Mono", "Courier New", monospace',
    h3: {
      fontSize: '1.5rem',
      fontWeight: 400,
      letterSpacing: '0.1em',
      marginBottom: '2rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          padding: '0.75rem 2rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
          },
        },
      },
    },
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
        <div className="prompt-section">
          <div className="controls-section">
            <div className="prompt-input">
              <PromptInput onGenerate={handleGenerate} />
            </div>
            <div className="decoding-controls">
              <DecodingControls />
            </div>
          </div>
        </div>

        <div className="results-section">
          {tokens.length > 0 && (
            <div>
              <h3>Token Graph</h3>
              <TokenGraph data={{ nodes: tokens, links: [] }} />
            </div>
          )}
          
          {probabilities.length > 0 && (
            <div>
              <h3>Token Probabilities</h3>
              <TokenTable tokens={probabilities} />
            </div>
          )}
          
          {generatedText && (
            <div>
              <h3>Generated Text</h3>
              <div className="generated-text">
                {generatedText}
              </div>
            </div>
          )}
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;