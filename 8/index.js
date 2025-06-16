/**
 * JavaScript Validation Library
 * A robust validation library for JavaScript that supports primitive and complex data types
 */

/**
 * Base validator class that all other validators extend
 */
class BaseValidator {
  constructor() {
    this.isOptional = false;
    this.customMessage = null;
    this.customValidator = null;
  }

  optional() {
    this.isOptional = true;
    return this;
  }

  withMessage(message) {
    this.customMessage = message;
    return this;
  }

  custom(validator) {
    this.customValidator = validator;
    return this;
  }

  validate(value) {
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return { valid: true, value, errors: [] };
      }
      return { 
        valid: false, 
        value, 
        errors: [this.customMessage || 'Value is required'] 
      };
    }

    const result = this._validateType(value);
    
    if (result.valid && this.customValidator) {
      try {
        const customResult = this.customValidator(value);
        if (customResult === false || (typeof customResult === 'object' && !customResult.valid)) {
          result.valid = false;
          result.errors.push(this.customMessage || 'Custom validation failed');
        }
      } catch (error) {
        result.valid = false;
        result.errors.push(this.customMessage || `Custom validation error: ${error.message}`);
      }
    }

    return result;
  }

  _validateType(value) {
    return { valid: true, value, errors: [] };
  }
}

/**
 * String validator with various string-specific validations
 */
class StringValidator extends BaseValidator {
  constructor() {
    super();
    this.minLengthValue = null;
    this.maxLengthValue = null;
    this.patternValue = null;
    this.allowEmpty = true;
  }

  minLength(min) {
    this.minLengthValue = min;
    return this;
  }

  maxLength(max) {
    this.maxLengthValue = max;
    return this;
  }

  pattern(pattern) {
    this.patternValue = pattern;
    return this;
  }

  notEmpty() {
    this.allowEmpty = false;
    return this;
  }

  _validateType(value) {
    const errors = [];

    if (typeof value !== 'string') {
      return { 
        valid: false, 
        value, 
        errors: [this.customMessage || 'Value must be a string'] 
      };
    }

    if (!this.allowEmpty && value.length === 0) {
      errors.push(this.customMessage || 'String cannot be empty');
    }

    if (this.minLengthValue !== null && value.length < this.minLengthValue) {
      errors.push(this.customMessage || `String must be at least ${this.minLengthValue} characters long`);
    }

    if (this.maxLengthValue !== null && value.length > this.maxLengthValue) {
      errors.push(this.customMessage || `String must be at most ${this.maxLengthValue} characters long`);
    }

    if (this.patternValue && !this.patternValue.test(value)) {
      errors.push(this.customMessage || 'String does not match required pattern');
    }

    return { valid: errors.length === 0, value, errors };
  }
}

/**
 * Number validator with various number-specific validations
 */
class NumberValidator extends BaseValidator {
  constructor() {
    super();
    this.minValue = null;
    this.maxValue = null;
    this.integerOnly = false;
    this.positiveOnly = false;
  }

  min(min) {
    this.minValue = min;
    return this;
  }

  max(max) {
    this.maxValue = max;
    return this;
  }

  integer() {
    this.integerOnly = true;
    return this;
  }

  positive() {
    this.positiveOnly = true;
    return this;
  }

  _validateType(value) {
    const errors = [];

    if (typeof value !== 'number' || isNaN(value)) {
      return { 
        valid: false, 
        value, 
        errors: [this.customMessage || 'Value must be a number'] 
      };
    }

    if (this.integerOnly && !Number.isInteger(value)) {
      errors.push(this.customMessage || 'Value must be an integer');
    }

    if (this.positiveOnly && value <= 0) {
      errors.push(this.customMessage || 'Value must be positive');
    }

    if (this.minValue !== null && value < this.minValue) {
      errors.push(this.customMessage || `Value must be at least ${this.minValue}`);
    }

    if (this.maxValue !== null && value > this.maxValue) {
      errors.push(this.customMessage || `Value must be at most ${this.maxValue}`);
    }

    return { valid: errors.length === 0, value, errors };
  }
}

/**
 * Boolean validator
 */
class BooleanValidator extends BaseValidator {
  _validateType(value) {
    if (typeof value !== 'boolean') {
      return { 
        valid: false, 
        value, 
        errors: [this.customMessage || 'Value must be a boolean'] 
      };
    }

    return { valid: true, value, errors: [] };
  }
}

/**
 * Date validator with various date-specific validations
 */
class DateValidator extends BaseValidator {
  constructor() {
    super();
    this.minDate = null;
    this.maxDate = null;
  }

