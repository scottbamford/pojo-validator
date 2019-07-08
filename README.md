# Validation of POJO (Plain-Old-Javascript-Objects)

pojo-validator is a lightweight validation framework using for any models that are plain-old javascript objects (pojo).

We support validating any javascript object as a model, and manage a list of errors per-field for you.

## Installation

Install pojo-validator locally within your project folder, like so:

```shell
npm install pojo-validator
```

Or with yarn:

```shell
yarn add pojo-validator
```

We also provide an additional modules to make it easier to use pojo-validator of you are using react:
```shell
npm install pojo-validator-react
```

Or with yarn:

```shell
yarn add pojo-validator-react
```

And if you'd like a wrapped Input component from reactstrap that will show its validation state you can also use:
```shell
npm install pojo-validator-reactstrap
```

Or with yarn:

```shell
yarn add pojo-validator-reactstrap
```



## Basic Usage

pojo-validator provides a single class Validator that wraps your validation function and manages the errors and validation state for you.

Its API is designed to both let you check individual fields as you go (for example when a field is changed by user input), as well as allowing
you to check all fields when required (for example when submitting a form).

There are two main classes Validator, and ValidationState.

### Validator 

The Validator class can be used by you to call your validation code in a controlled way and extract any errors that occur.

```ts
let validator = new Validator((model, validation, fieldsToCheck) => {
	// Your validation code goes here.
});
```

You can call validate() to validate your model:
```ts
let model = { /* Any plain old javascript or json object */ };

validator.validate(model);
```

or to validate only a few fields:
```ts
let model = { forename: '', surname: '', age: 0 };

validator.validate(model, ['forename']);
// or
validator.validate(model, ['surname']);
```

You can get a list of errors for all fields by calling errors()
```ts
let errors = validator.errors();
// errors['forename'] contains the errors for forename if any.
// errors['surname'] contains errors for surname if any.
// etc.
```

Or for individual fields by calling errorsFor(field):
```ts
let forenameErrors = validator.errorsFor('forename');
// forenameErrors is an array of errors for forename.
```

* Validator - This class is created by passing your validation code as a callback to the constructor.  It includes includes methods
to trigger validation using validate() and to get any validatio errors using errors() and errorsFor().
* ValidationState - This is passed as validation to your validation code callback.  You can use this to addError() clearErrors() and perform
check().

### Validation State

The validationState class helps you to record validation errors found while performing your validation and is passed in as the second argument
to your validation callback.

ValidationState the check() and singleCheck() methods allow you to check for conditions and set a validation message if the unwanted condition
is found to be true:
* check(field: string, condition: () => boolean, errorMessage: string) - Check condition and if it fails (returns true) add errorMessage to the errors for field.
* singleCheck() - Shorthand for calling clearErrors() and then check() on a field that only has one condition to be checked.

The condition should return true on failure.  If true is returned the errorMessage will be added to the list of errors for the field.

You manually add errors for a field without performing a check using:
* addErrors(field: string, errorMessage: string)

And you can clear all errors from a field using:
* clearErrors(field: string)

An example validation code using ValidationState looks like this:

```ts
import { Validator } from 'pojo-validator';

interface MyModel {
	// Any plain javascript or json object can be used as a model.
}

let validator = new Validator((model: MyModel, validation, fieldsToCheck) => {
	// Forename and Surname are both required.
	if (!fieldsToCheck || fieldsToCheck.includes('forename')) {
        validation.singleCheck('forename', () => !model.forename, 'Forename is required');
    }

	if (!fieldsToCheck || fieldsToCheck.includes('surname')) {
        validation.singleCheck('surname', () => !model.surname, 'Surname is required');
    }
	
	// Age must be between 8 and 80
    if (!fieldsToCheck || fieldsToCheck.includes('age')) {
        validation.clear('age');
		validation.check('age', () => model.age < 8, 'Age must be greater than 8');
		validation.check('age', () => model.age < 80, 'Age must be less than 80');
    }
});
```

## Example

Here is a full step by step example for you:

### Creating a Validator with your own validation code

You can validate any javascript or json object.  To create a valdiator pass your validation code that uses ValidationState to perform checks
and record validation errors.

In Typescript:

