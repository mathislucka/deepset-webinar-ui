import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RAGCalculator from './RAGCalculator';

describe('RAGCalculator', () => {
  test('renders the calculator with default values', () => {
    render(<RAGCalculator />);
    
    // Check if the component title is rendered
    expect(screen.getByText('RAG Calculator')).toBeInTheDocument();
    
    // Check if default input values are set correctly
    expect(screen.getByLabelText('Queries per day')).toHaveValue(100);
    expect(screen.getByLabelText('Input tokens per query')).toHaveValue(15000);
    expect(screen.getByLabelText('Output tokens per query')).toHaveValue(700);
    expect(screen.getByLabelText('Cache hit rate (%)')).toHaveValue(20);
  });
  
  test('updates calculations when inputs change', () => {
    render(<RAGCalculator />);
    
    // Change the inputs
    fireEvent.change(screen.getByLabelText('Queries per day'), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText('Input tokens per query'), { target: { value: '10000' } });
    
    // Check if monthly queries calculation is updated
    expect(screen.getByText('Queries per month:')).toBeInTheDocument();
    expect(screen.getByText('6,000')).toBeInTheDocument(); // 200 * 30 = 6000
  });
  
  test('toggles between provider view and comparison view', () => {
    render(<RAGCalculator />);
    
    // Initially should be in provider view (OpenAI is default)
    expect(screen.getByText('OpenAI Models')).toBeInTheDocument();
    
    // Toggle to comparison view
    fireEvent.click(screen.getByLabelText('Show comparison'));
    
    // Should now show comparison table
    expect(screen.getByText('Monthly Cost Comparison')).toBeInTheDocument();
    
    // Toggle back to provider view
    fireEvent.click(screen.getByLabelText('Show comparison'));
    
    // Should be back to provider view
    expect(screen.getByText('OpenAI Models')).toBeInTheDocument();
  });
  
  test('changes provider when different one is selected', () => {
    render(<RAGCalculator />);
    
    // Initially should show OpenAI models
    expect(screen.getByText('OpenAI Models')).toBeInTheDocument();
    
    // Change provider to Anthropic
    fireEvent.change(screen.getByLabelText('Model Provider'), { target: { value: 'anthropic' } });
    
    // Should now show Anthropic models
    expect(screen.getByText('Anthropic Models')).toBeInTheDocument();
  });
});
