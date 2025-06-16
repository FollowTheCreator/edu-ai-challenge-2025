/**
 * Comprehensive test suite for the JavaScript Validation Library
 */

const { Schema } = require('../index');

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

// String Validator Tests
function testStringValidator() {
  console.log('\n=== String Validator Tests ===');
  let passed = 0;
  let total = 0;

  // Basic string validation
  total++;
  passed += runTest('should validate valid strings', () => {
    expectValid(Schema.string().validate('hello'));
    expectValid(Schema.string().validate(''));
    expectValid(Schema.string().validate('123'));
  });

  total++;
  passed += runTest('should reject non-strings', () => {
    expectInvalid(Schema.string().validate(123), 'must be a string');
    expectInvalid(Schema.string().validate(true), 'must be a string');
    expectInvalid(Schema.string().validate({}), 'must be a string');
    expectInvalid(Schema.string().validate([]), 'must be a string');
  });

  // Length validation
  total++;
  passed += runTest('should validate minimum length', () => {
    expectValid(Schema.string().minLength(3).validate('hello'));
    expectValid(Schema.string().minLength(3).validate('abc'));
    expectInvalid(Schema.string().minLength(3).validate('ab'), 'at least 3');
  });

  total++;
  passed += runTest('should validate maximum length', () => {
    expectValid(Schema.string().maxLength(5).validate('hello'));
    expectValid(Schema.string().maxLength(5).validate('hi'));
    expectInvalid(Schema.string().maxLength(5).validate('toolong'), 'at most 5');
  });

  total++;
  passed += runTest('should validate length range', () => {
    const validator = Schema.string().minLength(2).maxLength(5);
    expectValid(validator.validate('hi'));
    expectValid(validator.validate('hello'));
    expectInvalid(validator.validate('a'), 'at least 2');
    expectInvalid(validator.validate('toolong'), 'at most 5');
  });

  // Pattern validation
  total++;
  passed += runTest('should validate email pattern', () => {
    const emailValidator = Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expectValid(emailValidator.validate('test@example.com'));
    expectValid(emailValidator.validate('user+tag@domain.co.uk'));
    expectInvalid(emailValidator.validate('invalid-email'), 'does not match');
    expectInvalid(emailValidator.validate('missing@'), 'does not match');
  });

  total++;
  passed += runTest('should validate postal code pattern', () => {
    const postalValidator = Schema.string().pattern(/^\d{5}$/);
    expectValid(postalValidator.validate('12345'));
    expectInvalid(postalValidator.validate('1234'), 'does not match');
    expectInvalid(postalValidator.validate('123456'), 'does not match');
    expectInvalid(postalValidator.validate('abcde'), 'does not match');
  });

  // Empty string validation
  total++;
  passed += runTest('should handle empty strings', () => {
    expectValid(Schema.string().validate(''));
    expectInvalid(Schema.string().notEmpty().validate(''), 'cannot be empty');
  });

  // Optional validation
  total++;
  passed += runTest('should handle optional strings', () => {
    expectValid(Schema.string().optional().validate(null));
    expectValid(Schema.string().optional().validate(undefined));
    expectInvalid(Schema.string().validate(null), 'required');
  });

  // Custom messages
  total++;
  passed += runTest('should use custom error messages', () => {
    expectInvalid(
      Schema.string().withMessage('Custom error').validate(123),
      'Custom error'
    );
  });

  return { passed, total };
}