```ts
import { Validator } from 'pojo-validator';

interface MyModel {
	// Any plain javascript or json object can be used as a model.
}

let validator = new Validator((model: MyModel, validation: ValidationState, fieldsToCheck) => {
	// Forename and Surname are both required.
	if (!fieldsToCheck || fieldsToCheck.includes('forename')) {
        validation.singleCheck('forename', () => !model.forename, 'Forename is required');
    }

	if (!fieldsToCheck || fieldsToCheck.includes('surname')) {
        validation.singleCheck('surname', () => !model.surname, 'Surname is required');
    }
	
	// Age must be between 8 and 80
    if (!fieldsToCheck || fieldsToCheck.includes('age')) {
        validation.clear('age');
		validation.check('age', () => model.age < 8, 'Age must be greater than 8');
		validation.check('age', () => model.age < 80, 'Age must be less than 80');
    }
});
```

Or in Javascript:
```js
var validator = new Validator((model, validation, fieldsToCheck) => {
	// Forename and Surname are both required.
	if (!fieldsToCheck || fieldsToCheck.includes('forename')) {
        validation.singleCheck('forename', () => !model.forename, 'Forename is required');
    }

	if (!fieldsToCheck || fieldsToCheck.includes('surname')) {
        validation.singleCheck('surname', () => !model.surname, 'Surname is required');
    }
	
	// Age must be between 8 and 80
    if (!fieldsToCheck || fieldsToCheck.includes('age')) {
        validation.clear('age');
		validation.check('age', () => model.age < 8, 'Age must be greater than 8');
		validation.check('age', () => model.age < 80, 'Age must be less than 80');
    }
});

```

### Checking if a model is valid.

You can check a model against your validation rules by calling validate().  validate() will return true if there are no validation errors,
and false if there are any errors.

When checking only some fields by passing fieldsToCheck previous validation errors for other fields will still cause false to be returned
even if the fields checked by this call have all passed validation.

The actual errors can be returned by calling errors() or errorsFor('fieldName').

In Typescript:
```ts
let myModel = {
	forename: '',
	surname: 'Smith',
	age: 4
}

let ok = validator.validate(myModel);
if (!ok) {
	let errors = validator.errors();
	// errors will contain:
	//		{
	//			forename: ['Forename is required'],
	//			surname: [],
	//			age: ['Age must be greater than 8']
	//		}
}

```

If you only want errors for a single field, you can use errorsFor(field: string)

```ts
let ok = validator.validate(myModel);
if (!ok) {
	let errors = validator.errorsFor('forename');
	// errors will contain:
	//		['Forename is required']
}
```

If you only want to check specific fields (e.g. checking fields as the user changes them), you can pass a second argument to validate as
an array of field names.

```ts
let ok = validator.validate(myModel, ['forename']);
// or
let ok = validator.validate(myModel, ['forename', 'surname']);
```

In Javascript everything looks pretty much the same.

Validating the model and getting all errors:

```js
var myModel = {
	forename: '',
	surname: 'Smith',
	age: 4
}

var ok = validator.validate(myModel);
if (!ok) {
	let errors = validator.errors();
	// errors will contain:
	//		{
	//			forename: ['Forename is required'],
	//			surname: [],
	//			age: ['Age must be greater than 8']
	//		}
}

```

Getting errors for a single field:

```js
var ok = validator.validate(myModel);
if (!ok) {
	var errors = validator.errorsFor('forename');
	// errors will contain:
	//		['Forename is required']
}
```

Validating only specific fields:

```ts
var ok = validator.validate(myModel, ['forename']);
// or
var ok = validator.validate(myModel, ['forename', 'surname']);
```

## Usage with React

