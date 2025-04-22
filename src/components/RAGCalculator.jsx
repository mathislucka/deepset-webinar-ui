import React, { useState, useEffect } from 'react';
import '../styles/RAGCalculator.css';

// Model price data (prices per million tokens in USD)
const MODEL_PRICING = {
  openai: [
    { name: 'GPT-4.1', inputPrice: 2.00, cachedInputPrice: 0.50, outputPrice: 8.00 },
    { name: 'GPT-4.1-mini', inputPrice: 0.40, cachedInputPrice: 0.10, outputPrice: 1.60 },
    { name: 'GPT-4.1-nano', inputPrice: 0.10, cachedInputPrice: 0.025, outputPrice: 0.40 },
    { name: 'GPT-4.5-preview', inputPrice: 75.00, cachedInputPrice: 37.50, outputPrice: 150.00 },
    { name: 'GPT-4o', inputPrice: 2.50, cachedInputPrice: 1.25, outputPrice: 10.00 },
    { name: 'GPT-4o-audio-preview', inputPrice: 2.50, cachedInputPrice: null, outputPrice: 10.00 },
    { name: 'GPT-4o-realtime-preview', inputPrice: 5.00, cachedInputPrice: 2.50, outputPrice: 20.00 },
    { name: 'GPT-4o-mini', inputPrice: 0.15, cachedInputPrice: 0.075, outputPrice: 0.60 },
    { name: 'GPT-4o-mini-audio-preview', inputPrice: 0.15, cachedInputPrice: null, outputPrice: 0.60 },
    { name: 'GPT-4o-mini-realtime-preview', inputPrice: 0.60, cachedInputPrice: 0.30, outputPrice: 2.40 },
    { name: 'O1', inputPrice: 15.00, cachedInputPrice: 7.50, outputPrice: 60.00 },
    { name: 'O1-pro', inputPrice: 150.00, cachedInputPrice: null, outputPrice: 600.00 },
    { name: 'O3', inputPrice: 10.00, cachedInputPrice: 2.50, outputPrice: 40.00 },
    { name: 'O4-mini', inputPrice: 1.10, cachedInputPrice: 0.275, outputPrice: 4.40 },
    { name: 'O3-mini', inputPrice: 1.10, cachedInputPrice: 0.55, outputPrice: 4.40 },
    { name: 'O1-mini', inputPrice: 1.10, cachedInputPrice: 0.55, outputPrice: 4.40 },
    { name: 'GPT-4o-mini-search-preview', inputPrice: 0.15, cachedInputPrice: null, outputPrice: 0.60 },
    { name: 'GPT-4o-search-preview', inputPrice: 2.50, cachedInputPrice: null, outputPrice: 10.00 },
    { name: 'Computer-use-preview', inputPrice: 3.00, cachedInputPrice: null, outputPrice: 12.00 }
  ],
  anthropic: [
    { name: 'Claude 3.7 Sonnet', inputPrice: 3.00, cachedInputPrice: 0.30, outputPrice: 15.00 },
    { name: 'Claude 3.5 Haiku', inputPrice: 0.80, cachedInputPrice: 0.08, outputPrice: 4.00 },
    { name: 'Claude 3 Opus', inputPrice: 15.00, cachedInputPrice: 1.50, outputPrice: 75.00 }
  ],
  google: [
    { name: 'Gemini 2.5 Pro (≤200k)', inputPrice: 1.25, cachedInputPrice: null, outputPrice: 10.00 },
    { name: 'Gemini 2.5 Pro (>200k)', inputPrice: 2.50, cachedInputPrice: null, outputPrice: 15.00 },
    { name: 'Gemini 2.0 Flash', inputPrice: 0.10, cachedInputPrice: 0.025, outputPrice: 0.40 },
    { name: 'Gemini 2.0 Flash-Lite', inputPrice: 0.075, cachedInputPrice: null, outputPrice: 0.30 }
  ]
};