// Number Validator Tests
function testNumberValidator() {
  console.log('\n=== Number Validator Tests ===');
  let passed = 0;
  let total = 0;

  // Basic number validation
  total++;
  passed += runTest('should validate valid numbers', () => {
    expectValid(Schema.number().validate(42));
    expectValid(Schema.number().validate(0));
    expectValid(Schema.number().validate(-5));
    expectValid(Schema.number().validate(3.14));
  });

  total++;
  passed += runTest('should reject non-numbers', () => {
    expectInvalid(Schema.number().validate('123'), 'must be a number');
    expectInvalid(Schema.number().validate(true), 'must be a number');
    expectInvalid(Schema.number().validate({}), 'must be a number');
    expectInvalid(Schema.number().validate(NaN), 'must be a number');
  });

  // Range validation
  total++;
  passed += runTest('should validate minimum value', () => {
    expectValid(Schema.number().min(10).validate(15));
    expectValid(Schema.number().min(10).validate(10));
    expectInvalid(Schema.number().min(10).validate(5), 'at least 10');
  });

  total++;
  passed += runTest('should validate maximum value', () => {
    expectValid(Schema.number().max(100).validate(50));
    expectValid(Schema.number().max(100).validate(100));
    expectInvalid(Schema.number().max(100).validate(150), 'at most 100');
  });

  total++;
  passed += runTest('should validate number range', () => {
    const validator = Schema.number().min(0).max(100);
    expectValid(validator.validate(50));
    expectValid(validator.validate(0));
    expectValid(validator.validate(100));
    expectInvalid(validator.validate(-1), 'at least 0');
    expectInvalid(validator.validate(101), 'at most 100');
  });

  // Integer validation
  total++;
  passed += runTest('should validate integers', () => {
    expectValid(Schema.number().integer().validate(42));
    expectValid(Schema.number().integer().validate(0));
    expectValid(Schema.number().integer().validate(-5));
    expectInvalid(Schema.number().integer().validate(3.14), 'must be an integer');
  });

  // Positive validation
  total++;
  passed += runTest('should validate positive numbers', () => {
    expectValid(Schema.number().positive().validate(1));
    expectValid(Schema.number().positive().validate(0.1));
    expectInvalid(Schema.number().positive().validate(0), 'must be positive');
    expectInvalid(Schema.number().positive().validate(-1), 'must be positive');
  });

  // Combined validations
  total++;
  passed += runTest('should combine multiple validations', () => {
    const validator = Schema.number().integer().positive().min(1).max(100);
    expectValid(validator.validate(50));
    expectInvalid(validator.validate(0), 'must be positive');
    expectInvalid(validator.validate(3.14), 'must be an integer');
    expectInvalid(validator.validate(150), 'at most 100');
  });

  return { passed, total };
}

// Boolean Validator Tests
function testBooleanValidator() {
  console.log('\n=== Boolean Validator Tests ===');
  let passed = 0;
  let total = 0;

  total++;
  passed += runTest('should validate valid booleans', () => {
    expectValid(Schema.boolean().validate(true));
    expectValid(Schema.boolean().validate(false));
  });

  total++;
  passed += runTest('should reject non-booleans', () => {
    expectInvalid(Schema.boolean().validate(1), 'must be a boolean');
    expectInvalid(Schema.boolean().validate(0), 'must be a boolean');
    expectInvalid(Schema.boolean().validate('true'), 'must be a boolean');
    expectInvalid(Schema.boolean().validate('false'), 'must be a boolean');
  });

  return { passed, total };
}

// Date Validator Tests
function testDateValidator() {
  console.log('\n=== Date Validator Tests ===');
  let passed = 0;
  let total = 0;

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  total++;
  passed += runTest('should validate valid dates', () => {
    expectValid(Schema.date().validate(now));
    expectValid(Schema.date().validate(new Date('2023-01-01')));
  });

  total++;
  passed += runTest('should parse string dates', () => {
    const result = Schema.date().validate('2023-01-01');
    expectValid(result);
    if (!(result.value instanceof Date)) {
      throw new Error('Expected Date object');
    }
  });

  total++;
  passed += runTest('should parse timestamp dates', () => {
    const result = Schema.date().validate(1672531200000); // 2023-01-01
    expectValid(result);
    if (!(result.value instanceof Date)) {
      throw new Error('Expected Date object');
    }
  });

  total++;
  passed += runTest('should reject invalid dates', () => {
    expectInvalid(Schema.date().validate('invalid-date'), 'valid date');
    expectInvalid(Schema.date().validate({}), 'valid date');
    expectInvalid(Schema.date().validate(''), 'valid date');
  });

  total++;
  passed += runTest('should validate minimum date', () => {
    expectValid(Schema.date().min(yesterday).validate(now));
    expectValid(Schema.date().min(yesterday).validate(tomorrow));
    expectInvalid(Schema.date().min(now).validate(yesterday), 'must be after');
  });

  total++;
  passed += runTest('should validate maximum date', () => {
    expectValid(Schema.date().max(tomorrow).validate(now));
    expectValid(Schema.date().max(tomorrow).validate(yesterday));
    expectInvalid(Schema.date().max(now).validate(tomorrow), 'must be before');
  });

  return { passed, total };
}

