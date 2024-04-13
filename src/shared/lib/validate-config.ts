import { type ClassConstructor, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

export const validateConfig = <T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
) => {
  const validatedConfig = plainToClass(envVariablesClass, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
