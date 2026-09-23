import {
  amount,
  overlaps,
  splitBill,
  tipAmount,
} from '../src/utils/calculations';
import { dishes } from '../src/data/menu';
import { masterclasses } from '../src/data/masterclasses';

test('splits all cents fairly without losing the remainder', () => {
  expect(splitBill(10, 3)).toEqual([3.34, 3.33, 3.33]);
  expect(splitBill(0.02, 4)).toEqual([0.01, 0.01, 0, 0]);
  expect(splitBill(240, 4)).toEqual([60, 60, 60, 60]);
});
test('parses comma decimals and rejects malformed amounts', () => {
  expect(amount('12,50')).toBe(12.5);
  for (const input of [
    '',
    '-1',
    'NaN',
    'Infinity',
    '1.234',
    '1e3',
    '10000001',
  ]) {
    expect(amount(input)).toBeNull();
  }
  expect(amount('0')).toBe(0);
});
test('rounds tips to cents', () => {
  expect(tipAmount(42.55, 15)).toBe(6.38);
  expect(tipAmount(240, 10)).toBe(24);
});
test('blocks overlapping two-hour reservations but permits consecutive visits', () => {
  expect(overlaps('2026-10-04T18:00:00', '2026-10-04T19:59:00')).toBe(true);
  expect(overlaps('2026-10-04T18:00:00', '2026-10-04T20:00:00')).toBe(false);
  expect(overlaps('2026-10-04T18:00:00', '2026-10-05T18:00:00')).toBe(false);
});
test('contains the full supplied menu and eight two-paragraph experiences', () => {
  expect(dishes).toHaveLength(24);
  expect(new Set(dishes.map(d => d.id)).size).toBe(24);
  for (const category of new Set(dishes.map(d => d.category))) {
    expect(dishes.filter(d => d.category === category)).toHaveLength(6);
  }
  expect(masterclasses).toHaveLength(8);
  expect(masterclasses.every(m => m.paragraphs.length === 2)).toBe(true);
});