// Array Validator Tests
function testArrayValidator() {
  console.log('\n=== Array Validator Tests ===');
  let passed = 0;
  let total = 0;

  total++;
  passed += runTest('should validate valid arrays', () => {
    expectValid(Schema.array().validate([]));
    expectValid(Schema.array().validate([1, 2, 3]));
    expectValid(Schema.array().validate(['a', 'b', 'c']));
  });

  total++;
  passed += runTest('should reject non-arrays', () => {
    expectInvalid(Schema.array().validate('not-array'), 'must be an array');
    expectInvalid(Schema.array().validate({}), 'must be an array');
    expectInvalid(Schema.array().validate(123), 'must be an array');
  });

  total++;
  passed += runTest('should validate array length', () => {
    expectValid(Schema.array().minLength(2).validate([1, 2]));
    expectValid(Schema.array().minLength(2).validate([1, 2, 3]));
    expectInvalid(Schema.array().minLength(2).validate([1]), 'at least 2 items');

    expectValid(Schema.array().maxLength(3).validate([1, 2]));
    expectValid(Schema.array().maxLength(3).validate([1, 2, 3]));
    expectInvalid(Schema.array().maxLength(3).validate([1, 2, 3, 4]), 'at most 3 items');
  });

  total++;
  passed += runTest('should validate array items', () => {
    const stringArrayValidator = Schema.array(Schema.string());
    expectValid(stringArrayValidator.validate(['a', 'b', 'c']));
    expectInvalid(stringArrayValidator.validate(['a', 123, 'c']), 'Item at index 1');

    const numberArrayValidator = Schema.array(Schema.number().positive());
    expectValid(numberArrayValidator.validate([1, 2, 3]));
    expectInvalid(numberArrayValidator.validate([1, -2, 3]), 'Item at index 1');
  });

  total++;
  passed += runTest('should validate nested arrays', () => {
    const nestedValidator = Schema.array(Schema.array(Schema.string()));
    expectValid(nestedValidator.validate([['a', 'b'], ['c', 'd']]));
    expectInvalid(nestedValidator.validate([['a', 'b'], [1, 2]]), 'Item at index 1');
  });

  return { passed, total };
}

// Object Validator Tests
function testObjectValidator() {
  console.log('\n=== Object Validator Tests ===');
  let passed = 0;
  let total = 0;

  total++;
  passed += runTest('should validate valid objects', () => {
    expectValid(Schema.object({}).validate({}));
    expectValid(Schema.object({}).validate({ any: 'property' }));
  });

  total++;
  passed += runTest('should reject non-objects', () => {
    expectInvalid(Schema.object({}).validate('not-object'), 'must be an object');
    expectInvalid(Schema.object({}).validate([]), 'must be an object');
    expectInvalid(Schema.object({}).validate(null), 'required'); // null triggers required check
    expectInvalid(Schema.object({}).validate(123), 'must be an object');
  });

  total++;
  passed += runTest('should validate object properties', () => {
    const schema = Schema.object({
      name: Schema.string(),
      age: Schema.number(),
      active: Schema.boolean()
    });

    expectValid(schema.validate({
      name: 'John',
      age: 30,
      active: true
    }));

    expectInvalid(schema.validate({
      name: 123,
      age: 30,
      active: true
    }), "Property 'name'");

    expectInvalid(schema.validate({
      name: 'John',
      age: 'thirty',
      active: true
    }), "Property 'age'");
  });

  total++;
  passed += runTest('should handle optional properties', () => {
    const schema = Schema.object({
      required: Schema.string(),
      optional: Schema.string().optional()
    });

    expectValid(schema.validate({ required: 'value' }));
    expectValid(schema.validate({ required: 'value', optional: 'optional-value' }));
    expectInvalid(schema.validate({ optional: 'value' }), "Property 'required'");
  });

  total++;
  passed += runTest('should handle unknown properties', () => {
    const schema = Schema.object({
      known: Schema.string()
    });

    // By default, unknown properties are allowed
    expectValid(schema.validate({
      known: 'value',
      unknown: 'property'
    }));

    // Use strict() to disallow unknown properties
    expectInvalid(schema.strict().validate({
      known: 'value',
      unknown: 'property'
    }), 'Unknown properties');

    // Explicitly allow unknown properties again
    expectValid(schema.unknown().validate({
      known: 'value',
      unknown: 'property'
    }));
  });

  total++;
  passed += runTest('should validate nested objects', () => {
    const addressSchema = Schema.object({
      street: Schema.string(),
      city: Schema.string(),
      postalCode: Schema.string().pattern(/^\d{5}$/)
    });

    const userSchema = Schema.object({
      name: Schema.string(),
      address: addressSchema
    });

    expectValid(userSchema.validate({
      name: 'John',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        postalCode: '12345'
      }
    }));

    expectInvalid(userSchema.validate({
      name: 'John',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        postalCode: '1234'
      }
    }), "Property 'address'");
  });

  return { passed, total };
}

