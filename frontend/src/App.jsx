import { useState } from 'react';
import { Calculator } from './components/Calculator';
import { ShaderGenerator } from './components/ShaderGenerator';
import { Calculator as CalculatorIcon, Wand2, Sun, Moon } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <div className="p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Theme Toggle and Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className={`flex space-x-2 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-2 shadow-sm flex-1`}>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 flex-1 sm:flex-none ${
                  activeTab === 'calculator'
                    ? 'bg-blue-500 text-white'
                    : `text-gray-600 dark:text-gray-300 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                }`}
              >
                <CalculatorIcon className="w-5 h-5 mr-2" />
                Calculator
              </button>
              <button
                onClick={() => setActiveTab('shader')}
                className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 flex-1 sm:flex-none ${
                  activeTab === 'shader'
                    ? 'bg-blue-500 text-white'
                    : `text-gray-600 dark:text-gray-300 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                }`}
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Shader Generator
              </button>
            </div>
            <button
              onClick={toggleTheme}
              className={`ml-4 p-2 rounded-lg bg-white transition-colors duration-200 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              {isDark ? <Sun className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-800'}`} /> : <Moon className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-800'}`} />}
            </button>
          </div>

          {/* Content */}
          <div className={`rounded-lg shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {activeTab === 'calculator' ? <Calculator isDark={isDark} /> : <ShaderGenerator isDark={isDark} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;