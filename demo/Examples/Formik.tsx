import * as React from 'react';
import {
  Formik,
  Form,
  Field,
  FieldArray,
  FieldProps,
  FormikProps,
} from 'formik';
import { ButtonGroup, Button } from 'reactstrap';
import Wrapper from './ExampleWrapper';
import { Typeahead, Tokenizer } from '../../src';
import { OptionsObject } from '../../src/types';

export interface BeatleWithId extends OptionsObject {
  id: number;
  name: string;
}
interface Values {
  typeahead_field: string;
  tokenizer_field: number[];
}
const FormikExample = () => {
  const options: BeatleWithId[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Paul' },
    { id: 3, name: 'George' },
    { id: 4, name: 'Ringo' },
  ];
  return (
    <Wrapper title="Formik example">
      <Formik
        initialValues={{ typeahead_field: '', tokenizer_field: [] }}
        onSubmit={(vals, { setSubmitting }) => {
          // tslint:disable-next-line:no-console
          console.log(vals, 'value when submitting');
          setSubmitting(false);
        }}
      >
        {({ errors, touched, isSubmitting, values }: FormikProps<Values>) => (
          <Form>
            <Wrapper
              title="Typeahead"
              code={`
              <Field
                type="text"
                name="typeahead_field"
              >
                {({
                  form: { setFieldValue, setFieldTouched },
                  field: { name },
                }: FieldProps<Values>) => (
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
                      hover: 'active',
                    }}
                  />
                )}
              </Field>
            `}
            >
              <Field type="text" name="typeahead_field">
                {({
                  form: { setFieldValue, setFieldTouched },
                  field: { name },
                }: FieldProps<Values>) => (
                  <Typeahead
                    options={options}
                    filterOption="name"
                    displayOption="name"
                    formInputOption="id"
                    showOptionsWhenEmpty
                    onChange={() => {
                      setFieldTouched(name, true);
                    }}
                    onOptionSelected={(value?: BeatleWithId) => {
                      console.log(value, 'value in onOptionSelected');
                      setFieldValue(name, value && value.id);
                    }}
                    className="inputStyle"
                    customClasses={{
                      results: 'list-group',
                      listItem: 'list-group-item',
                      hover: 'active',
                    }}
                  />
                )}
              </Field>
              {errors.typeahead_field && touched.typeahead_field && (
                <div>{errors.typeahead_field}</div>
              )}
            </Wrapper>
            <br />
            <Wrapper
              title="Tokenizer"
              code={`
            <FieldArray
              name="tokenizer_field"
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
                      remove(values.tokenizer_field.findIndex(id => id === value.id));
                    }}
                    className="inputStyle"
                    customClasses={{
                      results: 'list-group',
                      listItem: 'list-group-item',
                      token: 'badge badge-primary',
                      hover: 'active',
                    }}
                  />
                );
              }}
            </FieldArray>`}
            >
              <FieldArray name="tokenizer_field">
                {({ push, remove }) => {
                  return (
                    <Tokenizer
                      options={options}
                      filterOption="name"
                      displayOption="name"
                      formInputOption="id"
                      showOptionsWhenEmpty
                      onTokenAdd={(value: BeatleWithId) => {
                        // tslint:disable-next-line:no-console
                        console.log(value, 'value in Add');
                        push(value.id);
                      }}
                      onTokenRemove={(value: BeatleWithId) => {
                        // tslint:disable-next-line:no-console
                        console.log(value, 'value in Remove');
                        remove(
                          values.tokenizer_field.findIndex(
                            id => id === value.id
                          )
                        );
                      }}
                      className="inputStyle"
                      customClasses={{
                        results: 'list-group',
                        listItem: 'list-group-item',
                        token: 'badge badge-primary',
                        hover: 'active',
                      }}
                    />
                  );
                }}
              </FieldArray>
              {errors.typeahead_field && touched.typeahead_field && (
                <div>{errors.typeahead_field}</div>
              )}
            </Wrapper>

            <br />
            <ButtonGroup>
              <Button color="success" type="submit" disabled={isSubmitting}>
                Submit to
                <pre>console.log()</pre>
              </Button>
            </ButtonGroup>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default React.memo(FormikExample);
