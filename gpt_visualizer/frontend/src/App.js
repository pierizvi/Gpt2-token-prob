import React, { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TokenGraph from './components/TokenGraph';
import TokenTable from './components/TokenTable';
import PromptInput from './components/PromptInput';
import DecodingControls from './components/DecodingControls';
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
      textAlign: 'left' 
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
  const [generatedText, setGeneratedText] = useState('');
  const [tokens, setTokens] = useState([]);
  const [probabilities, setProbabilities] = useState([]);
  const [samplingMethod, setSamplingMethod] = useState('greedy');

  const handleGenerate = async (prompt) => {
    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt,
          method: samplingMethod
        }),
      });
      
      const data = await response.json();
      setGeneratedText(data.generated_text); 
      setTokens(data.tokenized_prompt.map(text => ({ text }))); 
      setProbabilities(data.token_probabilities);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <div className="app-title">
        <h1>Token Flow</h1>
      </div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <div className="prompt-section">
            <div className="controls-section">
              <div className="prompt-input">
                <PromptInput onGenerate={(prompt) => handleGenerate(prompt)} />
              </div>
              <div className="decoding-controls">
                <DecodingControls 
                  method={samplingMethod}
                  onMethodChange={setSamplingMethod}
                />
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
    </div>
  );
}

export default App;