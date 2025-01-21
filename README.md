# Interactive Web Calculator and Shader Generator

A web application featuring a Rust-powered calculator and an AI-driven shader generator, built with React, WebAssembly, WebGL, and Elixir.

## Features

### Tab 1: Rust Calculator
- Real-time mathematical expression evaluation using Rust (compiled to WebAssembly)
- Supports basic arithmetic operations (+, -, *, /)
- Handles parentheses and operator precedence
- Seamless integration with React frontend

### Tab 2: Text-to-Shader Generator
- Natural language to WebGL shader conversion
- Live shader preview in WebGL canvas
- Raw shader code display
- AI-powered shader generation using LLM (supports multiple models)
- Real-time error handling and validation

## Technology Stack

### Frontend
- React.js
- WebAssembly (Rust compilation)
- WebGL
- TypeScript/JavaScript

### Backend
- Elixir
- LLM Integration (supports Gemini-flash/GPT/Grok)

## Prerequisites

- Node.js (v16 or higher)
- Rust (latest stable)
- wasm-pack
- Elixir (v1.14 or higher)
- Mix

## Installation

1. Clone the repository:
```bash
[https://github.com/ankur-kalita/Calculator-Shadder-app.git]
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Build Rust WASM module:
```bash
cd rust
wasm-pack build --target web
```

4. Install backend dependencies:
```bash
cd backend
mix deps.get
```

## Configuration

1. Create a `.env` file in the backend directory:
```env
LLM_API_KEY=your_api_key_here
LLM_MODEL=your_preferred_model # gemini-flash/gpt/grok
```

2. Configure frontend environment:
```env
REACT_APP_API_URL=http://localhost:5173
```

## Running the Application

1. Start the Elixir backend:
```bash
cd backend
mix phx.server
```

2. Start the React frontend:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:5173`

## Usage

### Calculator Tab
1. Enter a mathematical expression (e.g., "2+2", "3*4")
2. The result will be calculated instantly using Rust/WASM

### Shader Generator Tab
1. Enter a description of your desired shader (e.g., "A rotating cube with a gradient background")
2. The application will generate and display the shader in real-time
3. View the raw GLSL code in the code display area
4. Any errors in shader compilation will be displayed in the UI

## Error Handling

- Calculator: Invalid expressions will display appropriate error messages
- Shader Generator: 
  - LLM generation errors are caught and displayed
  - Invalid shader compilation errors are shown with detailed messages
  - Original LLM output is preserved for debugging

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments

- Rust WebAssembly Team
- WebGL Community
- React.js Team
- Elixir Community
- AI Model Providers
