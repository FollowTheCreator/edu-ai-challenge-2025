# Audio Transcription Tool

A lightweight console application that transcribes audio files, generates summaries, and extracts meaningful insights using OpenAI's Whisper and GPT models.

## Features

- 🎤 **Audio Transcription**: High-accuracy speech-to-text using OpenAI's Whisper API
- 📝 **Content Summarization**: Intelligent summaries using GPT-4
- 📊 **Analytics & Insights**: 
  - Word count analysis
  - Speaking speed calculation (WPM)
  - Frequently mentioned topics extraction
- 💾 **File Management**: Automatic saving of transcriptions, summaries, and analytics
- 🔒 **Secure**: API keys are never stored in the repository

## Requirements

- Node.js 14.0.0 or higher
- OpenAI API key with access to Whisper and GPT models
- Audio files in supported formats (see below)

## Supported Audio & Video Formats

### Audio Formats
- MP3 (.mp3)
- M4A (.m4a)
- WAV (.wav)
- FLAC (.flac)
- OGG (.ogg)

### Video Formats (audio will be extracted)
- MP4 (.mp4)
- MOV (.mov)
- AVI (.avi)
- MPEG (.mpeg)
- MPGA (.mpga)
- WebM (.webm)

**File Size Limit**: Maximum 25MB per file (OpenAI API limitation)

## Installation

1. **Clone the repository** (or navigate to the project folder):
   ```bash
   cd <folder>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your OpenAI API key**:
   
   **Option A: Environment Variable (Recommended)**
   
   Windows (Command Prompt):
   ```cmd
   set OPENAI_API_KEY=your_api_key_here
   ```
   
   Windows (PowerShell):
   ```powershell
   $env:OPENAI_API_KEY="your_api_key_here"
   ```
   
   macOS/Linux:
   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```
   
   **Option B: Create a .env file (Recommended for development)**
   
   1. **Copy the example file:**
      ```bash
      # Windows/PowerShell:
      Copy-Item env.example .env
      
      # macOS/Linux:
      cp env.example .env
      ```
   
   2. **Edit the .env file:**
      Open `.env` in any text editor and replace `your_openai_api_key_here` with your actual API key:
      ```
      OPENAI_API_KEY=sk-your-actual-openai-api-key-here
      ```
      
   3. **Save the file** - The application will automatically load it!

4. **Set up Organization ID (Optional)**:
   
   Only needed if your account belongs to multiple OpenAI organizations:
   
   Windows (PowerShell):
   ```powershell
   $env:OPENAI_ORGANIZATION="your_organization_id_here"
   ```
   
   macOS/Linux:
   ```bash
   export OPENAI_ORGANIZATION=your_organization_id_here
   ```
   
   Or add to your .env file:
   ```
   OPENAI_ORGANIZATION=your_organization_id_here
   ```

5. **Configure OpenAI Model (Optional)**:
   
   By default, the application uses `gpt-4.1-mini`. You can change this:
   
   Windows (PowerShell):
   ```powershell
   $env:OPENAI_MODEL="gpt-4o"
   ```
   
   macOS/Linux:
   ```bash
   export OPENAI_MODEL=gpt-4o
   ```
   
   Or add to your .env file:
   ```
   OPENAI_MODEL=gpt-4o
   ```
   
   **Available models**: gpt-4.1-mini, gpt-4o, gpt-4o-mini (depends on your API access)

## Usage

### Basic Usage

Process any audio file:
```bash
node index.js path/to/your/audio.mp3
```

### Test with Provided Sample

Run the application with the provided sample audio:
```bash
npm test
# or
npm run test
# or
node index.js files/CAR0004.mp3
```

### Examples

```bash
# Process different audio formats
node index.js files/recording.wav
node index.js files/podcast.m4a
node index.js files/interview.mp3

# Process video files (audio will be extracted)
node index.js files/video.mov
node index.js files/presentation.mp4

# Process the provided sample file
node index.js files/CAR0004.mp3

# Using npm scripts
npm start files/audio.mp3
```

## Output Files

The application creates an organized directory structure for each processing session:

```
outputs/
├── 2024-01-15/                    # Date-based organization
│   ├── 2024-01-15_14-30-25/       # Session folder (date + time)
│   │   ├── transcription.md       # Complete transcription text
│   │   ├── summary.md             # AI-generated summary
│   │   ├── analysis.json          # Analytics data
│   │   └── session_info.json      # Session metadata
│   └── 2024-01-15_16-45-10/       # Another session from same day
│       ├── transcription.md
│       ├── summary.md
│       ├── analysis.json
│       └── session_info.json
└── 2024-01-16/                    # Next day
    └── 2024-01-16_09-15-30/
        ├── transcription.md
        ├── summary.md
        ├── analysis.json
        └── session_info.json
```

### File Contents

Each session generates four files:

1. **transcription.md** - Complete transcription of the audio
2. **summary.md** - AI-generated summary of the content  
3. **analysis.json** - Analytics data including word count, WPM, and topics
4. **session_info.json** - Session metadata including timestamp, input file info, language, and performance metrics

### Sample Analysis Output

