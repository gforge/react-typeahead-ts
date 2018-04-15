import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import { ButtonGroup, Button } from 'reactstrap';
import { Typeahead } from 'react-typeahead-ts';

export interface BeatleWithId { id: number; name: string; }
export default () => {
  const options: BeatleWithId[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Paul' },
    { id: 3, name: 'George' },
    { id: 4, name: 'Ringo' },
  ];
  return (
    <Formik
      initialValues={{ my_form_field: '' }}
      onSubmit={(vals, { setSubmitting }) => {
        // tslint:disable-next-line:no-console
        console.log(vals);
        setSubmitting(false);
      }}
    >
      {({ errors, touched, isSubmitting, handleReset }) => (
        <Form>
          <Field
            type="text"
            name="my_form_field"
          >
            {({ form: { setFieldValue, setFieldTouched }, field: { name } }) => (
              <Typeahead
                options={options}
                filterOption="name"
                displayOption="name"
                formInputOption="id"
                showOptionsWhenEmpty={true}
                onChange={() => {
                  setFieldTouched(name, true);
                }}
                onOptionSelected={(value?: BeatleWithId) => setFieldValue(name, value && value.name)}
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
          <ButtonGroup>
            <Button color="success" type="submit" disabled={isSubmitting}>
              Submit to <pre>console.log()</pre>
            </Button>
          </ButtonGroup>
        </Form>
      )}
    </Formik>);
};
