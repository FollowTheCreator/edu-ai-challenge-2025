# JavaScript Validation Library

A robust, type-safe validation library for JavaScript that supports primitive and complex data types with a fluent API design.

## 🚀 Features

- **Type-safe validation** for primitive types (string, number, boolean, date)
- **Complex data structure support** (arrays, objects, nested objects)
- **Fluent API** with method chaining
- **Custom validation functions** for business logic
- **Custom error messages** for better user experience
- **Optional field handling** with built-in null/undefined checks
- **Pattern matching** with regular expressions
- **Comprehensive test coverage** with detailed error reporting

## 📦 Installation

### Clone and Install

```bash
git clone <repository-url>
cd <folder>
npm install
```

### Quick Start

```bash
# Run examples
npm start

# Run tests
npm test

# Generate test coverage report
npm run test:coverage
```

## 🛠 Usage

### Basic Usage

```javascript
const { Schema } = require('./index');

// String validation
const nameValidator = Schema.string().minLength(2).maxLength(50);
const result = nameValidator.validate('John Doe');
console.log(result); // { valid: true, value: 'John Doe', errors: [] }

// Number validation
const ageValidator = Schema.number().integer().min(0).max(120);
const ageResult = ageValidator.validate(25);
console.log(ageResult); // { valid: true, value: 25, errors: [] }
```

### Validation Result Format

All validators return a result object with this structure:

```javascript
{
  valid: boolean,    // Whether the validation passed
  value: any,        // The validated (and potentially transformed) value
  errors: string[]   // Array of error messages (empty if valid)
}
```

## 📋 API Reference

### String Validator

```javascript
Schema.string()
  .minLength(min)           // Minimum string length
  .maxLength(max)           // Maximum string length
  .pattern(regex)           // Regular expression pattern
  .notEmpty()               // Disallow empty strings
  .optional()               // Make field optional
  .withMessage(message)     // Custom error message
  .custom(validatorFn)      // Custom validation function
```

**Example:**
```javascript
const emailValidator = Schema.string()
  .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  .withMessage('Please enter a valid email address');

const result = emailValidator.validate('user@example.com');
```

### Number Validator

```javascript
Schema.number()
  .min(minimum)             // Minimum value
  .max(maximum)             // Maximum value
  .integer()                // Must be an integer
  .positive()               // Must be positive (> 0)
  .optional()               // Make field optional
  .withMessage(message)     // Custom error message
  .custom(validatorFn)      // Custom validation function
```

**Example:**
```javascript
const priceValidator = Schema.number()
  .positive()
  .min(0.01)
  .max(999999.99)
  .withMessage('Price must be between $0.01 and $999,999.99');
```

### Boolean Validator

```javascript
Schema.boolean()
  .optional()               // Make field optional
  .withMessage(message)     // Custom error message
  .custom(validatorFn)      // Custom validation function
```

### Date Validator

```javascript
Schema.date()
  .min(minDate)             // Minimum date
  .max(maxDate)             // Maximum date
  .optional()               // Make field optional
  .withMessage(message)     // Custom error message
  .custom(validatorFn)      // Custom validation function
```

**Example:**
```javascript
const birthdateValidator = Schema.date()
  .max(new Date())
  .min(new Date('1900-01-01'))
  .withMessage('Birthdate must be between 1900 and today');
```

### Array Validator

```javascript
Schema.array(itemValidator)
  .minLength(min)           // Minimum array length
  .maxLength(max)           // Maximum array length
  .optional()               // Make field optional
  .withMessage(message)     // Custom error message
  .custom(validatorFn)      // Custom validation function
```

**Example:**
```javascript
const tagsValidator = Schema.array(Schema.string())
  .minLength(1)
  .maxLength(5)
  .withMessage('Please provide 1-5 tags');

const skillsValidator = Schema.array(
  Schema.string().minLength(2).maxLength(20)
).maxLength(10);
```

### Object Validator

```javascript
Schema.object(schemaDefinition)
  .unknown(allow = true)    // Allow/disallow unknown properties (default: true)
  .strict()                 // Disallow unknown properties (equivalent to .unknown(false))
  .optional()               // Make field optional
  .withMessage(message)     // Custom error message
  .custom(validatorFn)      // Custom validation function
```

