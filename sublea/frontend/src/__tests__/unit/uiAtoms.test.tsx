/**
 * Unit Tests — UI Components

 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

//  Badge 

describe('<Badge />', () => {
  it('renders its children text', () => {
    // Arrange & Act
    render(<Badge>Active</Badge>);

    // Assert
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('uses the "neutral" variant by default', () => {
    // Arrange & Act
    const { container } = render(<Badge>Status</Badge>);
    const span = container.querySelector('span');

    // Assert — neutral class is applied
    expect(span?.className).toContain('badge-neutral');
  });

  it('applies the "active" variant classes when specified', () => {
    // Arrange & Act
    const { container } = render(<Badge variant="active">Live</Badge>);
    const span = container.querySelector('span');

    // Assert — green colours from VARIANT_CLASSES
    expect(span?.className).toContain('bg-green-100');
  });

  it('applies the "draft" variant classes when specified', () => {
    const { container } = render(<Badge variant="draft">Draft</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('bg-yellow-100');
  });

  it('applies the "expired" variant classes when specified', () => {
    const { container } = render(<Badge variant="expired">Expired</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('bg-gray-100');
  });

  it('merges an extra className onto the span', () => {
    const { container } = render(<Badge className="my-custom-class">Tag</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('my-custom-class');
  });
});

//  EmptyState 

describe('<EmptyState />', () => {
  const icon = <svg data-testid="test-icon" />;

  it('renders the title', () => {
    // Arrange & Act
    render(
      <EmptyState icon={icon} title="No listings yet" description="Create one now" />
    );

    // Assert
    expect(screen.getByText('No listings yet')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(
      <EmptyState icon={icon} title="Empty" description="Nothing to see here" />
    );
    expect(screen.getByText('Nothing to see here')).toBeInTheDocument();
  });

  it('renders the icon node', () => {
    render(
      <EmptyState icon={icon} title="Empty" description="desc" />
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders an optional action node when provided', () => {
    const action = <button>Create listing</button>;
    render(
      <EmptyState icon={icon} title="Empty" description="desc" action={action} />
    );
    expect(screen.getByRole('button', { name: 'Create listing' })).toBeInTheDocument();
  });

  it('does NOT render action section when prop is omitted', () => {
    const { queryByRole } = render(
      <EmptyState icon={icon} title="Empty" description="desc" />
    );
    expect(queryByRole('button')).not.toBeInTheDocument();
  });

  it('adds glass-panel class when glassPanel=true', () => {
    const { container } = render(
      <EmptyState icon={icon} title="Empty" description="desc" glassPanel />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('glass-panel');
  });

  it('omits glass-panel class when glassPanel=false (default)', () => {
    const { container } = render(
      <EmptyState icon={icon} title="Empty" description="desc" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).not.toContain('glass-panel');
  });
});

//  LoadingSpinner 

describe('<LoadingSpinner />', () => {
  // Helper to get the class string — SVG className is SVGAnimatedString in jsdom,
  // so getAttribute('class') is the reliable way to read it.
  function getSvgClass(container: HTMLElement): string {
    return container.querySelector('svg')?.getAttribute('class') ?? '';
  }

  it('renders an SVG element', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('has the animate-spin class by default', () => {
    const { container } = render(<LoadingSpinner />);
    expect(getSvgClass(container)).toContain('animate-spin');
  });

  it('applies the default size class h-4 w-4', () => {
    const { container } = render(<LoadingSpinner />);
    const cls = getSvgClass(container);
    expect(cls).toContain('h-4');
    expect(cls).toContain('w-4');
  });

  it('applies a custom className override', () => {
    const { container } = render(<LoadingSpinner className="h-8 w-8" />);
    expect(getSvgClass(container)).toContain('h-8');
  });

  it('applies a custom colorClass override', () => {
    const { container } = render(<LoadingSpinner colorClass="text-blue-500" />);
    expect(getSvgClass(container)).toContain('text-blue-500');
  });

  it('defaults to text-white color class', () => {
    const { container } = render(<LoadingSpinner />);
    expect(getSvgClass(container)).toContain('text-white');
  });
});
