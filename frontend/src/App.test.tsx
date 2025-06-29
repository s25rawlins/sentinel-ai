import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the API service
jest.mock('./services/api');

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    renderWithRouter(<App />);
  });

  test('renders navigation component', () => {
    renderWithRouter(<App />);
    // Check for navigation elements that should be present
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders main content area', () => {
    renderWithRouter(<App />);
    // Check for main content container
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
  });

  test('has proper document title', () => {
    renderWithRouter(<App />);
    expect(document.title).toContain('SentinelAI');
  });
});
