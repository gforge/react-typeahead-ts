import { OptionsObject } from '../../src/types';

export const BEATLES = ['John', 'Paul', 'George', 'Ringo'];

export interface ComplexOption extends OptionsObject {
  firstName: string;
  lastName: string;
  nameWithTitle: string;
}

export const BEATLES_COMPLEX: ComplexOption[] = [
  {
    firstName: 'John',
    lastName: 'Lennon',
    nameWithTitle: 'John Winston Ono Lennon MBE',
  },
  {
    firstName: 'Paul',
    lastName: 'McCartney',
    nameWithTitle: 'Sir James Paul McCartney MBE',
  },
  {
    firstName: 'George',
    lastName: 'Harrison',
    nameWithTitle: 'George Harrison MBE',
  },
  {
    firstName: 'Ringo',
    lastName: 'Starr',
    nameWithTitle: 'Richard Starkey Jr. MBE',
  },
];
