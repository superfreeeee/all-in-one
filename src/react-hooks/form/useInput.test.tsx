import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useInput } from './useInput';

const renderComp = (Comp: () => JSX.Element) => {
  return render(<Comp />);
};

describe('useInput tests', () => {
  test('MVP', async () => {
    let resetFn;
    renderComp(() => {
      const [value, onInputChange, { reset }] = useInput('init');
      resetFn = reset;
      return <input data-testid="input" type="text" value={value} onChange={onInputChange} />;
    });
    const input = screen.getByTestId('input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'other' } });
    expect(input.value).toBe('other');

    await waitFor(() => {
      // test reset
      resetFn();
      expect(input.value).toBe('init');
    });
  });

  test('default value', () => {
    renderComp(() => {
      const [value, onInputChange] = useInput();
      return <input data-testid="input" type="text" value={value} onChange={onInputChange} />;
    });
    const input = screen.getByTestId('input') as HTMLInputElement;
    expect(input.value).toBe('');
  });
});
