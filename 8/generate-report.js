/**
 * Generate a clean test report without Unicode characters
 */

const { runAllTests } = require('./test/validation.test.js');

// Override console.log to capture output without Unicode issues
const originalLog = console.log;
const originalError = console.error;
let output = [];

console.log = (...args) => {
  const message = args.join(' ')
    .replace(/🧪/g, '[TEST]')
    .replace(/✓/g, '[PASS]')
    .replace(/✗/g, '[FAIL]')
    .replace(/📊/g, '[STATS]')
    .replace(/📈/g, '[RATE]')
    .replace(/🎉/g, '[SUCCESS]')
    .replace(/❌/g, '[ERROR]')
    .replace(/тЬУ/g, '[PASS]')
    .replace(/тЬЧ/g, '[FAIL]')
    .replace(/ЁЯУК/g, '[STATS]')
    .replace(/ЁЯУИ/g, '[RATE]')
    .replace(/ЁЯОЙ/g, '[SUCCESS]')
    .replace(/тЭМ/g, '[ERROR]');
  
  output.push(message);
  originalLog(message);
};

console.error = (...args) => {
  const message = args.join(' ')
    .replace(/🧪/g, '[TEST]')
    .replace(/✓/g, '[PASS]')
    .replace(/✗/g, '[FAIL]')
    .replace(/📊/g, '[STATS]')
    .replace(/📈/g, '[RATE]')
    .replace(/🎉/g, '[SUCCESS]')
    .replace(/❌/g, '[ERROR]')
    .replace(/тЬУ/g, '[PASS]')
    .replace(/тЬЧ/g, '[FAIL]')
    .replace(/ЁЯУК/g, '[STATS]')
    .replace(/ЁЯУИ/g, '[RATE]')
    .replace(/ЁЯОЙ/g, '[SUCCESS]')
    .replace(/тЭМ/g, '[ERROR]');
  
  output.push(message);
  originalError(message);
};

// Run tests
console.log('JavaScript Validation Library - Test Coverage Report');
console.log('====================================================');
console.log('Generated on: ' + new Date().toISOString());
console.log('Node.js Version: ' + process.version);
console.log('Platform: ' + process.platform);
console.log('');

const success = runAllTests();

// Add summary
console.log('');
console.log('====================================================');
console.log('Test Coverage Summary:');
console.log('- All validator types: String, Number, Boolean, Date, Array, Object');
console.log('- Edge cases and error conditions');
console.log('- Custom validation functions');
console.log('- Nested object validation');
console.log('- Optional field handling');
console.log('- Pattern matching and constraints');
console.log('- Complex integration scenarios');
console.log('');
console.log('Library Status: ' + (success ? 'PRODUCTION READY' : 'NEEDS FIXES'));
console.log('====================================================');

// Restore original console functions
console.log = originalLog;
console.error = originalError; 