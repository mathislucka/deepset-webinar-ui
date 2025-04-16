import './App.css'
import DSUCalculator from './components/DSUCalculator'
import './components/DSUCalculator.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Vector Database Pricing Calculator</h1>
        <div className="calculator-wrapper">
          <DSUCalculator />
        </div>
        <p className="pricing-explanation">
          This calculator helps estimate costs for vector database storage for AI applications.
        </p>
      </header>
    </div>
  )
}

export default App