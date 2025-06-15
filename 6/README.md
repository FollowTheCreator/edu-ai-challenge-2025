# Enigma Machine Implementation

A historically accurate implementation of the famous Enigma machine used during World War II, with both critical bugs fixed and comprehensive testing.

## 🔧 Bug Fixes Applied

This implementation fixes two critical bugs found in the original code:

1. **Double-Stepping Mechanism**: Fixed the rotor stepping logic to properly implement the historical double-stepping behavior
2. **Missing Plugboard Application**: Fixed the plugboard to be applied twice (input and output) as in real Enigma machines

See `fix.md` for detailed analysis of the bugs and fixes.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>/6
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the Enigma machine**:
   ```bash
   node enigma.js
   ```

### Usage

When you run the program, you'll be prompted to enter:
- **Message**: The text to encrypt/decrypt
- **Rotor positions**: Three numbers (0-25) for rotor starting positions (e.g., `0 0 0`)
- **Ring settings**: Three numbers (0-25) for ring settings (e.g., `0 0 0`)
- **Plugboard pairs**: Letter pairs for plugboard connections (e.g., `AB CD EF`)

**Example session**:
```
Enter message: HELLO WORLD
Rotor positions (e.g. 0 0 0): 0 0 0
Ring settings (e.g. 0 0 0): 0 0 0
Plugboard pairs (e.g. AB CD): AB CD
Output: ILBDA AMTAZ
```

## 🧪 Testing

### Run all tests:
```bash
npm test
```

### Run tests with coverage:
```bash
npm run test:coverage
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run tests with verbose output:
```bash
npm run test:verbose
```

## 📊 Test Results

The implementation includes **23 comprehensive tests** covering:
- ✅ Helper functions (mod, plugboard)
- ✅ Rotor class functionality
- ✅ Double-stepping mechanism fix
- ✅ Plugboard application fix
- ✅ Integration tests
- ✅ Historical accuracy verification

**Current Coverage**: 77% statements, 69% branches, 68% functions, 75% lines

See `test_report.txt` for detailed coverage analysis.

## 🏗️ Project Structure

```
6/
├── enigma.js           # Main Enigma machine implementation (fixed)
├── enigma.test.js      # Comprehensive test suite
├── fix.md             # Detailed bug analysis and fixes
├── test_report.txt    # Test coverage report
├── package.json       # Dependencies and scripts
├── README.md          # This file
└── .gitignore         # Git ignore rules
```

## 🔐 Features

- **Historically Accurate**: Implements the exact behavior of WWII Enigma machines
- **Three Rotors**: Uses historically accurate rotor wirings (I, II, III)
- **Plugboard Support**: Full plugboard (Steckerbrett) functionality
- **Ring Settings**: Configurable ring settings for added security
- **Double-Stepping**: Correct implementation of the famous double-stepping mechanism
- **Bidirectional**: Same settings encrypt and decrypt messages
- **Non-alphabetic Preservation**: Numbers, spaces, and punctuation pass through unchanged

## 🎯 Key Properties

- No letter ever encrypts to itself (fundamental Enigma property)
- Encryption is reversible with the same settings
- Rotor advancement follows historical stepping patterns
- Plugboard creates bidirectional letter swaps

## 📝 Example Usage (Programmatic)

```javascript
const { Enigma } = require('./enigma.js');

// Create Enigma with rotors I,II,III, positions [0,0,0], rings [0,0,0], plugs A-B
const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B']]);

// Encrypt a message
const encrypted = enigma.process('HELLO');
console.log('Encrypted:', encrypted);

// Decrypt with same settings
const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B']]);
const decrypted = enigma2.process(encrypted);
console.log('Decrypted:', decrypted); // Should be 'HELLO'
```

## 🐛 Bug Fixes Documentation

For detailed information about the bugs that were fixed:
- **Root cause analysis**: See `fix.md`
- **Test verification**: See `test_report.txt`
- **Before/after code**: See `fix.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## 📜 License

MIT License - see LICENSE file for details.

## 🎖️ Historical Note

The Enigma machine was a cipher device used by Nazi Germany during World War II. The breaking of the Enigma code by Allied cryptographers, including Alan Turing at Bletchley Park, significantly contributed to the Allied victory and is considered one of the greatest achievements in cryptographic history.
