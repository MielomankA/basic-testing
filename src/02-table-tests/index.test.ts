import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 3, b: 2, action: Action.Subtract, expected: 1 },
  { a: 7, b: 2, action: Action.Subtract, expected: 5 },
  { a: 3, b: 4, action: Action.Subtract, expected: -1 },
  { a: 3, b: 2, action: Action.Multiply, expected: 6 },
  { a: 3, b: 5, action: Action.Multiply, expected: 15 },
  { a: 5, b: 0, action: Action.Multiply, expected: 0 },
  { a: 3, b: 2, action: Action.Divide, expected: 1.5 },
  { a: 0, b: 2, action: Action.Divide, expected: 0 },
  { a: 2, b: 0, action: Action.Divide, expected: Infinity },
  { a: 3, b: 2, action: Action.Exponentiate, expected: 9 },
  { a: 3, b: 3, action: Action.Exponentiate, expected: 27 },
  { a: 3, b: 5, action: Action.Exponentiate, expected: 243 },
  { a: 3, b: 5, action: Action.Exponentiate, expected: 243 },
  { a: 3, b: 5, action: 'invalid', expected: null },
  { a: 3, b: '5', action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should check all cases',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
});
