import { plainToInstance } from 'class-transformer';
import {
  type ClassConstructor,
  type ClassTransformOptions,
} from 'class-transformer/types/interfaces';

export function convertPlainObjectsToClassInstances<FROM, TO>(
  from: FROM[],
  classConstructor: ClassConstructor<TO>,
  options?: ClassTransformOptions,
): TO[];

export function convertPlainObjectsToClassInstances<FROM, TO>(
  from: FROM,
  classConstructor: ClassConstructor<TO>,
  options?: ClassTransformOptions,
): TO;

export function convertPlainObjectsToClassInstances<FROM, TO>(
  from: FROM | FROM[],
  classConstructor: ClassConstructor<TO>,
  options?: ClassTransformOptions,
): TO | TO[] {
  return plainToInstance(classConstructor, from, {
    ...DEFAULT_TRANSFORMATION_OPTIONS,
    ...options,
  });
}

export const DEFAULT_TRANSFORMATION_OPTIONS: ClassTransformOptions = {
  excludeExtraneousValues: true,
  exposeDefaultValues: true,
  ignoreDecorators: true,
  exposeUnsetFields: false,
};
