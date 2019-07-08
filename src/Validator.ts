import { ValidationErrors } from "./ValidationErrors";
import { ValidationCallback } from './ValidationCallback';
import { ValidationState } from './ValidationState';

/**
 * Validator to validate any plain-old javascript or json object (pojo).
 */
export class Validator<T = any> {
    private _errors: ValidationErrors;
    private validating: ValidationCallback<T>;

    constructor(validating: ValidationCallback<T>) {
        this._errors = {};
        this.validating = validating;
    }

    /**
     * Validate model.
     * 
     * Returns true if their are any known validation errors for model.
     * 
     * If fieldsToCheck is passed only the requested fields will be checked, however we may still return true if any errors for other
     * fields from previous calls remain even if all the fields checked this call passed all validation.
     * @param model model to validate.
     * @param fieldsToCheck if passed only the listed fields will be checked.
     */
    validate(model: T, fieldsToCheck?: Array<string>): boolean {
        var builder = new ValidationState(this._errors);

        this.validating(model, builder, fieldsToCheck);

        return !this.hasErrors();
    }

    /**
     * Returns the errors found by the validator.
     */
    errors(): ValidationErrors {
        return this._errors;
    }

    /**
     * Returns the errors found by the validator for fieldName.
     */
    errorsFor(fieldName: string): Array<string> {
        return this._errors[fieldName] || [];
    }

    /**
     *Returns true if this validator has any errors for any fields.
     */
    hasErrors(): boolean {
        let keys = Object.keys(this._errors);
        for (let i = 0; i < keys.length; ++i) {
            let key = keys[i];
            if (this._errors[key].length) {
                return true;
            }
        }

        return false;
    }
}
