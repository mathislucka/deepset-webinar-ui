import { useState, useEffect } from 'react';

const DSUCalculator = () => {
  // Constants for the calculation
  const PRICE_PER_MILLION_DSU = 4000; // $4,000 per 1 million DSU
  const WORDS_PER_PAGE = 500; // Approximate words per PDF page
  const WORDS_PER_CHUNK = 350; // Words per chunk
  const DIMENSIONS = 768; // Dimensions in a vector
  
  // State variables
  const [pages, setPages] = useState(1);
  const [chunks, setChunks] = useState(0);
  const [vectors, setVectors] = useState(0);
  const [dsu, setDsu] = useState(0);
  const [annualPrice, setAnnualPrice] = useState(0);
  
  // Calculate all values when pages change
  useEffect(() => {
    // Calculate number of chunks based on words per page and chunk size
    const totalWords = pages * WORDS_PER_PAGE;
    const calculatedChunks = Math.ceil(totalWords / WORDS_PER_CHUNK);
    
    // Each chunk becomes a vector
    const calculatedVectors = calculatedChunks;
    
    // Calculate DSU (1 vector with 768 dimensions = 1 DSU)
    const calculatedDsu = calculatedVectors * (DIMENSIONS / 768);
    
    // Calculate annual price ($4,000 per 1M DSU)
    const calculatedPrice = (calculatedDsu / 1000000) * PRICE_PER_MILLION_DSU;
    
    // Update state
    setChunks(calculatedChunks);
    setVectors(calculatedVectors);
    setDsu(calculatedDsu);
    setAnnualPrice(calculatedPrice);
  }, [pages]);
  
  return (
    <div className="dsu-calculator">
      <h2>DSU Pricing Calculator</h2>
      <div className="calculator-container">
        <div className="input-group">
          <label htmlFor="pages">Number of PDF Pages:</label>
          <input
            type="number"
            id="pages"
            min="1"
            value={pages}
            onChange={(e) => setPages(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
        
        <div className="results">
          <div className="result-item">
            <span className="result-label">Estimated Text Chunks:</span>
            <span className="result-value">{chunks.toLocaleString()}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Number of Vectors:</span>
            <span className="result-value">{vectors.toLocaleString()}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Total DSU:</span>
            <span className="result-value">{dsu.toLocaleString()}</span>
          </div>
          <div className="result-item price">
            <span className="result-label">Estimated Annual Price:</span>
            <span className="result-value">${annualPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        
        <div className="calculator-info">
          <h3>Understanding DSU Pricing</h3>
          <ul>
            <li><strong>1 DSU</strong> = 1 vector with 768 dimensions</li>
            <li>Each text chunk (~350 words) creates 1 vector</li>
            <li>Approximately {WORDS_PER_PAGE} words per PDF page</li>
            <li>We charge <strong>${PRICE_PER_MILLION_DSU.toLocaleString()}</strong> per 1 million DSU per year</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DSUCalculator;
