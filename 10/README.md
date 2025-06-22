# Product Filtering System with OpenAI Function Calling

A console-based product search tool that leverages OpenAI's function calling capabilities to filter products based on natural language queries. Instead of traditional hardcoded filtering logic, this application uses AI to interpret user preferences and return structured, filtered results.

## 🌟 Features

- **AI-Powered Natural Language Processing**: Input search criteria in plain English
- **OpenAI Function Calling**: Uses structured function calling for precise product filtering
- **Interactive Console Interface**: Easy-to-use command-line interface
- **Comprehensive Product Database**: Includes 50 products across 5 categories
- **Smart Filtering**: Handles price ranges, ratings, categories, and stock availability
- **Detailed AI Reasoning**: Provides explanations for filtering decisions

## 🏗️ Architecture

This application demonstrates several AI techniques:

- **OpenAI Function Calling**: The model decides when and how to invoke the `filter_products` function
- **Natural Language-to-Structure Conversion**: Converts user queries like "under $200 and in stock" into structured JSON
- **Reasoning over Datasets**: AI analyzes product data and user intent to make filtering decisions

## 📋 Prerequisites

- Node.js (version 18.0.0 or higher)
- npm (comes with Node.js)
- OpenAI API key

## 🚀 Installation

1. **Clone the repository or navigate to the project folder:**
   ```bash
   cd <folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy the example environment file:
     ```bash
     cp env.example .env
     ```
   - Edit the `.env` file and add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_actual_openai_api_key_here
     ```

   **How to get an OpenAI API key:**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in to your account
   - Navigate to API Keys section
   - Create a new API key
   - Copy the key and paste it in your `.env` file

## 🎯 Usage

### Running the Application

Start the application using npm:

```bash
npm start
```

Or run directly with Node.js:

```bash
node index.js
```

### Using the Search Tool

Once the application starts, you'll see a welcome message and prompt for input. You can enter natural language queries such as:

- `"I need electronics under $100 that are in stock"`
- `"Show me fitness equipment with rating above 4.5"`
- `"Find kitchen appliances under $50"`
- `"I want books with good ratings and affordable prices"`
- `"Show me all clothing items available right now"`

### Commands

- Enter any natural language search query to filter products
- Type `quit` to exit the application

## 📊 Product Database

The application includes a comprehensive product database (`products.json`) with 50 products across 5 categories:

- **Electronics**: 10 products (headphones, laptops, smartphones, etc.)
- **Fitness**: 10 products (yoga mats, treadmills, dumbbells, etc.)
- **Kitchen**: 10 products (blenders, air fryers, coffee makers, etc.)
- **Books**: 10 products (novels, guides, cookbooks, etc.)
- **Clothing**: 10 products (t-shirts, jeans, shoes, etc.)

Each product has the following attributes:
- `name`: Product name
- `category`: Product category
- `price`: Price in USD
- `rating`: Rating from 4.0 to 4.8
- `in_stock`: Boolean indicating availability

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | - | Yes |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-4.1-mini` | No |

### Customizing the Model

You can use different OpenAI models by setting the `OPENAI_MODEL` environment variable:

```bash
# For GPT-4 (requires appropriate API access)
OPENAI_MODEL=gpt-4

# For GPT-3.5 Turbo
OPENAI_MODEL=gpt-3.5-turbo
```

## 🛠️ Development

### Project Structure

```
├── index.js           # Main application file
├── products.json      # Product database
├── package.json       # Node.js dependencies and scripts
├── .gitignore        # Git ignore rules
├── env.example       # Environment variables example
├── README.md         # This file
└── sample_outputs.md # Sample application runs
```

### Key Components

1. **Function Schema**: Defines the structure for OpenAI function calling
2. **System Prompt**: Provides context and instructions to the AI model
3. **Product Filtering**: Uses OpenAI's function calling to filter products
4. **Result Display**: Formats and displays filtered results with reasoning

## 🧪 Testing

Run the application with different queries to test various scenarios:

```bash
npm start
```

Try these test queries:
- Price filtering: `"Products under $50"`
- Category filtering: `"Electronics with high ratings"`
- Stock filtering: `"Available fitness equipment"`
- Combined filtering: `"In-stock books under $30 with good ratings"`

## 🚨 Troubleshooting

### Common Issues

1. **API Key Error**
   ```
   Error: OPENAI_API_KEY not found in environment variables
   ```
   **Solution**: Make sure you've created a `.env` file with your OpenAI API key.

2. **Network/API Errors**
   ```
   Error calling OpenAI API: ...
   ```
   **Solution**: Check your internet connection and verify your API key is valid and has credits.

3. **Node.js Version Error**
   **Solution**: Ensure you're using Node.js version 18.0.0 or higher.

### Debug Mode

For detailed error information, check the console output. The application provides specific error messages for common issues.

## 📝 API Usage

The application uses OpenAI's Chat Completions API with function calling. Here's the function schema:

```javascript
{
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
            name: { type: 'string' },
            category: { type: 'string' },
            price: { type: 'number' },
            rating: { type: 'number' },
            in_stock: { type: 'boolean' }
          }
        }
      },
      reasoning: {
        type: 'string',
        description: 'Explanation of why these products were selected'
      }
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Verify your OpenAI API key is correct and has credits
3. Ensure all dependencies are installed correctly
4. Check that you're using a supported Node.js version

## 🔮 Future Enhancements

Potential improvements for future versions:

- Add support for custom product databases
- Implement product recommendation features
- Add export functionality for filtered results
- Create a web interface version
- Add support for multiple languages
- Implement caching for faster responses

---

**Note**: This application requires an active OpenAI API key and internet connection to function properly. Make sure to keep your API key secure and never commit it to version control. 