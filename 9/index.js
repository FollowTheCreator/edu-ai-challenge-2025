#!/usr/bin/env node

const OpenAI = require('openai');
const readlineSync = require('readline-sync');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class ServiceAnalyzer {
    constructor() {
        this.openai = null;
        this.initializeOpenAI();
    }

    initializeOpenAI() {
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            console.error(chalk.red('❌ Error: OPENAI_API_KEY environment variable is not set.'));
            console.log(chalk.yellow('Please set your OpenAI API key in the .env file or as an environment variable.'));
            process.exit(1);
        }

        this.openai = new OpenAI({
            apiKey: apiKey,
        });
    }

    displayWelcome() {
        console.log(chalk.blue.bold('\n🔍 Service Analyzer'));
        console.log(chalk.gray('Generate comprehensive service analysis reports using AI\n'));
    }

    getUserInput() {
        console.log(chalk.green('Choose input method:'));
        console.log('1. Enter a known service name (e.g., Spotify, Notion, Netflix)');
        console.log('2. Provide custom service description text');
        
        const choice = readlineSync.question(chalk.cyan('\nEnter your choice (1 or 2): '));
        
        let input = '';
        let inputType = '';

        if (choice === '1') {
            input = readlineSync.question(chalk.cyan('Enter the service name: '));
            inputType = 'service_name';
        } else if (choice === '2') {
            console.log(chalk.yellow('\nEnter your service description (press Enter twice when done):'));
            let lines = [];
            let line = '';
            do {
                line = readlineSync.question('');
                if (line.trim() !== '') {
                    lines.push(line);
                }
            } while (line.trim() !== '');
            
            input = lines.join('\n');
            inputType = 'description';
        } else {
            console.log(chalk.red('Invalid choice. Please run the application again.'));
            process.exit(1);
        }

        return { input, inputType };
    }

    generatePrompt(input, inputType) {
        const sections = [
            'Brief History',
            'Target Audience', 
            'Core Features',
            'Unique Selling Points',
            'Business Model',
            'Tech Stack Insights',
            'Perceived Strengths',
            'Perceived Weaknesses'
        ];

        let basePrompt = '';
        
        if (inputType === 'service_name') {
            basePrompt = `Please analyze the service "${input}" and provide a comprehensive report in markdown format.`;
        } else {
            basePrompt = `Please analyze the following service description and provide a comprehensive report in markdown format:\n\n${input}`;
        }

        const fullPrompt = `${basePrompt}

The report must include exactly these sections in this order:

## Brief History
Provide founding year, key milestones, and important developments.

## Target Audience  
Identify primary user segments and demographics.

## Core Features
List the top 2-4 key functionalities that define the service.

## Unique Selling Points
Highlight key differentiators that set this service apart from competitors.

## Business Model
Explain how the service generates revenue and makes money.

## Tech Stack Insights
Provide any available information about technologies, platforms, or technical architecture used.

## Perceived Strengths
List mentioned positives, standout features, and competitive advantages.

## Perceived Weaknesses
Identify cited drawbacks, limitations, or areas for improvement.

Please ensure each section contains meaningful, specific information. If certain information is not publicly available or unclear, make reasonable inferences based on industry knowledge while clearly noting assumptions.`;

        return fullPrompt;
    }

    async generateReport(prompt) {
        try {
            const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
            console.log(chalk.yellow(`\n🤖 Generating analysis report using ${model}...`));
            
            const completion = await this.openai.chat.completions.create({
                model: model,
                messages: [
                    {
                        role: "system",
                        content: "You are an expert business and technology analyst. Generate comprehensive, accurate, and well-structured service analysis reports in markdown format."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7,
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error(chalk.red('❌ Error generating report:'), error.message);
            if (error.status === 401) {
                console.log(chalk.yellow('Please check your OpenAI API key.'));
            } else if (error.status === 429) {
                console.log(chalk.yellow('Rate limit exceeded. Please try again later.'));
            }
            throw error;
        }
    }

    displayReport(report) {
        console.log(chalk.green('\n✅ Analysis Complete!\n'));
        console.log(chalk.white('📊 SERVICE ANALYSIS REPORT'));
        console.log(chalk.gray('=' .repeat(50)));
        console.log(report);
    }

    saveReport(report, serviceName) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `report_${serviceName.replace(/\s+/g, '_')}_${timestamp}.md`;
        const filepath = path.join(__dirname, 'reports', filename);
        
        // Create reports directory if it doesn't exist
        const reportsDir = path.join(__dirname, 'reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir);
        }

        try {
            fs.writeFileSync(filepath, report);
            console.log(chalk.green(`\n💾 Report saved to: ${filepath}`));
        } catch (error) {
            console.error(chalk.red('❌ Error saving report:'), error.message);
        }
    }

    async run() {
        try {
            this.displayWelcome();
            
            const { input, inputType } = this.getUserInput();
            
            if (!input.trim()) {
                console.log(chalk.red('❌ No input provided. Exiting.'));
                return;
            }

            const prompt = this.generatePrompt(input, inputType);
            const report = await this.generateReport(prompt);
            
            this.displayReport(report);

            // Ask if user wants to save the report
            const saveChoice = readlineSync.question(chalk.cyan('\nWould you like to save this report to a file? (y/n): '));
            if (saveChoice.toLowerCase() === 'y' || saveChoice.toLowerCase() === 'yes') {
                const serviceName = inputType === 'service_name' ? input : 'custom_service';
                this.saveReport(report, serviceName);
            }

        } catch (error) {
            console.error(chalk.red('❌ An error occurred:'), error.message);
            process.exit(1);
        }
    }
}

// Run the application
if (require.main === module) {
    const analyzer = new ServiceAnalyzer();
    analyzer.run();
}

module.exports = ServiceAnalyzer; 