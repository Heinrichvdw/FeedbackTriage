import { render, screen } from '@testing-library/react';
import Badge from '@/components/Badge';

describe('Badge', () => {
  it('should render default badge', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('should render sentiment badge with positive color', () => {
    render(<Badge variant="sentiment">positive</Badge>);
    const badge = screen.getByText('positive');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('should render sentiment badge with negative color', () => {
    render(<Badge variant="sentiment">negative</Badge>);
    const badge = screen.getByText('negative');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should render priority badge with P0 color', () => {
    render(<Badge variant="priority">P0</Badge>);
    const badge = screen.getByText('P0');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should render priority badge with P1 color', () => {
    render(<Badge variant="priority">P1</Badge>);
    const badge = screen.getByText('P1');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-orange-100', 'text-orange-800');
  });

  it('should accept custom color class', () => {
    render(<Badge color="bg-blue-500 text-white">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('bg-blue-500', 'text-white');
  });
});

