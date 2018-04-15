import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import { ButtonGroup, Button } from 'reactstrap';
import { Typeahead } from 'react-typeahead-ts';

export default () => {
  
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
            {({ field }) => (
              <Typeahead 
                options={[
                  { id: 1, name: 'John' }, 
                  { id: 2, name: 'Paul' }, 
                  { id: 3, name: 'George' }, 
                  { id: 4, name: 'Ringo' },
                ]}
                filterOption="name"
                displayOption="name"
                formInputOption="id"
                maxVisible={2}
                showOptionsWhenEmpty={true}
                {...field}                
              />
            )}
          </Field>
          {errors.my_form_field && touched.my_form_field && <div>{errors.my_form_field}</div>}
          <br />
          <ButtonGroup>
            <Button color="success" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
            <Button color="warning" type="reset" disabled={isSubmitting} onClick={handleReset}>
              Reset
            </Button>
          </ButtonGroup>
        </Form>
      )}
    </Formik>);
};
