import { ValidationState } from './ValidationState';

/**
 * Collection of validation errors for a model/view indexed by field.
 */
export type ValidationCallback<T = any> = (model: T, validation: ValidationState, fieldsToCheck?: Array<string>) => void;
