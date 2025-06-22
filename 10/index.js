#!/usr/bin/env node

require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load products data
const productsPath = path.join(__dirname, 'products.json');
let products = [];

try {
  const data = fs.readFileSync(productsPath, 'utf8');
  products = JSON.parse(data);
  console.log(`✅ Loaded ${products.length} products from database`);
} catch (error) {
  console.error('❌ Error loading products.json:', error.message);
  process.exit(1);
}

// Function schema for OpenAI function calling
const filterProductsFunction = {
  name: 'filter_products',
  description: 'Filter products based on user preferences and return matching products',
  parameters: {
    type: 'object',
    properties: {
      filtered_products: {
        type: 'array',
        description: 'Array of products that match the user criteria',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Product name' },
            category: { type: 'string', description: 'Product category' },
            price: { type: 'number', description: 'Product price' },
            rating: { type: 'number', description: 'Product rating' },
            in_stock: { type: 'boolean', description: 'Stock availability' }
          },
          required: ['name', 'category', 'price', 'rating', 'in_stock']
        }
      },
      reasoning: {
        type: 'string',
        description: 'Explanation of why these products were selected'
      }
    },
    required: ['filtered_products', 'reasoning']
  }
};

// Function to create system prompt with products data
function createSystemPrompt(products) {
  return `You are a product filtering assistant. Based on user preferences, you need to filter products and return matching results.

Available products dataset:
${JSON.stringify(products, null, 2)}

Your task:
1. Analyze the user's natural language request
2. Filter the products based on their criteria (price, category, rating, stock status, etc.)
3. Return the matching products using the filter_products function
4. Provide reasoning for your selection

Categories available: Electronics, Fitness, Kitchen, Books, Clothing
Price range: $9.99 - $1299.99
Rating range: 4.0 - 4.8
Stock status: true/false

Important: You must call the filter_products function with the filtered results. Do not perform manual text-based filtering - use the structured function call.`;
}

// Function to search products using OpenAI function calling
async function searchProducts(userQuery) {
  try {
    console.log('\n🔍 Processing your request...');
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: createSystemPrompt(products)
        },
        {
          role: 'user',
          content: userQuery
        }
      ],
      functions: [filterProductsFunction],
      function_call: { name: 'filter_products' }
    });

    const functionCall = completion.choices[0].message.function_call;
    
    if (functionCall && functionCall.name === 'filter_products') {
      const result = JSON.parse(functionCall.arguments);
      return result;
    } else {
      throw new Error('No function call returned from OpenAI');
    }
  } catch (error) {
    console.error('❌ Error calling OpenAI API:', error.message);
    
    if (error.message.includes('API key')) {
      console.error('Please make sure your OPENAI_API_KEY is set in the .env file');
    }
    
    return null;
  }
}

// Function to display filtered results
function displayResults(result) {
  if (!result || !result.filtered_products) {
    console.log('❌ No results found or error occurred');
    return;
  }

  const { filtered_products, reasoning } = result;

  if (filtered_products.length === 0) {
    console.log('\n📦 No products found matching your criteria.');
    console.log(`💭 Reasoning: ${reasoning}`);
    return;
  }

  console.log('\n📦 Filtered Products:');
  console.log('=' .repeat(50));
  
  filtered_products.forEach((product, index) => {
    const stockStatus = product.in_stock ? '✅ In Stock' : '❌ Out of Stock';
    console.log(`${index + 1}. ${product.name} - $${product.price.toFixed(2)}, Rating: ${product.rating}, ${stockStatus}`);
  });

  console.log('\n💭 AI Reasoning:');
  console.log(reasoning);
  console.log('=' .repeat(50));
}

// Function to validate environment setup
function validateSetup() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY not found in environment variables');
    console.error('Please create a .env file with your OpenAI API key');
    console.error('Example: OPENAI_API_KEY=your_api_key_here');
    process.exit(1);
  }

  if (!fs.existsSync(productsPath)) {
    console.error('❌ Error: products.json file not found');
    process.exit(1);
  }
}

// Main application function
async function main() {
  console.log('🛍️  Welcome to the AI-Powered Product Search Tool!');
  console.log('This tool uses OpenAI function calling to filter products based on your preferences.\n');

  // Validate setup
  validateSetup();

  // Setup readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = (question) => {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  };

  try {
    while (true) {
      console.log('\n🔍 Enter your product search preferences (or "quit" to exit):');
      console.log('Examples:');
      console.log('  - "I need electronics under $100 that are in stock"');
      console.log('  - "Show me fitness equipment with rating above 4.5"');
      console.log('  - "Find kitchen appliances under $50"');
      console.log('  - "I want books with good ratings and affordable prices"\n');

      const userInput = await askQuestion('Your search: ');

      if (userInput.toLowerCase().trim() === 'quit') {
        console.log('👋 Thank you for using the Product Search Tool!');
        break;
      }

      if (!userInput.trim()) {
        console.log('❌ Please enter a valid search query.');
        continue;
      }

      // Search products using OpenAI function calling
      const result = await searchProducts(userInput);
      
      // Display results
      displayResults(result);
    }
  } catch (error) {
    console.error('❌ An error occurred:', error.message);
  } finally {
    rl.close();
  }
}

// Run the application
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { searchProducts, displayResults }; 