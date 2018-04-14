/**
 * Defines the React 16 Adapter for Enzyme. 
 *
 * @link http://airbnb.io/enzyme/docs/installation/#working-with-react-16
 * @copyright 2017 Airbnb, Inc.
 */
const enzyme = require('enzyme');
// tslint:disable-next-line:variable-name
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });
