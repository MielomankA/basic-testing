import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 5, b: 3, action: Action.Add, expected: 8 },
  { a: 1, b: 2, action: Action.Subtract, expected: -1 },
  { a: 2, b: 3, action: Action.Multiply, expected: 6 },
  { a: 10, b: 2, action: Action.Divide, expected: 5 },
  { a: 3, b: 3, action: Action.Exponentiate, expected: 27 },
  { a: 2, b: 2, action: 'invalid', expected: null },
  { a: 2, b: '5', action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should check all cases',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
});
