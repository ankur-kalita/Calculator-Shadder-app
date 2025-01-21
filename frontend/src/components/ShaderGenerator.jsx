import { useState, useEffect, useRef } from 'react';
import { TextField, Button, Paper, Typography, Grid } from '@mui/material';

function ShaderGenerator() {
  const [prompt, setPrompt] = useState('');
  const [shaderCode, setShaderCode] = useState('');
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (shaderCode && canvasRef.current) {
      initWebGL(shaderCode);
    }
  }, [shaderCode]);

  const initWebGL = (shaderSource) => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');

    if (!gl) {
      setError('WebGL not supported');
      return;
    }

    try {
      // Create shaders (simplified version - you'll need to expand this)
      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

      // Basic vertex shader
      const vertexShaderSource = `
        attribute vec4 aPosition;
        void main() {
          gl_Position = aPosition;
        }
      `;

      gl.shaderSource(vertexShader, vertexShaderSource);
      gl.shaderSource(fragmentShader, shaderSource);

      gl.compileShader(vertexShader);
      gl.compileShader(fragmentShader);

      // Check for compilation errors
      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(fragmentShader));
      }

      // Create and link program
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Unable to initialize shader program');
      }

      // Use program and set up attributes/uniforms
      gl.useProgram(program);

      // Create a buffer for the vertices
      const vertices = new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
         1.0,  1.0
      ]);

      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const aPosition = gl.getAttribLocation(program, 'aPosition');
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGenerateShader = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/generate-shader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate shader');
      }

      setShaderCode(data.shader);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Grid container spacing={3} direction="column" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h5" component="h2">
            Shader Generator
          </Typography>
        </Grid>

        <Grid item xs={12} style={{ width: '100%' }}>
          <TextField
            label="Describe the shader you want"
            variant="outlined"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            multiline
            rows={3}
            placeholder="Example: A rotating cube with a gradient background"
          />
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateShader}
            disabled={isLoading || !prompt}
          >
            {isLoading ? 'Generating...' : 'Generate Shader'}
          </Button>
        </Grid>

        {error && (
          <Grid item>
            <Typography color="error">
              {error}
            </Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            style={{
              border: '1px solid #ccc',
              display: 'block',
              margin: '2rem auto',
            }}
          />
        </Grid>

        {shaderCode && (
          <Grid item xs={12}>
            <Typography variant="h6">Generated Shader Code:</Typography>
            <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              {shaderCode}
            </pre>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}

export default ShaderGenerator;