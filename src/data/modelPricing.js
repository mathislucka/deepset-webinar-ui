// Model pricing data for calculator

export const modelCategories = [
  {
    name: "OpenAI",
    models: [
      {
        name: "GPT-4.1",
        inputPrice: 2.00,
        cachedInputPrice: 0.50,
        outputPrice: 8.00,
      },
      {
        name: "GPT-4.1-mini",
        inputPrice: 0.40,
        cachedInputPrice: 0.10,
        outputPrice: 1.60,
      },
      {
        name: "GPT-4.1-nano",
        inputPrice: 0.10,
        cachedInputPrice: 0.025,
        outputPrice: 0.40,
      },
      {
        name: "GPT-4.5-preview",
        inputPrice: 75.00,
        cachedInputPrice: 37.50,
        outputPrice: 150.00,
      },
      {
        name: "GPT-4o",
        inputPrice: 2.50,
        cachedInputPrice: 1.25,
        outputPrice: 10.00,
      },
      {
        name: "GPT-4o-audio-preview",
        inputPrice: 2.50,
        cachedInputPrice: null,
        outputPrice: 10.00,
      },
      {
        name: "GPT-4o-realtime-preview",
        inputPrice: 5.00,
        cachedInputPrice: 2.50,
        outputPrice: 20.00,
      },
      {
        name: "GPT-4o-mini",
        inputPrice: 0.15,
        cachedInputPrice: 0.075,
        outputPrice: 0.60,
      },
      {
        name: "GPT-4o-mini-audio-preview",
        inputPrice: 0.15,
        cachedInputPrice: null,
        outputPrice: 0.60,
      },
      {
        name: "GPT-4o-mini-realtime-preview",
        inputPrice: 0.60,
        cachedInputPrice: 0.30,
        outputPrice: 2.40,
      },
      {
        name: "O1",
        inputPrice: 15.00,
        cachedInputPrice: 7.50,
        outputPrice: 60.00,
      },
      {
        name: "O1-pro",
        inputPrice: 150.00,
        cachedInputPrice: null,
        outputPrice: 600.00,
      },
      {
        name: "O3",
        inputPrice: 10.00,
        cachedInputPrice: 2.50,
        outputPrice: 40.00,
      },
      {
        name: "O4-mini",
        inputPrice: 1.10,
        cachedInputPrice: 0.275,
        outputPrice: 4.40,
      },
      {
        name: "O3-mini",
        inputPrice: 1.10,
        cachedInputPrice: 0.55,
        outputPrice: 4.40,
      },
      {
        name: "O1-mini",
        inputPrice: 1.10,
        cachedInputPrice: 0.55,
        outputPrice: 4.40,
      },
      {
        name: "GPT-4o-mini-search-preview",
        inputPrice: 0.15,
        cachedInputPrice: null,
        outputPrice: 0.60,
      },
      {
        name: "GPT-4o-search-preview",
        inputPrice: 2.50,
        cachedInputPrice: null,
        outputPrice: 10.00,
      },
      {
        name: "Computer-use-preview",
        inputPrice: 3.00,
        cachedInputPrice: null,
        outputPrice: 12.00,
      },
    ]
  },
  {
    name: "Anthropic",
    models: [
      {
        name: "Claude 3.7 Sonnet",
        inputPrice: 3.00,
        cachedInputPrice: 0.30,  // Prompt caching read
        outputPrice: 15.00,
      },
      {
        name: "Claude 3.5 Haiku",
        inputPrice: 0.80,
        cachedInputPrice: 0.08,  // Prompt caching read
        outputPrice: 4.00,
      },
      {
        name: "Claude 3 Opus",
        inputPrice: 15.00,
        cachedInputPrice: 1.50,  // Prompt caching read
        outputPrice: 75.00,
      },
    ]
  },
  {
    name: "Google",
    models: [
      {
        name: "Gemini 2.5 Pro (≤200k)",
        inputPrice: 1.25,
        cachedInputPrice: null, // Not available yet
        outputPrice: 10.00,
      },
      {
        name: "Gemini 2.5 Pro (>200k)",
        inputPrice: 2.50,
        cachedInputPrice: null, // Not available yet
        outputPrice: 15.00,
      },
      {
        name: "Gemini 2.0 Flash",
        inputPrice: 0.10,
        cachedInputPrice: 0.025,
        outputPrice: 0.40,
      },
      {
        name: "Gemini 2.0 Flash-Lite",
        inputPrice: 0.075,
        cachedInputPrice: null, // Not available
        outputPrice: 0.30,
      },
    ]
  },
];

// Helper for consistent financial formatting
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};
