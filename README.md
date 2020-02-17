[![Build Status](https://travis-ci.org/gforge/react-typeahead-ts.svg?branch=master)](https://travis-ci.org/gforge/react-typeahead-ts)
[![npm version](https://badge.fury.io/js/%40gforge%2Freact-typeahead-ts.svg)](https://badge.fury.io/js/%40gforge%2Freact-typeahead-ts)

# The @gforge/react-typeahead-ts

> A typeahead/autocomplete component for React

@gforge/react-typeahead-ts is a [TypeScript](http://www.typescriptlang.org/)
(a superset of JavaScript) library that provides a react-based
typeahead, or autocomplete text entry, as well as a "typeahead tokenizer",
a typeahead that allows you to select multiple results. It can be used
with regular JavaScript usin standard syntax although TypeScript is
recommended as the library has dropped the deprecated `prop-types`.
The project is a fork from the [react-typeahead](https://github.com/fmoo/react-typeahead)
as suggested by the name.

## Usage

For a typeahead input:

```javascript
import { Typeahead } from '@gforge/react-typeahead-ts';
React.render(
  <Typeahead options={['John', 'Paul', 'George', 'Ringo']} maxVisible={2} />
);
```

For a tokenizer typeahead input:

```javascript
import { Tokenizer } from '@gforge/react-typeahead-ts';
React.render(
  <Tokenizer
    options={['John', 'Paul', 'George', 'Ringo']}
    onTokenAdd={function(token) {
      console.log('token added: ', token);
    }}
  />
);
```

## Examples

- [Package demo][1]

[1]: http://gforge.github.com/react-typeahead-ts

## API

It is strongly recommended to look at the typescipt files in order to understand the API and what input is expected. The library is fully typed in the API and has a minimal reliance on `any`.

### Typeahead(props)

Type: React Component

Basic typeahead input and results list.

| Name                    | Type                   | Description                                                                                                                                                                                    |
| ----------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                    | `String`               | If provided there will be a hidden input wiht a name with the selected value                                                                                                                   |
| options                 | `Array`                | An array supplied to the filtering function. Can be a list of strings or a list of arbitrary objects. In the latter case, `filterOption` and `displayOption` should be provided.               |
| defaultValue            | `String`               | A default value used when the component has no value. If it matches any options a option list will show.                                                                                       |
| value                   | `String`               | Specify a value for the text input.                                                                                                                                                            |
| initialValue            | `String`               | The value when mounting                                                                                                                                                                        |
| maxVisible              | `Number`               | Limit the number of options rendered in the results list.                                                                                                                                      |
| resultsTruncatedMessage | `String`               | If `maxVisible` is set, display this custom message at the bottom of the list of results when the result are truncated.                                                                        |
| customClasses           | `Object`               | An object containing custom class names for child elements (see [description below](#the-customclasses-argument))                                                                              |
| placeholder             | `String`               | Placeholder text for the typeahead input.                                                                                                                                                      |
| disabled                | `Boolean`              | Set to `true` to add disable attribute in the `<input>` or `<textarea>` element                                                                                                                |
| textarea                | `Boolean`              | Set to `true` to use a `<textarea>` element rather than an `<input>` element                                                                                                                   |
| inputProps              | `Object`               | Props to pass directly to the `<input>` element.                                                                                                                                               |
| onKeyDown               | `Function`             | Event handler for the `keyDown` event on the typeahead input.                                                                                                                                  |
| onKeyPress              | `Function`             | Event handler for the `keyPress` event on the typeahead input.                                                                                                                                 |
| onKeyUp                 | `Function`             | Event handler for the `keyUp` event on the typeahead input.                                                                                                                                    |
| onBlur                  | `Function`             | Event handler for the `blur` event on the typeahead input.                                                                                                                                     |
| onFocus                 | `Function`             | Event handler for the `focus` event on the typeahead input.                                                                                                                                    |
| onChange                | `Function`             | Event handler for the `change` event on the typeahead input.                                                                                                                                   |
| onOptionSelected        | `Function`             | Event handler triggered whenever a user picks an option.                                                                                                                                       |
| displayOption           | `String` or `Function` | A function to map an option onto a string for display in the list (see [description below](#the-displayoption-argument)).                                                                      |
| filterOption            | `String` or `Function` | A function to filter the provided `options` based on the current input value (see [description below](#the-filteroption-argument)).                                                            |
| inputDisplayOption      | `String` or `Function` | A function that maps the internal state of the visible options into the value stored in the text value field of the visible input (see [description below](#the-inputdisplayoption-argument)). |
| formInputOption         | `String` or `Function` | A function to map an option onto a string to include in HTML forms as a hidden field (see `name` and [description below](#the-forminputoption-argument))                                       |
| searchOptions           | `Function`             | Search the provided `options` based on the current input value (see [description below](#the-searchoptions-argument), defaults to [fuzzy string matching](https://github.com/mattyork/fuzzy)). |
| defaultClassNames       | `Boolean`              | If false, the default classNames are removed from the typeahead.                                                                                                                               |
| customListComponent     | `React Component`      | A React Component that renders the list of typeahead results. This replaces the default list of results (see below [description below](#the-customlistcomponent-argument))                     |
| showOptionsWhenEmpty    | `Boolean`              | If true, options will still be rendered when there is no value.                                                                                                                                |
| allowCustomValues       | `Boolean`              | If true, custom tags can be added without a matching typeahead selection                                                                                                                       |
| clearOnSelection        | `Boolean`              | Clear value after selecting. Primarily used with Tokenizer.                                                                                                                                    |
| className               | `String`               | String with class name                                                                                                                                                                         |
| innerRef                | `React reference`      | A `createRef` object                                                                                                                                                                           |
| separateByComma         | `Boolean`              | Allows you to select an option using a comma.                                                                                                                                                  |


### Tokenizer(props)

Type: React Component

Typeahead component that allows for multiple options to be selected. The following properties are identical as for the **Typeahead**:

- `name`
- `options`
- `initialValue`
- `maxVisible`
- `resultsTruncatedMessage`
- `customClasses`
- `placeholder`
- `disabled`
- `inputProps`
- `onKeyDown`
- `onKeyPress`
- `onKeyUp`
- `onBlur`
- `onFocus`
- `onChange`
- `displayOption`
- `filterOption`
- `formInputOption`
- `searchOptions`
- `defaultClassNames`
- `showOptionsWhenEmpty`
- `className`
- `innerRef`

The new additional arguments are:

| Name                 | Type       | Description                                                     |
| -------------------- | ---------- | --------------------------------------------------------------- |
| defaultSelected      | `Array`    | A set of values of tokens to be loaded on first render.         |
| onTokenRemove        | `Function` | Event handler triggered whenever a token is removed.            |
| onTokenAdd           | `Function` | Event handler triggered whenever a token is added.              |
| showOptionsWhenEmpty | `Boolean`  | If true, options will still be rendered when there is no value. |

### Specific props details

#### The searchOptions argument

Type: `(value: string, options: Option[]) => Option[]`

A function to filter and/or sort the provided `options` based on the current input value. Compared to `filterOption` it allows you to sort the results any way you want.

If not supplied, defaults to the `filterOption`.

_Note:_ the function can be used to store other information besides the string in the internal state of the component.
Make sure to use the `displayOption`, `inputDisplayOption`, and `formInputOption` props to extract/generate the correct format of data that each expects if you do this.

#### The filterOption argument

Type: `String` or `(value: string, option: Option) => boolean`

A function to filter the provided `options` based on the current input value. For each option, receives `(inputValue, option)`. If not supplied, defaults to [fuzzy string matching](https://github.com/mattyork/fuzzy).

If provided as a string, it will interpret it as a field name and use that field from each option object.

#### The displayOption argument

Type: `String` or `(option: Option) => string | number`

A function to map an option onto a string for display in the list. Receives `(option, index)` where index is relative to the results list, not all the options. Can either return a string or a React component.

If provided as a string, it will interpret it as a field name and use that field from each option object.

#### The inputDisplayOption argument

Type: `String` or `(option: Option, index?: number) => string | number`

A function that maps the internal state of the visible options into the value stored in the text value field of the visible input when an option is selected.

Receives `(option)`.

If provided as a string, it will interpret it as a field name and use that field from each option object.

If no value is set, the input will be set using `displayOption` when an option is selected.

#### The formInputOption argument

Type: `String` or `(option: Option) => string | number`

A function to map an option onto a string to include in HTML forms as a hidden field (see `name`).

If specified as a string, it will interpret it as a field name and use that field from each option object.

If not specified, it will fall back onto the semantics described in `displayOption`.

#### The customClasses argument

Type: `Object`

Allowed Keys: `input`, `results`, `listItem`, `listAnchor`, `hover`, `resultsTruncated`. For the **Tokenizer** you can also provide `token`, `typeahead`.

An object containing custom class names for child elements. Useful for
integrating with 3rd party UI kits.

#### The customListComponent argument

A React Component that renders the list of typeahead results. This replaces the default list of results.

This component receives the following props :

##### Passed through

- `displayOptions`
- `customClasses`
- `onOptionSelected`

##### Created or modified

- `options`
  - This is the Typeahead's `options` filtered and limited to `Typeahead.maxVisible`.
- `selectionIndex`
  - The index of the highlighted option for rendering

---

## Developing

### Setting Up

You will need `npm` to develop on react-typeahead-ts. [Installing npm][4].

Once that's done, to get started, run `npm install` in your checkout directory.
This will install all the local development dependences, such as `gulp` and `mocha`

### Testing

react-typeahead-ts uses jest and enzyme for unit tests. Large changes should
include unittests. After updating or creating new tests, run `npm run test` to regenerate the
test package.

### Contributing

Basically, fork the repository and send a pull request. It can be difficult to review these, so
here are some general rules to follow for getting your PR accepted more quickly:

- All new properties and exposed component function should be documented in the README.md
- Break your changes into smaller, easy to understand commits.
- Send separate PRs for each commit when possible.
- Feel free to rebase, merge, and rewrite commits to make them more readible.
- Add comments explaining anything that's not painfully obvious.
- Add unittests for your change if possible.