// Main calculator component
const RAGCalculator = () => {
  // State variables
  const [queriesPerDay, setQueriesPerDay] = useState(1000);
  const [inputTokens, setInputTokens] = useState(15000);
  const [outputTokens, setOutputTokens] = useState(700);
  const [cachingRate, setCachingRate] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // table or comparison
  const [results, setResults] = useState([]);

  // Calculate costs whenever inputs change
  useEffect(() => {
    calculateCosts();
  }, [queriesPerDay, inputTokens, outputTokens, cachingRate, selectedProvider]);
  
  // Helper function to format currency
  const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (num >= 1000) {
      return `$${(num/1000).toFixed(1)}k`;
    }
    return `$${num.toLocaleString()}`;
  };

  // Calculate the monthly costs for all models or selected provider
  const calculateCosts = () => {
    const queriesPerMonth = queriesPerDay * 30;
    const providers = selectedProvider === 'all' 
      ? ['openai', 'anthropic', 'google'] 
      : [selectedProvider];
    
    const allResults = [];

    providers.forEach(provider => {
      MODEL_PRICING[provider].forEach(model => {
        // Calculate token counts per month
        const totalInputTokens = queriesPerMonth * inputTokens;
        const cachedInputTokens = totalInputTokens * (cachingRate / 100);
        const nonCachedInputTokens = totalInputTokens - cachedInputTokens;
        const totalOutputTokens = queriesPerMonth * outputTokens;

        // Calculate costs
        const inputCost = nonCachedInputTokens * (model.inputPrice / 1000000);
        const cachedInputCost = model.cachedInputPrice !== null 
          ? cachedInputTokens * (model.cachedInputPrice / 1000000) 
          : 0;
        const outputCost = totalOutputTokens * (model.outputPrice / 1000000);
        const totalCost = inputCost + cachedInputCost + outputCost;

        allResults.push({
          provider,
          model: model.name,
          inputCost: inputCost.toFixed(2),
          cachedInputCost: cachedInputCost.toFixed(2),
          outputCost: outputCost.toFixed(2),
          totalCost: totalCost.toFixed(2),
          inputTokenPrice: model.inputPrice,
          cachedInputPrice: model.cachedInputPrice,
          outputTokenPrice: model.outputPrice
        });
      });
    });

    // Sort by total cost
    allResults.sort((a, b) => parseFloat(a.totalCost) - parseFloat(b.totalCost));
    setResults(allResults);
  };

  return (
    <div className="rag-calculator">
      <div className="calculator-header">
        <h2>RAG LLM Cost Calculator</h2>
        <p>Calculate monthly LLM costs for your Retrieval Augmented Generation applications</p>
        <div className="view-toggle">
          <button 
            className={viewMode === 'table' ? 'active' : ''}
            onClick={() => setViewMode('table')}
          >
            Table View
          </button>
          <button 
            className={viewMode === 'comparison' ? 'active' : ''}
            onClick={() => setViewMode('comparison')}
          >
            Comparison View
          </button>
        </div>
      </div>

      <div className="calculator-container">
        <div className="inputs-container">
          <div className="input-group">
            <label htmlFor="queriesPerDay">Queries per day</label>
            <div className="input-with-buttons">
              <button onClick={() => setQueriesPerDay(Math.max(1, queriesPerDay - 10))}>-</button>
              <input 
                type="number" 
                id="queriesPerDay" 
                value={queriesPerDay} 
                onChange={(e) => setQueriesPerDay(Math.max(1, parseInt(e.target.value) || 0))}
              />
              <button onClick={() => setQueriesPerDay(queriesPerDay + 10)}>+</button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="inputTokens">Input tokens per query</label>
            <div className="input-with-buttons">
              <button onClick={() => setInputTokens(Math.max(100, inputTokens - 1000))}>-</button>
              <input 
                type="number" 
                id="inputTokens" 
                value={inputTokens} 
                onChange={(e) => setInputTokens(Math.max(1, parseInt(e.target.value) || 0))}
              />
              <button onClick={() => setInputTokens(inputTokens + 1000)}>+</button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="outputTokens">Output tokens per query</label>
            <div className="input-with-buttons">
              <button onClick={() => setOutputTokens(Math.max(10, outputTokens - 100))}>-</button>
              <input 
                type="number" 
                id="outputTokens" 
                value={outputTokens} 
                onChange={(e) => setOutputTokens(Math.max(1, parseInt(e.target.value) || 0))}
              />
              <button onClick={() => setOutputTokens(outputTokens + 100)}>+</button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="cachingRate">Caching rate (%)</label>
            <div className="input-with-buttons">
              <button onClick={() => setCachingRate(Math.max(0, cachingRate - 5))}>-</button>
              <input 
                type="number" 
                id="cachingRate" 
                value={cachingRate} 
                onChange={(e) => setCachingRate(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
              />
              <button onClick={() => setCachingRate(Math.min(100, cachingRate + 5))}>+</button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="provider">Provider</label>
            <select 
              id="provider" 
              value={selectedProvider} 
              onChange={(e) => setSelectedProvider(e.target.value)}
            >
              <option value="all">All Providers</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google</option>
            </select>
          </div>
        </div>

        <div className="results-container">
          <div className="summary-stats">
            <div className="stat-box">
              <p className="stat-label">Monthly queries</p>
              <p className="stat-value">{(queriesPerDay * 30).toLocaleString()}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Monthly tokens</p>
              <p className="stat-value">{((queriesPerDay * 30 * (inputTokens + outputTokens))).toLocaleString()}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Cheapest option</p>
              <p className="stat-value">
                {results.length > 0 ? formatCurrency(results[0].totalCost) : '-'}
              </p>
            </div>
          </div>

          {viewMode === 'table' ? (
            <div className="results-table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Model</th>
                    <th>Input Cost</th>
                    <th>Cached Cost</th>
                    <th>Output Cost</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className={index === 0 ? 'best-option' : ''}>
                      <td>
                        <span className={`provider-badge ${result.provider}`}>{result.provider}</span>
                      </td>
                      <td>{result.model}</td>
                      <td>{formatCurrency(result.inputCost)}</td>
                      <td>{formatCurrency(result.cachedInputCost)}</td>
                      <td>{formatCurrency(result.outputCost)}</td>
                      <td className="total-cost">{formatCurrency(result.totalCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="comparison-chart">
              <div className="chart-header">
                <div className="chart-title">Total Monthly Cost Comparison</div>
                <div className="chart-subtitle">Based on {queriesPerDay.toLocaleString()} queries per day with {inputTokens.toLocaleString()} input tokens and {outputTokens.toLocaleString()} output tokens</div>
              </div>
              <div className="chart-container">
                {results.slice(0, 15).map((result, index) => {
                  const maxCost = Math.max(...results.slice(0, 15).map(r => parseFloat(r.totalCost)));
                  const percentage = (parseFloat(result.totalCost) / maxCost) * 100;
                  return (
                    <div key={index} className="chart-bar-container">
                      <div className="chart-label">
                        <span className={`provider-badge ${result.provider}`}>{result.provider}</span>
                        <span className="model-name">{result.model}</span>
                      </div>
                      <div className="chart-bar-wrapper">
                        <div 
                          className={`chart-bar ${result.provider}`} 
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="chart-value">{formatCurrency(result.totalCost)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {results.length > 15 && (
                <div className="chart-note">* Showing top 15 most cost-effective models</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="pricing-details">
        <h3>Pricing details (per million tokens)</h3>
        <div className="pricing-tables-container">
          {['openai', 'anthropic', 'google'].map(provider => (
            <div key={provider} className={`pricing-table ${provider}`}>
              <h4>{provider.charAt(0).toUpperCase() + provider.slice(1)}</h4>
              <table>
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Input</th>
                    <th>Cached</th>
                    <th>Output</th>
                  </tr>
                </thead>
                <tbody>
                  {MODEL_PRICING[provider].map((model, idx) => (
                    <tr key={idx}>
                      <td>{model.name}</td>
                      <td>${model.inputPrice.toFixed(2)}</td>
                      <td>{model.cachedInputPrice !== null ? `$${model.cachedInputPrice.toFixed(2)}` : 'N/A'}</td>
                      <td>${model.outputPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RAGCalculator;
