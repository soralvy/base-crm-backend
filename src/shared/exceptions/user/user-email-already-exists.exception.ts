import { HttpException, HttpStatus } from '@nestjs/common';

const MESSAGE = 'A user with this email already exists.';

export class UserEmailAlreadyExistsException extends HttpException {
  constructor(message: string = MESSAGE) {
    super(message, HttpStatus.CONFLICT);
  }
}
