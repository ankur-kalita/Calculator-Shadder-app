import { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Grid2 } from '@mui/material';
import init, { calculate as rustCalculate } from '../rust pkg/pkg/rust'; 

function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [wasmReady, setWasmReady] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setWasmReady(true);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to load WASM module:', err);
        setError('Failed to load calculator module');
      });
  }, []);

  const handleCalculate = () => {
    if (!wasmReady) {
      setError('Calculator module not loaded');
      return;
    }

    try {
      const calculatedResult = rustCalculate(expression);
      setResult(calculatedResult);
      setError(null);
    } catch (err) {
      setError('Invalid expression');
      setResult(null);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <Grid2 container spacing={3} direction="column" alignItems="center">
        <Grid2 item xs={12}>
          <Typography variant="h5" component="h2" style={{ marginBottom: '1rem' }}>
            Rust Calculator
          </Typography>
        </Grid2>

        <Grid2 item xs={12} style={{ width: '100%' }}>
          <TextField
            label="Enter mathematical expression"
            variant="outlined"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            fullWidth
            placeholder="Example: 2 + 2"
            style={{ marginBottom: '1rem' }}
          />
        </Grid2>

        <Grid2 item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCalculate}
            disabled={!wasmReady}
            style={{ marginBottom: '1rem' }}
          >
            Calculate
          </Button>
        </Grid2>

        {error && (
          <Grid2 item>
            <Typography color="error" style={{ marginTop: '1rem' }}>
              {error}
            </Typography>
          </Grid2>
        )}

        {result !== null && (
          <Grid2 item>
            <Typography variant="h6" style={{ marginTop: '1rem' }}>
              Result: {result}
            </Typography>
          </Grid2>
        )}
      </Grid2>
    </Paper>
  );
}

export default Calculator;
