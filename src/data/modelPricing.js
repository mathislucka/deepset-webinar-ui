// OpenAI Models
const openAIModels = [
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    company: 'OpenAI',
    inputPrice: 2.00,
    cachedInputPrice: 0.50,
    outputPrice: 8.00,
  },
  {
    id: 'gpt-4.1-mini',
    name: 'GPT-4.1 Mini',
    company: 'OpenAI',
    inputPrice: 0.40,
    cachedInputPrice: 0.10,
    outputPrice: 1.60,
  },
  {
    id: 'gpt-4.1-nano',
    name: 'GPT-4.1 Nano',
    company: 'OpenAI',
    inputPrice: 0.10,
    cachedInputPrice: 0.025,
    outputPrice: 0.40,
  },
  {
    id: 'gpt-4.5-preview',
    name: 'GPT-4.5 Preview',
    company: 'OpenAI',
    inputPrice: 75.00,
    cachedInputPrice: 37.50,
    outputPrice: 150.00,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    company: 'OpenAI',
    inputPrice: 2.50,
    cachedInputPrice: 1.25,
    outputPrice: 10.00,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    company: 'OpenAI',
    inputPrice: 0.15,
    cachedInputPrice: 0.075,
    outputPrice: 0.60,
  },
];

// Anthropic Models
const anthropicModels = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    company: 'Anthropic',
    inputPrice: 3.00,
    cachedInputPrice: 0.30,
    outputPrice: 15.00,
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    company: 'Anthropic',
    inputPrice: 0.80,
    cachedInputPrice: 0.08,
    outputPrice: 4.00,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    company: 'Anthropic',
    inputPrice: 15.00,
    cachedInputPrice: 1.50,
    outputPrice: 75.00,
  },
];

// Google Models
const googleModels = [
  {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    company: 'Google',
    inputPrice: 1.25,
    cachedInputPrice: null,
    outputPrice: 10.00,
    notes: 'Prices for <= 200k tokens; higher for larger context',
  },
  {
    id: 'gemini-2-0-flash',
    name: 'Gemini 2.0 Flash',
    company: 'Google',
    inputPrice: 0.10,
    cachedInputPrice: 0.025,
    outputPrice: 0.40,
  },
  {
    id: 'gemini-2-0-flash-lite',
    name: 'Gemini 2.0 Flash-Lite',
    company: 'Google',
    inputPrice: 0.075,
    cachedInputPrice: null,
    outputPrice: 0.30,
  },
];

// Combined model data
const modelData = {
  openAI: openAIModels,
  anthropic: anthropicModels,
  google: googleModels,
  all: [...openAIModels, ...anthropicModels, ...googleModels],
};

export default modelData;
