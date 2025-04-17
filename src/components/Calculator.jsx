import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Slider,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import modelData from '../data/modelPricing';

const Calculator = () => {
  const [queriesPerDay, setQueriesPerDay] = useState(100);
  const [inputTokens, setInputTokens] = useState(15000);
  const [outputTokens, setOutputTokens] = useState(700);
  const [selectedTab, setSelectedTab] = useState('calculator');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedModel, setSelectedModel] = useState(modelData.all[0].id);
  const [useCaching, setUseCaching] = useState(false);
  const [cachingPercentage, setCachingPercentage] = useState(50);

  // Calculate costs
  const calculateCost = (model) => {
    const queriesPerMonth = queriesPerDay * 30;
    
    // Total tokens calculation
    const totalInputTokensPerMonth = queriesPerMonth * inputTokens;
    const totalOutputTokensPerMonth = queriesPerMonth * outputTokens;
    
    // Handle caching if enabled
    let cachedInputTokensPerMonth = 0;
    let nonCachedInputTokensPerMonth = totalInputTokensPerMonth;
    
    if (useCaching && model.cachedInputPrice !== null) {
      cachedInputTokensPerMonth = Math.floor(totalInputTokensPerMonth * (cachingPercentage / 100));
      nonCachedInputTokensPerMonth = totalInputTokensPerMonth - cachedInputTokensPerMonth;
    }
    
    // Calculate costs in dollars
    const inputCost = (nonCachedInputTokensPerMonth / 1000000) * model.inputPrice;
    const cachedInputCost = (cachedInputTokensPerMonth / 1000000) * (model.cachedInputPrice || 0);
    const outputCost = (totalOutputTokensPerMonth / 1000000) * model.outputPrice;
    
    const totalCost = inputCost + cachedInputCost + outputCost;
    
    return {
      totalCost,
      inputCost,
      cachedInputCost,
      outputCost,
      queriesPerMonth,
      totalInputTokensPerMonth,
      totalOutputTokensPerMonth,
      cachedInputTokensPerMonth,
      nonCachedInputTokensPerMonth
    };
  };

  // Get the details for the selected model
  const getSelectedModelDetails = () => {
    return modelData.all.find(model => model.id === selectedModel);
  };

  // Get filtered models based on selected company
  const getFilteredModels = () => {
    if (selectedCompany === 'all') {
      return modelData.all;
    }
    return modelData[selectedCompany] || [];
  };

  // When company changes, update selected model to first in that company
  useEffect(() => {
    const filteredModels = getFilteredModels();
    if (filteredModels.length > 0) {
      setSelectedModel(filteredModels[0].id);
    }
  }, [selectedCompany]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format large numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', p: 3 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
        LLM Cost Calculator for RAG Chat
      </Typography>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        centered
        sx={{ mb: 4 }}
      >
        <Tab label="Calculator" value="calculator" />
        <Tab label="Comparison Table" value="comparison" />
      </Tabs>

      {selectedTab === 'calculator' && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Input Parameters
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Model Provider</InputLabel>
                  <Select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    label="Model Provider"
                  >
                    <MenuItem value="all">All Providers</MenuItem>
                    <MenuItem value="openAI">OpenAI</MenuItem>
                    <MenuItem value="anthropic">Anthropic</MenuItem>
                    <MenuItem value="google">Google</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Model</InputLabel>
                  <Select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    label="Model"
                  >
                    {getFilteredModels().map((model) => (
                      <MenuItem key={model.id} value={model.id}>
                        {model.name} ({model.company})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography gutterBottom>Queries per Day: {formatNumber(queriesPerDay)}</Typography>
                <Slider
                  value={queriesPerDay}
                  onChange={(e, newValue) => setQueriesPerDay(newValue)}
                  min={1}
                  max={10000}
                  step={10}
                  valueLabelDisplay="auto"
                  sx={{ mb: 3 }}
                />
                <TextField
                  label="Queries per Day"
                  type="number"
                  value={queriesPerDay}
                  onChange={(e) => setQueriesPerDay(parseInt(e.target.value) || 0)}
                  fullWidth
                  sx={{ mb: 3 }}
                />
                
                <Divider sx={{ my: 2 }} />
                
                <Typography gutterBottom>Input Tokens per Query: {formatNumber(inputTokens)}</Typography>
                <Slider
                  value={inputTokens}
                  onChange={(e, newValue) => setInputTokens(newValue)}
                  min={100}
                  max={50000}
                  step={100}
                  valueLabelDisplay="auto"
                  sx={{ mb: 3 }}
                />
                <TextField
                  label="Input Tokens per Query"
                  type="number"
                  value={inputTokens}
                  onChange={(e) => setInputTokens(parseInt(e.target.value) || 0)}
                  fullWidth
                  sx={{ mb: 3 }}
                />
                
                <Typography gutterBottom>Output Tokens per Query: {formatNumber(outputTokens)}</Typography>
                <Slider
                  value={outputTokens}
                  onChange={(e, newValue) => setOutputTokens(newValue)}
                  min={10}
                  max={5000}
                  step={10}
                  valueLabelDisplay="auto"
                  sx={{ mb: 3 }}
                />
                <TextField
                  label="Output Tokens per Query"
                  type="number"
                  value={outputTokens}
                  onChange={(e) => setOutputTokens(parseInt(e.target.value) || 0)}
                  fullWidth
                  sx={{ mb: 3 }}
                />
                
                <Divider sx={{ my: 2 }} />
                
                {getSelectedModelDetails().cachedInputPrice !== null && (
                  <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={useCaching}
                          onChange={(e) => setUseCaching(e.target.checked)}
                        />
                      }
                      label="Use Prompt Caching"
                    />
                    
                    {useCaching && (
                      <Box sx={{ mt: 2 }}>
                        <Typography gutterBottom>Caching Percentage: {cachingPercentage}%</Typography>
                        <Slider
                          value={cachingPercentage}
                          onChange={(e, newValue) => setCachingPercentage(newValue)}
                          min={0}
                          max={100}
                          step={5}
                          valueLabelDisplay="auto"
                          valueLabelFormat={(value) => `${value}%`}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Cost Breakdown for {getSelectedModelDetails().name}
                </Typography>
                
                {(() => {
                  const selectedModelDetails = getSelectedModelDetails();
                  const costs = calculateCost(selectedModelDetails);
                  
                  return (
                    <Box>
                      <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                          <Card variant="outlined" sx={{ bgcolor: '#f5f5f5', height: '100%' }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>Monthly Queries</Typography>
                              <Typography variant="h4" color="primary">
                                {formatNumber(costs.queriesPerMonth)}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Card variant="outlined" sx={{ bgcolor: '#f5f5f5', height: '100%' }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>Total Monthly Cost</Typography>
                              <Typography variant="h4" color="primary">
                                {formatCurrency(costs.totalCost)}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                      
                      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table>
                          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                              <TableCell><Typography fontWeight="bold">Cost Component</Typography></TableCell>
                              <TableCell align="right"><Typography fontWeight="bold">Amount</Typography></TableCell>
                              <TableCell align="right"><Typography fontWeight="bold">Cost</Typography></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Input Tokens (Non-cached)</TableCell>
                              <TableCell align="right">{formatNumber(costs.nonCachedInputTokensPerMonth)}</TableCell>
                              <TableCell align="right">{formatCurrency(costs.inputCost)}</TableCell>
                            </TableRow>
                            
                            {useCaching && selectedModelDetails.cachedInputPrice !== null && (
                              <TableRow>
                                <TableCell>Input Tokens (Cached)</TableCell>
                                <TableCell align="right">{formatNumber(costs.cachedInputTokensPerMonth)}</TableCell>
                                <TableCell align="right">{formatCurrency(costs.cachedInputCost)}</TableCell>
                              </TableRow>
                            )}
                            
                            <TableRow>
                              <TableCell>Output Tokens</TableCell>
                              <TableCell align="right">{formatNumber(costs.totalOutputTokensPerMonth)}</TableCell>
                              <TableCell align="right">{formatCurrency(costs.outputCost)}</TableCell>
                            </TableRow>
                            
                            <TableRow sx={{ bgcolor: '#f9f9f9' }}>
                              <TableCell><Typography fontWeight="bold">Total</Typography></TableCell>
                              <TableCell align="right"></TableCell>
                              <TableCell align="right"><Typography fontWeight="bold">{formatCurrency(costs.totalCost)}</Typography></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                      <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Model Pricing Details:
                        </Typography>
                        <Typography variant="body2">
                          Input: {formatCurrency(selectedModelDetails.inputPrice)} per million tokens
                        </Typography>
                        {selectedModelDetails.cachedInputPrice !== null && (
                          <Typography variant="body2">
                            Cached Input: {formatCurrency(selectedModelDetails.cachedInputPrice)} per million tokens
                          </Typography>
                        )}
                        <Typography variant="body2">
                          Output: {formatCurrency(selectedModelDetails.outputPrice)} per million tokens
                        </Typography>
                        {selectedModelDetails.notes && (
                          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                            Note: {selectedModelDetails.notes}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })()}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 'comparison' && (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Model Cost Comparison
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Queries per Day: {formatNumber(queriesPerDay)}</Typography>
              <Slider
                value={queriesPerDay}
                onChange={(e, newValue) => setQueriesPerDay(newValue)}
                min={1}
                max={10000}
                step={10}
                valueLabelDisplay="auto"
                sx={{ mb: 2 }}
              />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Input Tokens per Query"
                    type="number"
                    value={inputTokens}
                    onChange={(e) => setInputTokens(parseInt(e.target.value) || 0)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Output Tokens per Query"
                    type="number"
                    value={outputTokens}
                    onChange={(e) => setOutputTokens(parseInt(e.target.value) || 0)}
                    fullWidth
                  />
                </Grid>
              </Grid>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={useCaching}
                    onChange={(e) => setUseCaching(e.target.checked)}
                  />
                }
                label="Use Prompt Caching"
                sx={{ mt: 2 }}
              />
              
              {useCaching && (
                <Box sx={{ mt: 1 }}>
                  <Typography gutterBottom>Caching Percentage: {cachingPercentage}%</Typography>
                  <Slider
                    value={cachingPercentage}
                    onChange={(e, newValue) => setCachingPercentage(newValue)}
                    min={0}
                    max={100}
                    step={5}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                  />
                </Box>
              )}
            </Box>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Filter by Provider</InputLabel>
              <Select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                label="Filter by Provider"
              >
                <MenuItem value="all">All Providers</MenuItem>
                <MenuItem value="openAI">OpenAI</MenuItem>
                <MenuItem value="anthropic">Anthropic</MenuItem>
                <MenuItem value="google">Google</MenuItem>
              </Select>
            </FormControl>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><Typography fontWeight="bold">Model</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Provider</Typography></TableCell>
                    <TableCell align="right"><Typography fontWeight="bold">Monthly Queries</Typography></TableCell>
                    <TableCell align="right"><Typography fontWeight="bold">Monthly Cost</Typography></TableCell>
                    <TableCell align="right"><Typography fontWeight="bold">Cost per Query</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredModels()
                    .map((model) => {
                      const costs = calculateCost(model);
                      const costPerQuery = costs.totalCost / costs.queriesPerMonth;
                      
                      return (
                        <TableRow 
                          key={model.id} 
                          hover 
                          onClick={() => {
                            setSelectedModel(model.id);
                            setSelectedTab('calculator');
                          }}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>{model.name}</TableCell>
                          <TableCell>{model.company}</TableCell>
                          <TableCell align="right">{formatNumber(costs.queriesPerMonth)}</TableCell>
                          <TableCell align="right">{formatCurrency(costs.totalCost)}</TableCell>
                          <TableCell align="right">{formatCurrency(costPerQuery)}</TableCell>
                        </TableRow>
                      );
                    })
                    .sort((a, b) => {
                      // Extract the totalCost from each row's 4th cell
                      const costA = parseFloat(a.props.children[3].props.children.replace(/[^0-9.-]+/g, ''));
                      const costB = parseFloat(b.props.children[3].props.children.replace(/[^0-9.-]+/g, ''));
                      return costA - costB;
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              Click on any row to see detailed breakdown for that model
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Calculator;
