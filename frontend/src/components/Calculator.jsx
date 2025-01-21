import { useState, useEffect } from 'react';
import init, { calculate as rustCalculate } from '../rust pkg/pkg/rust';  

export function Calculator({ isDark }) {
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
      setError('Invalid expression', err);
      setResult(null);
    }
  };

  return (
    <div className="p-8">
      <div className={`max-w-md mx-auto rounded-2xl shadow-lg p-6 border transition-colors duration-200 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
      }`}>
        <h2 className={`text-2xl font-semibold mb-6 text-center transition-colors  duration-200 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Advanced Calculator
        </h2>
        
        <div className="space-y-6">
          <div className={`rounded-lg p-4 shadow-inner border transition-colors duration-200 ${
            isDark
              ? 'bg-gray-900 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="text-right">
              <div className={`text-sm mb-1 min-h-[1.25rem] transition-colors duration-200 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {expression || 'Enter an expression'}
              </div>
              <div className={`text-2xl font-semibold min-h-[2rem] transition-colors duration-200 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {result !== null ? result : '0'}
              </div>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="Enter mathematical expression"
              className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all text-lg shadow-sm ${
                isDark
                  ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-blue-200 text-gray-800 placeholder-gray-400'
              }`}
            />
            {error && (
              <div className="absolute -bottom-6 left-0 text-red-500 text-sm">
                {error}
              </div>
            )}
          </div>

          <button
            onClick={handleCalculate}
            disabled={!wasmReady || !expression}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-lg shadow-md"
          >
            Calculate
          </button>

          <div className={`text-center text-sm mt-4 transition-colors duration-200 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <p>Try expressions like: 2 + 2 * 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
