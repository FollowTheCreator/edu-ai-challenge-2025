/**
 * Example usage of the JavaScript Validation Library
 */

const { Schema } = require('./index');

console.log('🚀 JavaScript Validation Library - Example Usage\n');

// Example 1: Basic String Validation
console.log('=== Example 1: Basic String Validation ===');
const nameValidator = Schema.string().minLength(2).maxLength(50);
console.log('Valid name:', nameValidator.validate('John Doe'));
console.log('Invalid name:', nameValidator.validate('J'));

// Example 2: Email Validation
console.log('\n=== Example 2: Email Validation ===');
const emailValidator = Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
console.log('Valid email:', emailValidator.validate('user@example.com'));
console.log('Invalid email:', emailValidator.validate('invalid-email'));

// Example 3: Number Validation
console.log('\n=== Example 3: Number Validation ===');
const ageValidator = Schema.number().integer().min(0).max(120);
console.log('Valid age:', ageValidator.validate(25));
console.log('Invalid age:', ageValidator.validate(-5));

// Example 4: Array Validation
console.log('\n=== Example 4: Array Validation ===');
const tagsValidator = Schema.array(Schema.string()).maxLength(5);
console.log('Valid tags:', tagsValidator.validate(['javascript', 'node', 'validation']));
console.log('Invalid tags:', tagsValidator.validate(['a', 'b', 'c', 'd', 'e', 'f']));

// Example 5: Complex Object Validation
console.log('\n=== Example 5: Complex Object Validation ===');
const userSchema = Schema.object({
  id: Schema.string(),
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().integer().min(13).max(120).optional(),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string()).optional(),
  address: Schema.object({
    street: Schema.string(),
    city: Schema.string(),
    postalCode: Schema.string().pattern(/^\d{5}$/)
  }).optional()
});

const validUser = {
  id: "12345",
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  isActive: true,
  tags: ["developer", "javascript"],
  address: {
    street: "123 Main St",
    city: "Anytown",
    postalCode: "12345"
  }
};

const invalidUser = {
  id: "12345",
  name: "J", // Too short
  email: "invalid-email", // Invalid format
  age: -5, // Invalid age
  isActive: "yes", // Wrong type
  address: {
    street: "123 Main St",
    city: "Anytown",
    postalCode: "1234" // Invalid postal code
  }
};

console.log('Valid user:', userSchema.validate(validUser));
console.log('Invalid user:', userSchema.validate(invalidUser));

// Example 6: Custom Validation
console.log('\n=== Example 6: Custom Validation ===');
const evenNumberValidator = Schema.number().custom(value => {
  if (value % 2 !== 0) {
    return false;
  }
  return true;
}).withMessage('Number must be even');

console.log('Valid even number:', evenNumberValidator.validate(4));
console.log('Invalid odd number:', evenNumberValidator.validate(3));

console.log('\n✨ Examples completed!'); 