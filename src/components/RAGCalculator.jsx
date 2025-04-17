import React, { useState, useEffect } from 'react';
import '../styles/RAGCalculator.css';

// LLM Pricing data
const llmPricing = {
  openai: [
    { model: 'gpt-4.1', inputPrice: 2.00, cachedInputPrice: 0.50, outputPrice: 8.00 },
    { model: 'gpt-4.1-mini', inputPrice: 0.40, cachedInputPrice: 0.10, outputPrice: 1.60 },
    { model: 'gpt-4.1-nano', inputPrice: 0.10, cachedInputPrice: 0.025, outputPrice: 0.40 },
    { model: 'gpt-4.5-preview', inputPrice: 75.00, cachedInputPrice: 37.50, outputPrice: 150.00 },
    { model: 'gpt-4o', inputPrice: 2.50, cachedInputPrice: 1.25, outputPrice: 10.00 },
    { model: 'gpt-4o-mini', inputPrice: 0.15, cachedInputPrice: 0.075, outputPrice: 0.60 }
  ],
  anthropic: [
    { model: 'Claude 3.7 Sonnet', inputPrice: 3.00, cachedInputPrice: 0.30, outputPrice: 15.00 },
    { model: 'Claude 3.5 Haiku', inputPrice: 0.80, cachedInputPrice: 0.08, outputPrice: 4.00 },
    { model: 'Claude 3 Opus', inputPrice: 15.00, cachedInputPrice: 1.50, outputPrice: 75.00 }
  ],
  google: [
    { model: 'Gemini 2.5 Pro', inputPrice: 1.25, cachedInputPrice: null, outputPrice: 10.00 },
    { model: 'Gemini 2.0 Flash', inputPrice: 0.10, cachedInputPrice: 0.025, outputPrice: 0.40 },
    { model: 'Gemini 2.0 Flash-Lite', inputPrice: 0.075, cachedInputPrice: null, outputPrice: 0.30 }
  ]
};

// Default input/output token values
const DEFAULT_INPUT_TOKENS = 15000;
const DEFAULT_OUTPUT_TOKENS = 700;
const DEFAULT_QUERIES_PER_DAY = 100;
const DEFAULT_CACHE_HIT_RATE = 20; // 20%

