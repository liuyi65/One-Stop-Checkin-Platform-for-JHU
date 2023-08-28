import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompanyPage from '../CompanyPage';

describe('CompanyPage', () => {
  test('renders main page link', () => {
    render(<CompanyPage />);
    const linkElement = screen.getByText(/Main Page/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders record link', () => {
    render(<CompanyPage />);
    const linkElement = screen.getByText(/Records/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders logo', () => {
    render(<CompanyPage />);
    const logoElement = screen.getByAltText(/logo/i);
    expect(logoElement).toBeInTheDocument();
  });

  test('renders submit button', () => {
    render(<CompanyPage />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('renders title', () => {
    render(<CompanyPage />);
    const titleElement = screen.getByText(/One Stop Check-in Application/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(<CompanyPage />);
    const searchInput = screen.getByPlaceholderText(/Text information/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('renders routes', () => {
    render(<CompanyPage />);
    const mainPageRoute = screen.getByText(/Main Page/i).closest('a').getAttribute('href');
    const recordRoute = screen.getByText(/Records/i).closest('a').getAttribute('href');
    const addServiceRoute = screen.getByText(/Click To Add New Category/i).closest('a').getAttribute('href');
    expect(mainPageRoute).toEqual('/MainPage');
    expect(recordRoute).toEqual('/Record');
    expect(addServiceRoute).toEqual('/AddService');
  });
});




