import React from 'react';
import { render, screen } from '@testing-library/react';
import Input from './input';

test('renders learn react link', () => {
  render(<Input />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
