import * as React from 'react';
import { Formik, Form, Field, FieldArray, FieldProps, FormikProps } from 'formik';
import { ButtonGroup, Button, Label } from 'reactstrap';
import { Typeahead, Tokenizer } from '@gforge/react-typeahead-ts';

export interface BeatleWithId { id: number; name: string; }
type Values = { my_form_field: string, my_array: number[] };
export default () => {
  const options: BeatleWithId[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Paul' },
    { id: 3, name: 'George' },
    { id: 4, name: 'Ringo' },
  ];
  return (
    <Formik
      initialValues={{ my_form_field: '', my_array: [] }}
      onSubmit={(vals, { setSubmitting }) => {
        // tslint:disable-next-line:no-console
        console.log(vals, 'value when submitting');
        setSubmitting(false);
      }}
    >
      {({ errors, touched, isSubmitting, handleReset, values }: FormikProps<Values>) => (
        <Form>
          <Label>Typeahed</Label>
          <Field
            type="text"
            name="my_form_field"
          >
            {({ form: { setFieldValue, setFieldTouched }, field: { name } }: FieldProps<Values>) => (
              <Typeahead
                options={options}
                filterOption="name"
                displayOption="name"
                formInputOption="id"
                showOptionsWhenEmpty={true}
                onChange={() => {
                  setFieldTouched(name, true);
                }}
                onOptionSelected={(value?: BeatleWithId) => {
                  // tslint:disable-next-line:no-console
                  console.log(value, 'value in onOptionSelected');
                  setFieldValue(name, value && value.name);
                }}
                className="inputStyle"
                customClasses={{
                  results: 'list-group',
                  listItem: 'list-group-item'
                }}
              />
            )}
          </Field>
          {errors.my_form_field && touched.my_form_field && <div>{errors.my_form_field}</div>}
          <br />
          <Label>Tokenizer</Label>
          <FieldArray
            name="my_array"
          >
            {({ push, remove }) => {
              return (
                <Tokenizer
                  options={options}
                  filterOption="name"
                  displayOption="name"
                  formInputOption="id"
                  showOptionsWhenEmpty={true}
                  onTokenAdd={(value: BeatleWithId) => {
                    // tslint:disable-next-line:no-console
                    console.log(value, 'value in Add');
                    push(value.id);
                  }}
                  onTokenRemove={(value: BeatleWithId) => {
                    // tslint:disable-next-line:no-console
                    console.log(value, 'value in Remove');
                    remove(values.my_array.findIndex(id => id === value.id));
                  }}
                  className="inputStyle"
                  customClasses={{
                    results: 'list-group',
                    listItem: 'list-group-item',
                    token: 'badge badge-primary',
                  }}
                />
              );
            }}
          </FieldArray>
          {errors.my_form_field && touched.my_form_field && <div>{errors.my_form_field}</div>}
          <br />
          <ButtonGroup>
            <Button color="success" type="submit" disabled={isSubmitting}>
              Submit to <pre>console.log()</pre>
            </Button>
          </ButtonGroup>
        </Form>
      )}
    </Formik>);
};
