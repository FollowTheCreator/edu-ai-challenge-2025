/**
 * Simple test runner for the JavaScript Validation Library
 */

const { Schema } = require('./index');

// Test utilities
function expectValid(result, expectedValue = undefined) {
  if (!result.valid) {
    throw new Error(`Expected valid result but got errors: ${result.errors.join(', ')}`);
  }
  if (expectedValue !== undefined && result.value !== expectedValue) {
    throw new Error(`Expected value ${expectedValue} but got ${result.value}`);
  }
}

function expectInvalid(result, expectedError = null) {
  if (result.valid) {
    throw new Error('Expected invalid result but got valid');
  }
  if (expectedError && !result.errors.some(error => error.includes(expectedError))) {
    throw new Error(`Expected error containing "${expectedError}" but got: ${result.errors.join(', ')}`);
  }
}

// Test runner
function runTest(testName, testFn) {
  try {
    testFn();
    console.log(`✓ ${testName}`);
    return true;
  } catch (error) {
    console.error(`✗ ${testName}: ${error.message}`);
    return false;
  }
}

// Test suite
function runAllTests() {
  console.log('🧪 JavaScript Validation Library - Test Suite\n');
  let passed = 0;
  let total = 0;

  // String tests
  console.log('=== String Validator Tests ===');
  total++; passed += runTest('String validation - valid strings', () => {
    expectValid(Schema.string().validate('hello'));
    expectValid(Schema.string().validate(''));
  });

  total++; passed += runTest('String validation - invalid types', () => {
    expectInvalid(Schema.string().validate(123), 'must be a string');
    expectInvalid(Schema.string().validate(true), 'must be a string');
  });

  total++; passed += runTest('String length validation', () => {
    expectValid(Schema.string().minLength(3).validate('hello'));
    expectInvalid(Schema.string().minLength(3).validate('hi'), 'at least 3');
    expectValid(Schema.string().maxLength(5).validate('hello'));
    expectInvalid(Schema.string().maxLength(5).validate('toolong'), 'at most 5');
  });

  total++; passed += runTest('String pattern validation', () => {
    const emailValidator = Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expectValid(emailValidator.validate('test@example.com'));
    expectInvalid(emailValidator.validate('invalid-email'), 'does not match');
  });

  // Number tests
  console.log('\n=== Number Validator Tests ===');
  total++; passed += runTest('Number validation - valid numbers', () => {
    expectValid(Schema.number().validate(42));
    expectValid(Schema.number().validate(0));
    expectValid(Schema.number().validate(-5));
    expectValid(Schema.number().validate(3.14));
  });

  total++; passed += runTest('Number validation - invalid types', () => {
    expectInvalid(Schema.number().validate('123'), 'must be a number');
    expectInvalid(Schema.number().validate(NaN), 'must be a number');
  });

  total++; passed += runTest('Number range validation', () => {
    expectValid(Schema.number().min(10).validate(15));
    expectInvalid(Schema.number().min(10).validate(5), 'at least 10');
    expectValid(Schema.number().max(100).validate(50));
    expectInvalid(Schema.number().max(100).validate(150), 'at most 100');
  });

  total++; passed += runTest('Number integer validation', () => {
    expectValid(Schema.number().integer().validate(42));
    expectInvalid(Schema.number().integer().validate(3.14), 'must be an integer');
  });

  total++; passed += runTest('Number positive validation', () => {
    expectValid(Schema.number().positive().validate(1));
    expectInvalid(Schema.number().positive().validate(0), 'must be positive');
  });

  // Boolean tests
  console.log('\n=== Boolean Validator Tests ===');
  total++; passed += runTest('Boolean validation', () => {
    expectValid(Schema.boolean().validate(true));
    expectValid(Schema.boolean().validate(false));
    expectInvalid(Schema.boolean().validate(1), 'must be a boolean');
    expectInvalid(Schema.boolean().validate('true'), 'must be a boolean');
  });

  // Date tests
  console.log('\n=== Date Validator Tests ===');
  total++; passed += runTest('Date validation', () => {
    expectValid(Schema.date().validate(new Date()));
    expectValid(Schema.date().validate('2023-01-01'));
    expectInvalid(Schema.date().validate('invalid-date'), 'valid date');
    expectInvalid(Schema.date().validate({}), 'valid date');
  });

  // Array tests
  console.log('\n=== Array Validator Tests ===');
  total++; passed += runTest('Array validation', () => {
    expectValid(Schema.array().validate([]));
    expectValid(Schema.array().validate([1, 2, 3]));
    expectInvalid(Schema.array().validate('not-array'), 'must be an array');
    expectInvalid(Schema.array().validate({}), 'must be an array');
  });

  total++; passed += runTest('Array length validation', () => {
    expectValid(Schema.array().minLength(2).validate([1, 2]));
    expectInvalid(Schema.array().minLength(2).validate([1]), 'at least 2 items');
    expectValid(Schema.array().maxLength(3).validate([1, 2, 3]));
    expectInvalid(Schema.array().maxLength(3).validate([1, 2, 3, 4]), 'at most 3 items');
  });

  total++; passed += runTest('Array item validation', () => {
    const stringArrayValidator = Schema.array(Schema.string());
    expectValid(stringArrayValidator.validate(['a', 'b', 'c']));
    expectInvalid(stringArrayValidator.validate(['a', 123, 'c']), 'Item at index 1');
  });

  // Object tests
  console.log('\n=== Object Validator Tests ===');
  total++; passed += runTest('Object validation', () => {
    expectValid(Schema.object({}).validate({}));
    expectInvalid(Schema.object({}).validate('not-object'), 'must be an object');
    expectInvalid(Schema.object({}).validate([]), 'must be an object');
    expectInvalid(Schema.object({}).validate(123), 'must be an object');
  });

  total++; passed += runTest('Object property validation', () => {
    const schema = Schema.object({
      name: Schema.string(),
      age: Schema.number()
    });

    expectValid(schema.validate({ name: 'John', age: 30 }));
    expectInvalid(schema.validate({ name: 123, age: 30 }), "Property 'name'");
    expectInvalid(schema.validate({ name: 'John', age: 'thirty' }), "Property 'age'");
  });

  total++; passed += runTest('Optional property validation', () => {
    const schema = Schema.object({
      required: Schema.string(),
      optional: Schema.string().optional()
    });

    expectValid(schema.validate({ required: 'value' }));
    expectValid(schema.validate({ required: 'value', optional: 'optional-value' }));
    expectInvalid(schema.validate({ optional: 'value' }), "Property 'required'");
  });

  // Complex integration test
  console.log('\n=== Complex Integration Tests ===');
  total++; passed += runTest('Complex user schema validation', () => {
    const userSchema = Schema.object({
      name: Schema.string().minLength(2).maxLength(50),
      email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      age: Schema.number().integer().min(13).max(120).optional(),
      tags: Schema.array(Schema.string()).maxLength(5).optional(),
      address: Schema.object({
        street: Schema.string(),
        city: Schema.string(),
        postalCode: Schema.string().pattern(/^\d{5}$/)
      }).optional()
    });

    // Valid user
    expectValid(userSchema.validate({
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
      tags: ['developer', 'javascript'],
      address: {
        street: '123 Main St',
        city: 'Anytown',
        postalCode: '12345'
      }
    }));

    // Invalid user - short name
    expectInvalid(userSchema.validate({
      name: 'J',
      email: 'john@example.com'
    }), "Property 'name'");

    // Invalid user - bad email
    expectInvalid(userSchema.validate({
      name: 'John Doe',
      email: 'invalid-email'
    }), "Property 'email'");
  });

  // Custom validation test
  console.log('\n=== Custom Validation Tests ===');
  total++; passed += runTest('Custom validation functions', () => {
    const evenNumberValidator = Schema.number().custom(value => value % 2 === 0);
    expectValid(evenNumberValidator.validate(4));
    expectInvalid(evenNumberValidator.validate(3), 'Custom validation failed');
  });

  total++; passed += runTest('Custom error messages', () => {
    expectInvalid(
      Schema.string().withMessage('Custom error').validate(123),
      'Custom error'
    );
  });

  // Report results
  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
  console.log(`📈 Success Rate: ${Math.round((passed/total) * 100)}%`);
  
  if (passed === total) {
    console.log('🎉 All tests passed!');
    return true;
  } else {
    console.log(`❌ ${total - passed} tests failed`);
    return false;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const success = runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = { runAllTests }; 