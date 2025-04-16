import { useState, useMemo, useEffect } from 'react';
import { modelCategories, formatCurrency } from '../data/modelPricing';

const Calculator = () => {
  const [queriesPerDay, setQueriesPerDay] = useState(1000);
  const [inputTokens, setInputTokens] = useState(15000);
  const [outputTokens, setOutputTokens] = useState(700);
  const [useCache, setUseCache] = useState(false);
  const [cacheRatio, setCacheRatio] = useState(50);
  const [selectedModelCategory, setSelectedModelCategory] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'

  // Calculate queries per month (30 days)
  const queriesPerMonth = queriesPerDay * 30;

  // Calculate costs for each model
  const calculatedCosts = useMemo(() => {
    return modelCategories.flatMap(category => {
      return category.models.map(model => {
        // Calculate token volumes per month
        const totalInputTokensPerMonth = queriesPerMonth * inputTokens / 1000000; // Convert to millions
        const totalOutputTokensPerMonth = queriesPerMonth * outputTokens / 1000000; // Convert to millions

        // Calculate cached vs non-cached token split if cache is enabled
        let cachedInputTokensPerMonth = 0;
        let freshInputTokensPerMonth = totalInputTokensPerMonth;

        if (useCache && model.cachedInputPrice !== null) {
          cachedInputTokensPerMonth = totalInputTokensPerMonth * (cacheRatio / 100);
          freshInputTokensPerMonth = totalInputTokensPerMonth - cachedInputTokensPerMonth;
        }

        // Calculate costs
        const inputCost = freshInputTokensPerMonth * model.inputPrice;
        
        // Only add cache cost if it's available and enabled
        const cachedInputCost = (useCache && model.cachedInputPrice !== null) 
          ? cachedInputTokensPerMonth * model.cachedInputPrice 
          : 0;
          
        const outputCost = totalOutputTokensPerMonth * model.outputPrice;
        const totalCost = inputCost + cachedInputCost + outputCost;

        return {
          provider: category.name,
          model: model.name,
          inputCost,
          cachedInputCost,
          outputCost,
          totalCost,
          totalTokensPerMonth: totalInputTokensPerMonth + totalOutputTokensPerMonth,
          pricePerQuery: totalCost / queriesPerMonth,
        };
      });
    }).sort((a, b) => a.totalCost - b.totalCost); // Sort by total cost
  }, [queriesPerDay, inputTokens, outputTokens, useCache, cacheRatio]);

  // Filter models by selected category
  const filteredModels = useMemo(() => {
    if (selectedModelCategory === 'all') {
      return calculatedCosts;
    }
    return calculatedCosts.filter(model => model.provider === selectedModelCategory);
  }, [calculatedCosts, selectedModelCategory]);

  const handleQueriesChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setQueriesPerDay(value);
  };

  const handleInputTokensChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setInputTokens(value);
  };

  const handleOutputTokensChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setOutputTokens(value);
  };

  return (
    <div className="calculator-container">
      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="card">
          <h2>RAG Chat Cost Calculator</h2>
          <p className="text-sm mb-4">Calculate the monthly costs for your retrieval augmented generation chat application.</p>
          
          <div className="form-group">
            <label htmlFor="queriesPerDay">Queries Per Day</label>
            <input
              type="number"
              id="queriesPerDay"
              value={queriesPerDay}
              onChange={handleQueriesChange}
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="inputTokens">Input Tokens Per Request</label>
            <input
              type="number"
              id="inputTokens"
              value={inputTokens}
              onChange={handleInputTokensChange}
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="outputTokens">Output Tokens Per Request</label>
            <input
              type="number"
              id="outputTokens"
              value={outputTokens}
              onChange={handleOutputTokensChange}
              min="1"
            />
          </div>

          <div className="form-group">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useCache"
                checked={useCache}
                onChange={(e) => setUseCache(e.target.checked)}
                style={{ width: 'auto' }}
              />
              <label htmlFor="useCache" style={{ display: 'inline', marginBottom: '0' }}>Use Prompt Caching</label>
            </div>
          </div>

          {useCache && (
            <div className="form-group">
              <label htmlFor="cacheRatio">Cache Hit Ratio (%)</label>
              <input
                type="range"
                id="cacheRatio"
                value={cacheRatio}
                onChange={(e) => setCacheRatio(parseInt(e.target.value))}
                min="0"
                max="100"
                step="1"
              />
              <div className="text-center text-sm">{cacheRatio}%</div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="modelCategory">Filter Models</label>
            <select
              id="modelCategory"
              value={selectedModelCategory}
              onChange={(e) => setSelectedModelCategory(e.target.value)}
            >
              <option value="all">All Providers</option>
              {modelCategories.map(category => (
                <option key={category.name} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="summary-container mt-4">
            <div className="card" style={{ backgroundColor: 'rgba(79, 70, 229, 0.05)' }}>
              <h3>Monthly Summary</h3>
              <div className="text-sm">
                <div className="flex justify-between mb-4">
                  <span>Total Queries:</span>
                  <span className="font-semibold">{queriesPerMonth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tokens Per Request:</span>
                  <span className="font-semibold">{(inputTokens + outputTokens).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="results-container">
          <div className="card">
            <h2>Model Cost Comparison</h2>
            <p className="text-sm mb-4">Comparing monthly costs across all supported models.</p>
           
            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Model</th>
                    <th>Input Cost</th>
                    {useCache && <th>Cached Cost</th>}
                    <th>Output Cost</th>
                    <th>Total Cost</th>
                    <th>Per Query</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModels.map((result, index) => (
                    <tr key={index}>
                      <td>{result.provider}</td>
                      <td>{result.model}</td>
                      <td>{formatCurrency(result.inputCost)}</td>
                      {useCache && <td>{formatCurrency(result.cachedInputCost)}</td>}
                      <td>{formatCurrency(result.outputCost)}</td>
                      <td className="font-semibold">{formatCurrency(result.totalCost)}</td>
                      <td>{formatCurrency(result.pricePerQuery)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <h3>Best Value Options</h3>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {filteredModels.slice(0, 3).map((result, index) => (
                  <div key={index} className="card" style={{ margin: 0, padding: '1rem' }}>
                    <div className="text-sm font-semibold">{result.model}</div>
                    <div className="text-xs">{result.provider}</div>
                    <div className="mt-4">
                      <div className="text-lg font-semibold highlight">{formatCurrency(result.totalCost)}</div>
                      <div className="text-xs">per month</div>
                    </div>
                    <div className="text-xs mt-4">
                      <div>{formatCurrency(result.pricePerQuery)} per query</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
