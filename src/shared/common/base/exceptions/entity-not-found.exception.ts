import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entity: string, message?: string) {
    super(message || `Entity ${entity} not found.`);
  }
}