The [poco-validator-react](https://github.com/scottbamford/pojo-validator-react#readme) project provides a hook for easy use of validator in react.

The returned validator will update ints errors into the component state each time validate() is called to trigger a refresh of the
react component with the new error state so you don't have to worry about the state management yourself.

In Typescript:
```ts
import { useValidator } from 'pojo-validator-react';

let validator = useValidatorCallback((validation: ValidationState, fieldsToCheck?: Array<string>) => {
    if (!model) {
        return;
    }

	// Forename and Surname are both required.
	if (!fieldsToCheck || fieldsToCheck.includes('forename')) {
        validation.singleCheck('forename', () => !model.forename, 'Forename is required');
    }

	if (!fieldsToCheck || fieldsToCheck.includes('surname')) {
        validation.singleCheck('surname', () => !model.surname, 'Surname is required');
    }
	
	// Age must be between 8 and 80
    if (!fieldsToCheck || fieldsToCheck.includes('age')) {
        validation.clear('age');
		validation.check('age', () => model.age < 8, 'Age must be greater than 8');
		validation.check('age', () => model.age < 80, 'Age must be less than 80');
    }
});
```

Or in Javascript:
```js
var validator = useValidatorCallback((validation, fieldsToCheck) => {
    if (!model) {
        return;
    }

	// Forename and Surname are both required.
	if (!fieldsToCheck || fieldsToCheck.includes('forename')) {
        validation.singleCheck('forename', () => !model.forename, 'Forename is required');
    }

	if (!fieldsToCheck || fieldsToCheck.includes('surname')) {
        validation.singleCheck('surname', () => !model.surname, 'Surname is required');
    }
	
	// Age must be between 8 and 80
    if (!fieldsToCheck || fieldsToCheck.includes('age')) {
        validation.clear('age');
		validation.check('age', () => model.age < 8, 'Age must be greater than 8');
		validation.check('age', () => model.age < 80, 'Age must be less than 80');
    }
});

```

The [pojo-validator-reactstrap](https://github.com/scottbamford/pojo-validator-reactstrap#readme) project provides two wrapper components to make it easy to validate fields in forms:
* ValidatedInput - A wrapper around Input that will show the appropriate validation errors passed in from props.
* ValidatedFormFeedback - A wrapper aroud FormFeedback that will show the appropriate validation errors passed in from props.

Basic usage:
```ts
import { useValidator } from 'pojo-validator-react';
import { ValidatedInput } from 'pojo-validator-reactstrap';

export const Edit = (props: {}) => {
	const [model, setModel] = React.useState<MyModel>({ forename: '', surname: '', age: 0 });

	let validator = useValidatorCallback((validation: ValidationState, fieldsToCheck?: Array<string>) => {
	    if (!model) {
            return;
         }

		// Forename and Surname are both required.
		if (!fieldsToCheck || fieldsToCheck.includes('forename')) {
			validation.singleCheck('forename', () => !model.forename, 'Forename is required');
		}

		if (!fieldsToCheck || fieldsToCheck.includes('surname')) {
			validation.singleCheck('surname', () => !model.surname, 'Surname is required');
		}
	
		// Age must be between 8 and 80
		if (!fieldsToCheck || fieldsToCheck.includes('age')) {
			validation.clear('age');
			validation.check('age', () => model.age < 8, 'Age must be greater than 8');
			validation.check('age', () => model.age < 80, 'Age must be less than 80');
		}
	});

    const onSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.save();
    }, [props.save]);

    const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        var target = event.currentTarget;
		setModel({
			...model,
			[target.name]: (target.type == 'checkbox' ? target.checked : target.value)
			});
    }, [setModel]);

    const onValidate = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        validator.validate(model, [event.currentTarget.name]);
    }, [props.validate]);

    return (
        <Form onSubmit={onSubmit}>
            <FormGroup>
                <Label htmlFor="forename">Forename</Label>
                <ValidatedInput type="text" name="forename" placeholder="Forename" value={model.forename} onChange={onChange} onBlur={onValidate} validationErrors={validator.errors()} />
            </FormGroup>
			<FormGroup>
                <Label htmlFor="surname">Surname</Label>
                <ValidatedInput type="text" name="surname" placeholder="Forename" value={model.surname} onChange={onChange} onBlur={onValidate} validationErrors={validator.errors()} />
            </FormGroup>
			<FormGroup>
                <Label htmlFor="age">Forename</Label>
                <ValidatedInput type="number" name="age" placeholder="Age" value={model.age} onChange={onChange} onBlur={onValidate} validationErrors={validator.errors()} />
            </FormGroup>
            
            <Button type="submit" color="primary">Save</Button>
        </Form>
    );
};
```

## Typescript

pojo-validator, pojo-validator-react, and pojo-validator-reactstrap are written in typescript and includes their own bindings.

## License

Licensed under the MIT license.