const RAGCalculator = () => {
  const [provider, setProvider] = useState('openai');
  const [queriesPerDay, setQueriesPerDay] = useState(DEFAULT_QUERIES_PER_DAY);
  const [inputTokens, setInputTokens] = useState(DEFAULT_INPUT_TOKENS);
  const [outputTokens, setOutputTokens] = useState(DEFAULT_OUTPUT_TOKENS);
  const [cacheHitRate, setCacheHitRate] = useState(DEFAULT_CACHE_HIT_RATE);
  const [comparison, setComparison] = useState(false);
  
  // Calculate costs for a specific model
  const calculateModelCost = (model, queriesPerDay, inputTokens, outputTokens, cacheHitRate) => {
    const queriesPerMonth = queriesPerDay * 30;
    const totalInputTokens = queriesPerMonth * inputTokens / 1000000; // Convert to millions
    const totalOutputTokens = queriesPerMonth * outputTokens / 1000000; // Convert to millions
    
    // Calculate cache hits and misses
    const cacheHitPercentage = cacheHitRate / 100;
    const cachedQueries = queriesPerMonth * cacheHitPercentage;
    const uncachedQueries = queriesPerMonth * (1 - cacheHitPercentage);
    
    const uncachedInputCost = (uncachedQueries * inputTokens / 1000000) * model.inputPrice;
    
    // Calculate cached input cost only if the model has a cached input price
    const cachedInputCost = model.cachedInputPrice !== null ? 
      (cachedQueries * inputTokens / 1000000) * model.cachedInputPrice : 0;
    
    const outputCost = totalOutputTokens * model.outputPrice;
    
    const totalCost = uncachedInputCost + cachedInputCost + outputCost;
    
    return {
      queriesPerMonth,
      totalInputTokens,
      totalOutputTokens,
      uncachedInputCost,
      cachedInputCost,
      outputCost,
      totalCost,
    };
  };

  // Calculate costs for all models
  const calculateAllCosts = () => {
    const results = {};
    
    Object.keys(llmPricing).forEach(provider => {
      results[provider] = llmPricing[provider].map(model => {
        const costs = calculateModelCost(model, queriesPerDay, inputTokens, outputTokens, cacheHitRate);
        return {
          model: model.model,
          ...costs
        };
      });
    });
    
    return results;
  };
  
  // Get selected provider's models
  const getSelectedProviderModels = () => {
    return llmPricing[provider] || [];
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="rag-calculator">
      <div className="calculator-header">
        <h2>RAG Calculator</h2>
        <p>Calculate your Large Language Model costs for Retrieval Augmented Generation</p>
      </div>
      
      <div className="calculator-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="queries-per-day">Queries per day</label>
            <input 
              type="number" 
              id="queries-per-day" 
              value={queriesPerDay}
              onChange={(e) => setQueriesPerDay(Math.max(1, parseInt(e.target.value) || 0))}
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="input-tokens">Input tokens per query</label>
            <input 
              type="number" 
              id="input-tokens" 
              value={inputTokens}
              onChange={(e) => setInputTokens(Math.max(1, parseInt(e.target.value) || 0))}
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="output-tokens">Output tokens per query</label>
            <input 
              type="number" 
              id="output-tokens" 
              value={outputTokens}
              onChange={(e) => setOutputTokens(Math.max(1, parseInt(e.target.value) || 0))}
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cache-hit-rate">Cache hit rate (%)</label>
            <input 
              type="number" 
              id="cache-hit-rate" 
              value={cacheHitRate}
              onChange={(e) => setCacheHitRate(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
              min="0"
              max="100"
            />
          </div>
        </div>
        
        <div className="form-row view-controls">
          <div className="form-group provider-select">
            <label htmlFor="provider">Model Provider</label>
            <select 
              id="provider" 
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              disabled={comparison}
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google</option>
            </select>
          </div>
          
          <div className="form-group comparison-toggle">
            <label htmlFor="comparison">Show comparison</label>
            <label className="switch">
              <input 
                type="checkbox" 
                id="comparison" 
                checked={comparison}
                onChange={(e) => setComparison(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="calculator-results">
        {comparison ? (
          // Comparison view of all providers
          <div className="comparison-table">
            <h3>Monthly Cost Comparison</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Model</th>
                    <th>Input Cost</th>
                    <th>Output Cost</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(calculateAllCosts()).flatMap(([providerName, models]) =>
                    models.map((result, index) => (
                      <tr key={`${providerName}-${index}`}>
                        <td>{providerName.charAt(0).toUpperCase() + providerName.slice(1)}</td>
                        <td>{result.model}</td>
                        <td>{formatCurrency(result.uncachedInputCost + result.cachedInputCost)}</td>
                        <td>{formatCurrency(result.outputCost)}</td>
                        <td className="total-cost">{formatCurrency(result.totalCost)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="results-summary">
              <p>Monthly calculation based on {queriesPerDay} queries/day with {inputTokens.toLocaleString()} input tokens and {outputTokens.toLocaleString()} output tokens per query, with a {cacheHitRate}% cache hit rate.</p>
            </div>
          </div>
        ) : (
          // Detailed view of selected provider
          <div className="provider-table">
            <h3>{provider.charAt(0).toUpperCase() + provider.slice(1)} Models</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Input Cost</th>
                    <th>Cached Input Cost</th>
                    <th>Output Cost</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {getSelectedProviderModels().map((model, index) => {
                    const result = calculateModelCost(model, queriesPerDay, inputTokens, outputTokens, cacheHitRate);
                    return (
                      <tr key={index}>
                        <td>{model.model}</td>
                        <td>{formatCurrency(result.uncachedInputCost)}</td>
                        <td>{model.cachedInputPrice !== null ? formatCurrency(result.cachedInputCost) : 'N/A'}</td>
                        <td>{formatCurrency(result.outputCost)}</td>
                        <td className="total-cost">{formatCurrency(result.totalCost)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="results-details">
              <div className="detail-item">
                <span>Queries per month:</span>
                <span>{(queriesPerDay * 30).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span>Total input tokens (per month):</span>
                <span>{(queriesPerDay * inputTokens * 30).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span>Total output tokens (per month):</span>
                <span>{(queriesPerDay * outputTokens * 30).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="calculator-info">
        <div className="info-section">
          <h4>About this calculator</h4>
          <p>This calculator helps you estimate the monthly costs of using large language models (LLMs) in a Retrieval Augmented Generation (RAG) application. Default values are based on typical RAG usage patterns.</p>
          <p><strong>Input tokens:</strong> Typically higher in RAG applications due to context from retrieved documents.</p>
          <p><strong>Output tokens:</strong> The generated responses from the LLM.</p>
          <p><strong>Cache hit rate:</strong> Percentage of queries that can use cached results, reducing costs.</p>
        </div>
      </div>
    </div>
  );
};

export default RAGCalculator;
