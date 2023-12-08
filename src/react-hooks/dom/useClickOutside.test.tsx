import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { useClickOutside } from './useClickOutside';
import { useRef } from 'react';

const renderComp = (Comp: () => JSX.Element) => {
  render(<Comp />);
};

describe('useClickOutside tests', () => {
  test('inside', async () => {
    let clickedOutside = false;

    renderComp(() => {
      const targetRef = useRef<HTMLDivElement>(null);
      useClickOutside(targetRef, () => {
        clickedOutside = true;
      });
      return (
        <div>
          <div ref={targetRef} id="target">
            Target
          </div>
          <div id="other">Other</div>
        </div>
      );
    });

    expect(clickedOutside).toBe(false);

    await waitFor(() => {
      (document.querySelector('#target') as HTMLDivElement).click();
      expect(clickedOutside).toBe(false);
      (document.querySelector('#other') as HTMLDivElement).click();
      expect(clickedOutside).toBe(true);
    });
  });
});
