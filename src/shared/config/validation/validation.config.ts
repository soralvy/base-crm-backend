import {
  HttpStatus,
  UnprocessableEntityException,
  type ValidationError,
  type ValidationPipeOptions,
} from '@nestjs/common';

type ErrorResult = {
  [key: string]: string | ErrorResult;
};

/**
 * Recursively formats validation errors into a structured object.
 * This function takes an array of ValidationError objects and processes them to create
 * a more readable and organized structure, which is useful for providing detailed error responses.
 *
 * @param {ValidationError[]} errors - An array of ValidationError objects from class-validator.
 * @returns An object where each key is a property with a validation error, and each value
 *          is either a string of error messages or a nested object with more errors.
 */
const generateErrors = (errors: ValidationError[]): ErrorResult => {
  const result: ErrorResult = {};
  for (const error of errors) {
    result[error.property] =
      error.children && error.children.length > 0
        ? generateErrors(error.children)
        : Object.values(error.constraints ?? {}).join(', ');
  }
  return result;
};

/**
 * Validation options for use with NestJS's ValidationPipe.
 * This configuration object defines how request data validation should be handled globally
 * throughout the application.
 */
export const validationOptions: ValidationPipeOptions = {
  transform: true, // Enable automatic transformation of input data to DTO instance types.
  whitelist: true, // Strip payload objects of properties without validation decorators to avoid unexpected data.
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // Set the HTTP status code for validation errors.
  exceptionFactory: (errors: ValidationError[]) => {
    // Customize the exception response for validation errors.
    // Uses generateErrors function to format and return structured validation errors.
    return new UnprocessableEntityException({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: generateErrors(errors),
    });
  },
};
