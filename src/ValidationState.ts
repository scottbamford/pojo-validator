import { ValidationErrors } from "./ValidationErrors";
/**
 * State management for validation that is passed to the ValidatingCallback to allow the management of errors.
 */
export class ValidationState {
    private _errors: ValidationErrors;

    constructor(errors: ValidationErrors) {
        this._errors = errors;
    }

    /**
     * Check a field for condition.  If the condition is true add the errorMessage to the errors for the field.
     * @param field
     * @param condition
     * @param errorMessage
     */
    check(field: string, condition: boolean | (() => boolean), errorMessage: string) {
        let failed = condition;
        if (typeof condition === 'function') {
            failed = condition();
        }

        if (failed) {
            this.addError(field, errorMessage);
        }
    }

    /**
     * Clear all errors for field, usually called before we call check() on the field.  Can be skipped if we are calling singleCheck() on a field.
     * @param field
     */
    clearErrors(field: string) {
        if (this._errors[field] == null) {
            this._errors[field] = new Array<string>();
        }
    }

    /**
     * Call clearErrors() and then check() for the field as a convience for fields that only have one check.
     * @param field
     * @param condition
     * @param errorMessage
     */
    singleCheck(field: string, condition: boolean | (() => boolean), errorMessage: string) {
        this.clearErrors(field);
        this.check(field, condition, errorMessage);
    }

    /**
     * Add an error for a field.
     * @param field
     * @param errorMessage
     */
    addError(field: string, errorMessage: string) {
        if (this._errors[field] == null) {
            this._errors[field] = new Array<string>();
        }

        this._errors[field].push(errorMessage);
    }

    /**
     * Check rules specified in the rules dictionary of functions 
     * @param rules
     * @param fieldsToCheck
     */
    checkRules(rules: { [id: string]: () => string | undefined | null }, fieldsToCheck?: Array<string>) {
        for (let field in rules) {
            if (!fieldsToCheck || fieldsToCheck.find(item => item === field)) {
                // Do the check
                let rule = rules[field];
                let errorMessage = rule();
                this.clearErrors(field);
                if (errorMessage) {
                    this.addError(field, errorMessage);
                }
            }
        }
    }

    /**
     * Returns the errors found by the validator.
     */
    errors(): ValidationErrors {
        return this._errors;
    }
}