```json
{
  "word_count": 1280,
  "speaking_speed_wpm": 132,
  "frequently_mentioned_topics": [
    { "topic": "Customer Onboarding", "mentions": 6 },
    { "topic": "Q4 Roadmap", "mentions": 4 },
    { "topic": "AI Integration", "mentions": 3 }
  ]
}
```

## Console Output

The application provides real-time feedback and displays results directly in the console:

```
🚀 Starting audio processing: files/CAR0004.mp3
──────────────────────────────────────────────────
🎤 Transcribing audio with OpenAI Whisper...
✅ Transcription completed! (Language: en)
📝 Generating summary with GPT...
✅ Summary generated!
📊 Analyzing transcription for insights...
✅ Analysis completed!

📁 Creating output directory...
📂 Output directory: outputs/2024-01-15/2024-01-15_10-30-45

💾 Saving files...
💾 Saved text to: outputs/2024-01-15/2024-01-15_10-30-45/transcription.md
💾 Saved text to: outputs/2024-01-15/2024-01-15_10-30-45/summary.md
💾 Saved analysis to: outputs/2024-01-15/2024-01-15_10-30-45/analysis.json
💾 Saved analysis to: outputs/2024-01-15/2024-01-15_10-30-45/session_info.json

==================================================
📊 ANALYSIS RESULTS
==================================================
📝 Word Count: 1280
🗣️ Speaking Speed: 132 WPM
⏱️ Duration: 582 seconds (9.7 minutes)

🏷️ Frequently Mentioned Topics:
   1. Customer Onboarding (6 mentions)
   2. Q4 Roadmap (4 mentions)
   3. AI Integration (3 mentions)

==================================================
📄 SUMMARY
==================================================
[AI-generated summary appears here...]

==================================================
✅ PROCESSING COMPLETE
==================================================
📂 Output directory: outputs/2024-01-15/2024-01-15_10-30-45
Files saved:
  📝 Transcription: transcription.md
  📄 Summary: summary.md
  📊 Analysis: analysis.json
  ℹ️  Session Info: session_info.json
```

## Troubleshooting

### Common Issues

**1. "OPENAI_API_KEY environment variable is required"**
- **If using .env file:** Ensure you have created a `.env` file in the project root
- **Check .env file contents:** Open `.env` and verify it contains `OPENAI_API_KEY=your_actual_key`
- **No spaces:** Ensure there are no spaces around the `=` sign in your `.env` file
- **File location:** The `.env` file must be in the same directory as `index.js`
- **Alternative:** Set the environment variable directly as described in the installation section
- Verify the key is correct and has appropriate permissions

**2. "Audio file not found"**
- Check the file path is correct
- Ensure the file exists and is accessible

**3. "Unsupported audio format"**
- Convert your audio to a supported format (MP3, WAV, M4A, etc.)
- Use tools like FFmpeg for audio conversion

**4. "Audio file is too large"**
- The file exceeds OpenAI's 25MB limit
- Consider compressing the audio or splitting it into smaller segments

**5. Network/API Issues**
- Check your internet connection
- Verify your OpenAI API key has sufficient credits
- Try again after a few minutes if there are temporary API issues

**6. "OpenAI-Organization header should match organization for API key"**
- This occurs when using OPENAI_ORGANIZATION with the wrong organization ID
- Remove OPENAI_ORGANIZATION if you only belong to one organization
- Verify the organization ID matches your API key's organization
- Most users don't need to set OPENAI_ORGANIZATION at all

### Getting Your OpenAI API Key

1. Visit [OpenAI's website](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to the API section
4. Create a new API key
5. Copy the key and use it as described in the installation section

**Important**: Keep your API key secure and never commit it to version control!

## Performance Considerations

- The application makes sequential API calls to optimize usage and prevent rate limiting
- Transcription time depends on audio length and OpenAI API response times
- Large files will take longer to process due to file upload and processing time
- The tool is designed to prevent excessive API usage and costs

## Project Structure

```
├── index.js                    # Main application file
├── package.json               # Node.js dependencies and scripts
├── README.md                  # This documentation
├── .gitignore                # Git ignore rules
├── env.example               # Environment variables template
├── files/                    # Audio files directory
│   ├── CAR0004.mp3          # Sample audio file
│   └── [other audio files]  # Additional audio files
└── outputs/                   # Generated output files (organized by date/session)
    ├── 2024-01-15/
    │   ├── 2024-01-15_14-30-25/
    │   │   ├── transcription.md
    │   │   ├── summary.md
    │   │   ├── analysis.json
    │   │   └── session_info.json
    │   └── [other sessions...]
    └── [other dates...]
```

## Technology Stack

- **Node.js**: Runtime environment
- **OpenAI API**: Whisper (speech-to-text) and GPT-4 (summarization & analysis)
- **Native Node.js modules**: File system operations, path handling

## License

MIT License - Feel free to use this tool for personal and commercial projects.

## Contributing

This is a lightweight tool designed for educational and practical use. Feel free to extend its functionality or adapt it to your specific needs.

---

**Note**: This tool requires an active OpenAI API key and will incur usage costs based on OpenAI's pricing. Monitor your usage to avoid unexpected charges. 