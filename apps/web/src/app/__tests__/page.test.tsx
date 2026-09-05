import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('proposition index', () => {
  it('renders all ten propositions of Book I', () => {
    render(<Home />);
    expect(screen.getAllByTestId('proposition')).toHaveLength(10);
  });

  it('marks the three shipped propositions as playable', () => {
    const { container } = render(<Home />);
    expect(container.querySelectorAll('[data-status="playable"]')).toHaveLength(3);
  });

  it('describes each proposition in language a child could read', () => {
    render(<Home />);
    expect(
      screen.getByText('Build a triangle whose three sides are all exactly the same length.'),
    ).toBeInTheDocument();
  });

  it('distinguishes constructions from theorems', () => {
    render(<Home />);
    expect(screen.getAllByText(/^Build it/)).toHaveLength(5);
    expect(screen.getAllByText(/^Prove it/)).toHaveLength(5);
  });
});
