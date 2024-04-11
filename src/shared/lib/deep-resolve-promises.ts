export const deepResolvePromises = async <T>(input: T): Promise<T> => {
  if (input instanceof Promise) {
    return input as unknown as T;
  }

  if (Array.isArray(input)) {
    const resolvedArray = await Promise.all(input.map(deepResolvePromises));
    return resolvedArray as unknown as T;
  }

  if (input instanceof Date) {
    return input;
  }

  if (typeof input === 'object' && input !== null) {
    const resolvedObject: { [key: string]: any } = {};

    for (const key of Object.keys(input)) {
      const value = (input as { [key: string]: any })[key];
      resolvedObject[key] = await deepResolvePromises(value);
    }

    return resolvedObject as T;
  }

  return input;
};
