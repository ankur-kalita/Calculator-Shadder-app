import { useState, useEffect, useRef } from 'react';

export function ShaderGenerator({ isDark }) {
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
  if (!canvas) return;

  const gl = canvas.getContext("webgl");
  if (!gl) {
    setError("WebGL not supported");
    return;
  }

  try {
    // Clear any existing error
    setError(null);

    // Vertex Shader Source
    const vertexShaderSource = `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `;

    // Fragment Shader Source (from OpenAI)
    const fragmentShaderSource = shaderSource;

    // Compile shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Link program
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Set up position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Look up location of a_position
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Pass uniform data
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseUniformLocation = gl.getUniformLocation(program, "u_mouse");

    // Set the resolution uniform
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

    // Dummy mouse uniform for now
    gl.uniform2f(mouseUniformLocation, 0.5, 0.5);

    // Draw
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred");
  }
};


  const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Could not compile shader:\n${info}`);
  };

  const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Could not link program:\n${info}`);
  };

  const handleGenerateShader = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://elixi.gigalixirapp.com/api/generate-shader', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const contentLength = response.headers.get('content-length');
      if (contentLength === '0') {
        throw new Error('Received empty response from the server.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate shader');
      }

      console.log(data);

      setShaderCode(data.shader);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className={`text-2xl font-semibold text-center transition-colors duration-200 ${
        isDark ? 'text-white' : 'text-gray-800'
      }`}>
        Shader Generator
      </h2>

      <div className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the shader you want (e.g., A rotating cube with a gradient background)"
            rows={3}
            className={`w-full px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition-all resize-none ${
              isDark
                ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
            }`}
          />
        </div>

        <button
          onClick={handleGenerateShader}
          disabled={isLoading || !prompt}
          className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? 'Generating...' : 'Generate Shader'}
        </button>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className={`mx-auto border rounded-lg transition-colors duration-200 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        />

        {shaderCode && (
          <div>
            <h3 className={`text-lg font-medium mb-2 transition-colors duration-200 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Generated Shader Code:
            </h3>
            <pre className={`p-4 rounded-lg overflow-auto max-h-[300px] text-sm transition-colors duration-200 ${
              isDark
                ? 'bg-gray-900 text-gray-300 border border-gray-700'
                : 'bg-gray-50 text-gray-800'
            }`}>
              {shaderCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