  min(min) {
    this.minDate = min;
    return this;
  }

  max(max) {
    this.maxDate = max;
    return this;
  }

  _validateType(value) {
    const errors = [];
    let dateValue = value;

    if (typeof value === 'string' || typeof value === 'number') {
      dateValue = new Date(value);
    }

    if (!(dateValue instanceof Date) || isNaN(dateValue.getTime())) {
      return { 
        valid: false, 
        value, 
        errors: [this.customMessage || 'Value must be a valid date'] 
      };
    }

    if (this.minDate && dateValue < this.minDate) {
      errors.push(this.customMessage || `Date must be after ${this.minDate.toISOString()}`);
    }

    if (this.maxDate && dateValue > this.maxDate) {
      errors.push(this.customMessage || `Date must be before ${this.maxDate.toISOString()}`);
    }

    return { valid: errors.length === 0, value: dateValue, errors };
  }
}

/**
 * Array validator for validating arrays and their elements
 */
class ArrayValidator extends BaseValidator {
  constructor(itemValidator) {
    super();
    this.itemValidator = itemValidator;
    this.minLengthValue = null;
    this.maxLengthValue = null;
  }

  minLength(min) {
    this.minLengthValue = min;
    return this;
  }

  maxLength(max) {
    this.maxLengthValue = max;
    return this;
  }

  _validateType(value) {
    const errors = [];

    if (!Array.isArray(value)) {
      return { 
        valid: false, 
        value, 
        errors: [this.customMessage || 'Value must be an array'] 
      };
    }

    if (this.minLengthValue !== null && value.length < this.minLengthValue) {
      errors.push(this.customMessage || `Array must have at least ${this.minLengthValue} items`);
    }

    if (this.maxLengthValue !== null && value.length > this.maxLengthValue) {
      errors.push(this.customMessage || `Array must have at most ${this.maxLengthValue} items`);
    }

    const validatedItems = [];
    if (this.itemValidator) {
      for (let i = 0; i < value.length; i++) {
        const itemResult = this.itemValidator.validate(value[i]);
        if (!itemResult.valid) {
          errors.push(`Item at index ${i}: ${itemResult.errors.join(', ')}`);
        }
        validatedItems.push(itemResult.value);
      }
    } else {
      validatedItems.push(...value);
    }

    return { 
      valid: errors.length === 0, 
      value: validatedItems, 
      errors 
    };
  }
}

/**
 * Object validator for validating objects and their properties
 */
class ObjectValidator extends BaseValidator {
  constructor(schema = {}) {
    super();
    this.schema = schema;
    this.allowUnknown = true; // Allow unknown properties by default
  }

  unknown(allow = true) {
    this.allowUnknown = allow;
    return this;
  }

  strict() {
    this.allowUnknown = false;
    return this;
  }

  _validateType(value) {
    const errors = [];

    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return { 
        valid: false, 
        value, 
        errors: [this.customMessage || 'Value must be an object'] 
      };
    }

    const validatedObject = {};
    const providedKeys = Object.keys(value);
    const schemaKeys = Object.keys(this.schema);

    for (const key of schemaKeys) {
      const validator = this.schema[key];
      const propertyValue = value[key];
      
      const result = validator.validate(propertyValue);
      if (!result.valid) {
        errors.push(`Property '${key}': ${result.errors.join(', ')}`);
      } else {
        validatedObject[key] = result.value;
      }
    }

    if (!this.allowUnknown) {
      const unknownKeys = providedKeys.filter(key => !schemaKeys.includes(key));
      if (unknownKeys.length > 0) {
        errors.push(`Unknown properties: ${unknownKeys.join(', ')}`);
      }
    } else {
      for (const key of providedKeys) {
        if (!schemaKeys.includes(key)) {
          validatedObject[key] = value[key];
        }
      }
    }

    return { valid: errors.length === 0, value: validatedObject, errors };
  }
}

/**
 * Schema Builder - Main API for creating validators
 */
class Schema {
  static string() {
    return new StringValidator();
  }
  
  static number() {
    return new NumberValidator();
  }
  
  static boolean() {
    return new BooleanValidator();
  }
  
  static date() {
    return new DateValidator();
  }
  
  static object(schema) {
    return new ObjectValidator(schema);
  }
  
  static array(itemValidator) {
    return new ArrayValidator(itemValidator);
  }
}

module.exports = {
  Schema,
  BaseValidator,
  StringValidator,
  NumberValidator,
  BooleanValidator,
  DateValidator,
  ArrayValidator,
  ObjectValidator
}; 