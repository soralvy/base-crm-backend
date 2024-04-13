/**
 * Recursively resolves any promises found within a given object, array, or individual value.
 * This function is designed to traverse through all properties of an object or elements of an array,
 * resolving promises wherever they occur. The purpose is to ensure that all async operations are completed
 * and their results integrated seamlessly into the original data structure format.
 *
 * This function handles nested structures and different types of values including:
 * - Promises, by awaiting their resolution.
 * - Arrays, by recursively resolving each element.
 * - Objects, by recursively resolving each value of each key-value pair.
 * - Dates and primitive values, which are returned as-is.
 *
 * Note: The function uses type casting to handle different return types, which might not perfectly preserve
 * the original type structures in TypeScript. Usage of this function with complex nested generics should be
 * done with caution regarding type accuracy.
 *
 * @param {T} input - The input value which can be a promise, an array, an object, or any other value.
 *                    It is expected to potentially include promises that need to be resolved.
 * @returns {Promise<T>} A promise that resolves to the input value with all contained promises resolved.
 *                        The structure of `input` is preserved in the returned value.
 */
export const deepResolvePromises = async <T>(input: T): Promise<T> => {
  if (input instanceof Promise) {
    return input as unknown as T;
  }

  if (Array.isArray(input)) {
    const resolvedArray = await Promise.all(input.map(deepResolvePromises));
    return resolvedArray as unknown as T;
  }

  if (input instanceof Date) {
    return input; // Dates are immutable, so we return them directly
  }

  if (typeof input === 'object' && input !== null) {
    const resolvedMap = new Map<string, unknown>();
    const entries = Object.entries(input) as [string, unknown][];

    for (const [key, value] of entries) {
      resolvedMap.set(key, await deepResolvePromises(value));
    }

    // Convert map back to object (this loses any Map-specific benefits, but matches expected return type)
    return Object.fromEntries(resolvedMap) as T;
  }

  return input;
};
