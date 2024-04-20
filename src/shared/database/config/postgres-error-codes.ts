import { type DatabaseError } from 'pg';

interface ErrorCodeDetail {
  status: number;
  message: string | ((error: DatabaseError) => string);
}

export const POSTGRES_ERROR_CODES: {
  [key: string]: ErrorCodeDetail;
} = {
  '23505': {
    status: 409,
    message: 'A user with that email already exists.',
  },
  '23503': {
    status: 400,
    message: 'Operation violates a foreign key constraint.',
  },
  '23502': {
    status: 400,
    message: (error: DatabaseError) => {
      const column = error?.column;
      return column
        ? `Required data for '${column}' was not provided.`
        : 'Required data was not provided.';
    },
  },
  '22001': {
    status: 400,
    message: 'Data value too large for the defined data type.',
  },
  '22007': {
    status: 400,
    message: 'Invalid date/time format.',
  },
  '23514': {
    status: 400,
    message: 'Check constraint violation.',
  },
  '22023': {
    status: 400,
    message: 'Invalid JSON data provided.',
  },
  '08001': {
    status: 503,
    message:
      'Database connection error. Please check the database server and try again.',
  },
};
