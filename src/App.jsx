import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Calculator from './components/Calculator'

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="container full-width">
          <Calculator />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App