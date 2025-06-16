# Service Analyzer

A lightweight console application that generates comprehensive, markdown-formatted analysis reports for digital services and products using AI. The application accepts either known service names or custom service descriptions and returns detailed insights from business, technical, and user-focused perspectives.

## Features

- 🔍 **Dual Input Methods**: Accept known service names (e.g., "Spotify", "Notion") or custom service descriptions
- 🤖 **AI-Powered Analysis**: Uses OpenAI GPT to generate detailed insights
- 📊 **Comprehensive Reports**: Includes 8 key analysis sections
- 💾 **Export Options**: Save reports as markdown files with timestamps
- 🎨 **Colorful Console**: Beautiful, user-friendly command-line interface
- ⚡ **Fast & Lightweight**: Quick setup and execution

## Report Sections

Each generated report includes:

1. **Brief History** - Founding year, milestones, and key developments
2. **Target Audience** - Primary user segments and demographics  
3. **Core Features** - Top 2-4 key functionalities
4. **Unique Selling Points** - Key differentiators from competitors
5. **Business Model** - Revenue generation and monetization strategy
6. **Tech Stack Insights** - Technologies and platforms used
7. **Perceived Strengths** - Competitive advantages and standout features
8. **Perceived Weaknesses** - Limitations and areas for improvement

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- OpenAI API key

## Installation

1. **Clone or download** this project to your local machine

2. **Navigate to the project directory**:
   ```bash
   cd <folder>
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up your OpenAI API key and model**:
   
   **Option A: Using .env file (Recommended)**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit the .env file and replace 'your_openai_api_key_here' with your actual API key
   # Also configure your preferred model (default is gpt-4.1-mini)
   # You can use any text editor, for example:
   notepad .env     # Windows
   nano .env        # Linux/Mac
   ```
   
   **Option B: Using environment variable**
   ```bash
   # Windows (PowerShell)
   $env:OPENAI_API_KEY="your_api_key_here"
   $env:OPENAI_MODEL="gpt-4.1-mini"
   
   # Windows (Command Prompt)
   set OPENAI_API_KEY=your_api_key_here
   set OPENAI_MODEL=gpt-4.1-mini
   
   # Linux/Mac
   export OPENAI_API_KEY="your_api_key_here"
   export OPENAI_MODEL="gpt-4.1-mini"
   ```

## Usage

### Running the Application

```bash
npm start
```

or

```bash
node index.js
```

### Interactive Usage

1. **Choose Input Method**: Select between known service name or custom description
2. **Provide Input**: Enter your service name or description
3. **Wait for Analysis**: The AI will generate a comprehensive report
4. **View Results**: The formatted report will be displayed in your terminal
5. **Save Report** (Optional): Choose to save the report as a markdown file

### Example Usage Flows

**For Known Services:**
```
Choose input method: 1
Enter the service name: Spotify
```

**For Custom Descriptions:**
```
Choose input method: 2
Enter your service description: 
[Paste or type your service description]
[Press Enter twice when done]
```

## Sample Commands

```bash
# Install dependencies
npm install

# Run the application
npm start

# Run with specific Node.js version
node index.js
```

## Getting Your OpenAI API Key

1. Go to [OpenAI's website](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to the API section
4. Create a new API key
5. Copy the key and use it in your `.env` file

## Model Configuration

The application supports configurable OpenAI models through the `OPENAI_MODEL` environment variable:

**Available Models:**
- `gpt-4.1-mini` (Default - fast and efficient)
- `gpt-4o` (Most capable, higher cost)
- `gpt-4-turbo` (Good balance of capability and speed)
- `gpt-3.5-turbo` (Fast and economical)

**Setting Your Model:**
1. In your `.env` file, set: `OPENAI_MODEL=gpt-4.1-mini`
2. Or use environment variables as shown in the installation section

**Note:** Make sure you have access to the model you specify in your OpenAI account. The application will default to `gpt-4.1-mini` if no model is specified.

## Project Structure

```
├── index.js           # Main application file
├── package.json       # Project dependencies and scripts
├── env.example       # Example environment configuration
├── .gitignore        # Git ignore patterns
├── README.md         # This file
├── sample_outputs.md # Sample application runs
└── reports/          # Generated reports (created automatically)
```

## Troubleshooting

### Common Issues

**1. "OPENAI_API_KEY environment variable is not set"**
- Solution: Make sure you've created the `.env` file with your API key

**2. "Rate limit exceeded"**
- Solution: Wait a few minutes before trying again, or check your OpenAI usage limits

**3. "401 Unauthorized"**
- Solution: Verify your OpenAI API key is correct and active

**4. Module not found errors**
- Solution: Run `npm install` to install all dependencies

**5. "Model not found" or "Model access denied"**
- Solution: Check that you have access to the specified model in your OpenAI account
- Try using `gpt-4.1-mini` as it's widely available
- Verify your model name in the `.env` file matches exactly

### Getting Help

If you encounter any issues:

1. Check that Node.js is installed: `node --version`
2. Verify all dependencies are installed: `npm list`
3. Confirm your API key is set correctly
4. Check the console for detailed error messages

## Dependencies

- **openai**: OpenAI API client for Node.js
- **readline-sync**: Synchronous command-line input
- **dotenv**: Environment variable loader
- **chalk**: Terminal styling and colors

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

This is a challenge project, but suggestions and improvements are welcome! 