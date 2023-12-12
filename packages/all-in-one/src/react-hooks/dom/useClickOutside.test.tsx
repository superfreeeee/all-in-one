import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useClickOutside } from './useClickOutside';
import { useRef } from 'react';

const renderComp = (Comp: () => JSX.Element) => {
  render(<Comp />);
};

describe('useClickOutside tests', () => {
  test('inside', () => {
    let clickedOutside = false;

    renderComp(() => {
      const targetRef = useRef<HTMLDivElement>(null);
      useClickOutside(targetRef, () => {
        clickedOutside = true;
      });
      return (
        <div>
          <div ref={targetRef} data-testid="target" id="target">
            Target
          </div>
          <div data-testid="other" id="other">
            Other
          </div>
        </div>
      );
    });

    const target = screen.getByTestId('target');
    const other = screen.getByTestId('other');

    expect(clickedOutside).toBe(false);

    // click target
    fireEvent.click(target);
    expect(clickedOutside).toBe(false);

    // click other
    fireEvent.click(other);
    expect(clickedOutside).toBe(true);
  });
});
