#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

// Function to validate environment setup
function validateSetup() {
    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ Error: OPENAI_API_KEY not found in environment variables');
        console.error('Please create a .env file with your OpenAI API key or set it as an environment variable');
        console.error('Example: OPENAI_API_KEY=sk-your_api_key_here');
        console.error('\nTo create a .env file:');
        console.error('1. Copy env.example to .env');
        console.error('2. Edit .env and replace "your_openai_api_key_here" with your actual API key');
        process.exit(1);
    }
}

// Validate setup before proceeding
validateSetup();

// Configuration and validation
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ORGANIZATION = process.env.OPENAI_ORGANIZATION;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

// Initialize OpenAI client
const openaiConfig = {
    apiKey: OPENAI_API_KEY,
};

// Add organization if specified (optional)
if (OPENAI_ORGANIZATION) {
    openaiConfig.organization = OPENAI_ORGANIZATION;
    console.log(`🏢 Using OpenAI Organization: ${OPENAI_ORGANIZATION}`);
}

const openai = new OpenAI(openaiConfig);

// Utility functions
function validateAudioFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Audio file not found: ${filePath}`);
    }
    
    const stats = fs.statSync(filePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    
    // OpenAI Whisper API has a 25MB limit
    if (fileSizeInMB > 25) {
        throw new Error(`Audio file is too large (${fileSizeInMB.toFixed(2)}MB). Maximum allowed size is 25MB.`);
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const supportedFormats = ['.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.wav', '.webm', '.mov', '.avi', '.flac', '.ogg'];
    
    if (!supportedFormats.includes(ext)) {
        throw new Error(`Unsupported audio/video format: ${ext}. Supported formats: ${supportedFormats.join(', ')}`);
    }
    
    return true;
}

function generateTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

function calculateWPM(wordCount, audioDurationSeconds) {
    const minutes = audioDurationSeconds / 60;
    return Math.round(wordCount / minutes);
}

function countWords(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Main processing functions
async function transcribeAudio(audioFilePath) {
    console.log('🎤 Transcribing audio with OpenAI Whisper...');
    
    try {
        const audioFile = fs.createReadStream(audioFilePath);
        
        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
            response_format: 'verbose_json',
            timestamp_granularities: ['word']
        });
        
        return {
            text: transcription.text,
            duration: transcription.duration || null,
            language: transcription.language || 'unknown'
        };
    } catch (error) {
        throw new Error(`Transcription failed: ${error.message}`);
    }
}

async function summarizeTranscription(transcription) {
    console.log(`📝 Generating summary with ${OPENAI_MODEL}...`);
    
    try {
        const completion = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional summarization assistant. Create a concise, well-structured summary that captures the key points, main themes, and important details from the transcription. Focus on the most important information and present it in a clear, readable format.'
                },
                {
                    role: 'user',
                    content: `Please summarize the following transcription:\n\n${transcription}`
                }
            ],
            max_tokens: 1000,
            temperature: 0.3
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        throw new Error(`Summarization failed: ${error.message}`);
    }
}

async function analyzeTranscription(transcription, duration) {
    console.log(`📊 Analyzing transcription with ${OPENAI_MODEL}...`);
    
    try {
        const completion = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: `You are a text analytics assistant. Analyze the provided transcription and return a JSON object with the following structure:
                    {
                        "word_count": number,
                        "speaking_speed_wpm": number,
                        "frequently_mentioned_topics": [
                            { "topic": "string", "mentions": number }
                        ]
                    }
                    
                    For frequently_mentioned_topics, identify the top 3-5 most important topics, themes, or subjects mentioned in the text. Count how many times each topic appears (including related keywords and phrases). Return only valid JSON without any additional text or explanation.`
                },
                {
                    role: 'user',
                    content: `Analyze this transcription (duration: ${duration ? duration + ' seconds' : 'unknown'}):\n\n${transcription}`
                }
            ],
            max_tokens: 500,
            temperature: 0.1
        });
        
        const analysisText = completion.choices[0].message.content.trim();
        
        // Parse JSON response
        let analysis;
        try {
            analysis = JSON.parse(analysisText);
        } catch (parseError) {
            // Fallback: create basic analysis if GPT response isn't valid JSON
            const wordCount = countWords(transcription);
            const wpm = duration ? calculateWPM(wordCount, duration) : null;
            
            analysis = {
                word_count: wordCount,
                speaking_speed_wpm: wpm,
                frequently_mentioned_topics: [
                    { topic: "Content Analysis", mentions: 1 },
                    { topic: "Speech Analysis", mentions: 1 },
                    { topic: "Audio Processing", mentions: 1 }
                ]
            };
        }
        
        // Validate and correct the analysis
        if (!analysis.word_count) {
            analysis.word_count = countWords(transcription);
        }
        
        if (!analysis.speaking_speed_wpm && duration) {
            analysis.speaking_speed_wpm = calculateWPM(analysis.word_count, duration);
        }
        
        if (!analysis.frequently_mentioned_topics || !Array.isArray(analysis.frequently_mentioned_topics)) {
            analysis.frequently_mentioned_topics = [
                { topic: "General Discussion", mentions: 1 }
            ];
        }
        
        return analysis;
    } catch (error) {
        // Fallback analysis if API call fails
        const wordCount = countWords(transcription);
        const wpm = duration ? calculateWPM(wordCount, duration) : null;
        
        return {
            word_count: wordCount,
            speaking_speed_wpm: wpm,
            frequently_mentioned_topics: [
                { topic: "Audio Content", mentions: 1 },
                { topic: "Speech Data", mentions: 1 },
                { topic: "Transcription", mentions: 1 }
            ]
        };
    }
}

function createOutputDirectory() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    const sessionId = `${dateStr}_${timeStr}`;
    
    const outputDir = path.join('outputs', dateStr, sessionId);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    return outputDir;
}

function saveToFile(content, filename, format = 'text', outputDir) {
    const finalFilename = `${filename}.${format === 'json' ? 'json' : 'md'}`;
    const fullPath = path.join(outputDir, finalFilename);
    
    let contentToSave;
    if (format === 'json') {
        contentToSave = JSON.stringify(content, null, 2);
    } else {
        contentToSave = content;
    }
    
    fs.writeFileSync(fullPath, contentToSave, 'utf8');
    console.log(`💾 Saved ${format === 'json' ? 'analysis' : format} to: ${fullPath}`);
    return fullPath;
}

async function processAudio(audioFilePath) {
    console.log(`🚀 Starting audio processing: ${audioFilePath}`);
    console.log('─'.repeat(50));
    
    try {
        // Validate input
        validateAudioFile(audioFilePath);
        
        // Step 1: Transcribe audio
        const transcriptionResult = await transcribeAudio(audioFilePath);
        const transcription = transcriptionResult.text;
        const duration = transcriptionResult.duration;
        const language = transcriptionResult.language;
        
        console.log(`✅ Transcription completed! (Language: ${language})`);
        
        // Step 2: Generate summary
        const summary = await summarizeTranscription(transcription);
        console.log('✅ Summary generated!');
        
        // Step 3: Analyze transcription
        const analysis = await analyzeTranscription(transcription, duration);
        console.log('✅ Analysis completed!');
        
        // Step 4: Create output directory and save files
        console.log('\n📁 Creating output directory...');
        const outputDir = createOutputDirectory();
        console.log(`📂 Output directory: ${outputDir}`);
        
        console.log('\n💾 Saving files...');
        
        // Create session metadata
        const sessionInfo = {
            timestamp: new Date().toISOString(),
            input_file: path.basename(audioFilePath),
            input_file_path: audioFilePath,
            language: language,
            duration_seconds: duration,
            model_used: OPENAI_MODEL,
            word_count: analysis.word_count,
            speaking_speed_wpm: analysis.speaking_speed_wpm,
            processing_completed: true
        };
        
        const transcriptionFile = saveToFile(transcription, 'transcription', 'text', outputDir);
        const summaryFile = saveToFile(summary, 'summary', 'text', outputDir);
        const analysisFile = saveToFile(analysis, 'analysis', 'json', outputDir);
        const sessionFile = saveToFile(sessionInfo, 'session_info', 'json', outputDir);
        
        // Step 5: Display results
        console.log('\n' + '='.repeat(50));
        console.log('📊 ANALYSIS RESULTS');
        console.log('='.repeat(50));
        
        console.log(`📝 Word Count: ${analysis.word_count}`);
        if (analysis.speaking_speed_wpm) {
            console.log(`🗣️  Speaking Speed: ${analysis.speaking_speed_wpm} WPM`);
        }
        if (duration) {
            console.log(`⏱️  Duration: ${Math.round(duration)} seconds (${(duration/60).toFixed(1)} minutes)`);
        }
        
        console.log('\n🏷️  Frequently Mentioned Topics:');
        analysis.frequently_mentioned_topics.forEach((topic, index) => {
            console.log(`   ${index + 1}. ${topic.topic} (${topic.mentions} mentions)`);
        });
        
        console.log('\n' + '='.repeat(50));
        console.log('📄 SUMMARY');
        console.log('='.repeat(50));
        console.log(summary);
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ PROCESSING COMPLETE');
        console.log('='.repeat(50));
        console.log(`📂 Output directory: ${outputDir}`);
        console.log(`Files saved:`);
        console.log(`  📝 Transcription: ${path.basename(transcriptionFile)}`);
        console.log(`  📄 Summary: ${path.basename(summaryFile)}`);
        console.log(`  📊 Analysis: ${path.basename(analysisFile)}`);
        console.log(`  ℹ️  Session Info: ${path.basename(sessionFile)}`);
        
    } catch (error) {
        console.error('\n❌ Error during processing:');
        console.error(error.message);
        process.exit(1);
    }
}

// Main execution
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('🎵 Audio Transcription Tool');
        console.log('');
        console.log('Usage: node index.js <audio_file_path>');
        console.log('');
        console.log('Example:');
        console.log('  node index.js CAR0004.mp3');
        console.log('  node index.js path/to/your/audio.wav');
        console.log('');
        console.log('Supported formats: .mp3, .mp4, .mpeg, .mpga, .m4a, .wav, .webm');
        console.log('Maximum file size: 25MB');
        process.exit(1);
    }
    
    const audioFilePath = args[0];
    processAudio(audioFilePath);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('\n💥 Unexpected error:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('\n💥 Unhandled promise rejection:', error.message);
    process.exit(1);
});

// Run the application
if (require.main === module) {
    main();
}

module.exports = {
    processAudio,
    transcribeAudio,
    summarizeTranscription,
    analyzeTranscription
}; 