// Complex Integration Tests
function testComplexScenarios() {
  console.log('\n=== Complex Integration Tests ===');
  let passed = 0;
  let total = 0;

  total++;
  passed += runTest('should validate user registration schema', () => {
    const userRegistrationSchema = Schema.object({
      username: Schema.string().minLength(3).maxLength(20).pattern(/^[a-zA-Z0-9_]+$/),
      email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      password: Schema.string().minLength(8),
      age: Schema.number().integer().min(13).max(120).optional(),
      tags: Schema.array(Schema.string()).maxLength(5).optional(),
      preferences: Schema.object({
        newsletter: Schema.boolean(),
        notifications: Schema.boolean().optional()
      }).optional()
    });

    // Valid registration
    expectValid(userRegistrationSchema.validate({
      username: 'john_doe123',
      email: 'john@example.com',
      password: 'securepassword',
      age: 25,
      tags: ['developer', 'javascript'],
      preferences: {
        newsletter: true,
        notifications: false
      }
    }));

    // Invalid username
    expectInvalid(userRegistrationSchema.validate({
      username: 'jo',
      email: 'john@example.com',
      password: 'securepassword'
    }), "Property 'username'");

    // Invalid email
    expectInvalid(userRegistrationSchema.validate({
      username: 'john_doe',
      email: 'invalid-email',
      password: 'securepassword'
    }), "Property 'email'");
  });

  total++;
  passed += runTest('should validate API response schema', () => {
    const apiResponseSchema = Schema.object({
      success: Schema.boolean(),
      data: Schema.object({
        users: Schema.array(Schema.object({
          id: Schema.string(),
          name: Schema.string().minLength(1),
          email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
          createdAt: Schema.date()
        })),
        total: Schema.number().integer().min(0),
        page: Schema.number().integer().min(1)
      }).optional(),
      error: Schema.string().optional()
    });

    // Successful response
    expectValid(apiResponseSchema.validate({
      success: true,
      data: {
        users: [
          {
            id: '123',
            name: 'John Doe',
            email: 'john@example.com',
            createdAt: new Date()
          }
        ],
        total: 1,
        page: 1
      }
    }));

    // Error response
    expectValid(apiResponseSchema.validate({
      success: false,
      error: 'Something went wrong'
    }));
  });

  return { passed, total };
}

// Custom Validator Tests
function testCustomValidators() {
  console.log('\n=== Custom Validator Tests ===');
  let passed = 0;
  let total = 0;

  total++;
  passed += runTest('should use custom validation functions', () => {
    const evenNumberValidator = Schema.number().custom(value => value % 2 === 0);
    expectValid(evenNumberValidator.validate(4));
    expectInvalid(evenNumberValidator.validate(3), 'Custom validation failed');
  });

  total++;
  passed += runTest('should handle custom validation errors', () => {
    const customValidator = Schema.string().custom(value => {
      if (value.includes('bad')) {
        throw new Error('Contains bad word');
      }
      return true;
    });

    expectValid(customValidator.validate('good string'));
    expectInvalid(customValidator.validate('bad string'), 'Contains bad word');
  });

  return { passed, total };
}

// Run all tests
function runAllTests() {
  console.log('🧪 Running JavaScript Validation Library Tests\n');

  const results = [
    testStringValidator(),
    testNumberValidator(),
    testBooleanValidator(),
    testDateValidator(),
    testArrayValidator(),
    testObjectValidator(),
    testComplexScenarios(),
    testCustomValidators()
  ];

  const totalPassed = results.reduce((sum, result) => sum + result.passed, 0);
  const totalTests = results.reduce((sum, result) => sum + result.total, 0);

  console.log(`\n📊 Test Results: ${totalPassed}/${totalTests} tests passed`);
  
  if (totalPassed === totalTests) {
    console.log('🎉 All tests passed!');
    return true;
  } else {
    console.log(`❌ ${totalTests - totalPassed} tests failed`);
    return false;
  }
}

// Export for use in other test runners
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests };
}

// Run tests if this file is executed directly
if (require.main === module) {
  const success = runAllTests();
  process.exit(success ? 0 : 1);
}