**Example:**
```javascript
const userSchema = Schema.object({
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().integer().min(13).max(120).optional(),
  preferences: Schema.object({
    newsletter: Schema.boolean(),
    theme: Schema.string().optional()
  }).optional()
});
```

## 🔧 Advanced Usage

### Custom Validation Functions

```javascript
const evenNumberValidator = Schema.number()
  .custom(value => value % 2 === 0)
  .withMessage('Number must be even');

const passwordValidator = Schema.string()
  .minLength(8)
  .custom(value => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecial;
  })
  .withMessage('Password must contain uppercase, lowercase, numbers, and special characters');
```

### Nested Object Validation

```javascript
const addressSchema = Schema.object({
  street: Schema.string().minLength(5).maxLength(100),
  city: Schema.string().minLength(2).maxLength(50),
  state: Schema.string().pattern(/^[A-Z]{2}$/),
  zipCode: Schema.string().pattern(/^\d{5}(-\d{4})?$/)
});

const userSchema = Schema.object({
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  addresses: Schema.array(addressSchema).maxLength(3).optional(),
  primaryAddress: addressSchema.optional()
});
```

### Conditional Validation

```javascript
const membershipSchema = Schema.object({
  type: Schema.string().pattern(/^(basic|premium|enterprise)$/),
  features: Schema.array(Schema.string()).optional()
}).custom(value => {
  if (value.type === 'basic' && value.features && value.features.length > 3) {
    return false; // Basic membership can't have more than 3 features
  }
  return true;
}).withMessage('Basic membership cannot have more than 3 features');
```

## 🧪 Testing

### Running Tests

```bash
# Run comprehensive tests
npm test

# Run simple test suite
npm run test:simple

# Run tests with detailed coverage report (console output)
npm run test:coverage

# Generate test report file
npm run test:report

# Run examples
npm run example
```

### Test Coverage

The library includes comprehensive tests covering:

- ✅ All validator types (string, number, boolean, date, array, object)
- ✅ Edge cases and error conditions
- ✅ Custom validation functions
- ✅ Nested object validation
- ✅ Optional field handling
- ✅ Pattern matching and constraints
- ✅ Complex integration scenarios

## 📁 Project Structure

```
js-validation-library/
├── index.js                 # Main library file
├── example.js              # Usage examples
├── package.json            # Project configuration
├── README.md               # This file
├── .gitignore             # Git ignore rules
├── test/
│   └── validation.test.js  # Comprehensive test suite
└── test_report.txt         # Test coverage report
```

## 🔍 Error Handling

The library provides detailed error messages for debugging:

```javascript
const result = Schema.object({
  name: Schema.string().minLength(2),
  age: Schema.number().min(0)
}).validate({
  name: 'J',
  age: -5
});

console.log(result.errors);
// [
//   "Property 'name': String must be at least 2 characters long",
//   "Property 'age': Value must be at least 0"
// ]
```

## 🚨 Common Patterns

### Form Validation

```javascript
const contactFormSchema = Schema.object({
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  phone: Schema.string().pattern(/^\+?[\d\s-()]+$/).optional(),
  message: Schema.string().minLength(10).maxLength(1000),
  agreeToTerms: Schema.boolean().custom(value => value === true)
    .withMessage('You must agree to the terms')
});
```

### API Request Validation

```javascript
const createUserSchema = Schema.object({
  username: Schema.string().minLength(3).maxLength(20)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must contain only letters, numbers, and underscores'),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: Schema.string().minLength(8),
  profile: Schema.object({
    firstName: Schema.string().minLength(1).maxLength(50),
    lastName: Schema.string().minLength(1).maxLength(50),
    bio: Schema.string().maxLength(500).optional()
  })
});
```

### Configuration Validation

```javascript
const configSchema = Schema.object({
  database: Schema.object({
    host: Schema.string().minLength(1),
    port: Schema.number().integer().min(1).max(65535),
    name: Schema.string().minLength(1),
    ssl: Schema.boolean().optional()
  }),
  server: Schema.object({
    port: Schema.number().integer().min(1000).max(65535),
    host: Schema.string().optional()
  }),
  logging: Schema.object({
    level: Schema.string().pattern(/^(debug|info|warn|error)$/),
    file: Schema.string().optional()
  }).optional()
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern JavaScript ES6+ features
- Inspired by popular validation libraries like Joi and Yup
- Designed for simplicity and flexibility

---

**Made with ❤️ for the JavaScript community** 