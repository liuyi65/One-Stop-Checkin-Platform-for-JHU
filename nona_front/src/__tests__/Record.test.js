import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from "@testing-library/user-event";
import {
    createMemoryRouter,
    RouterProvider,
    useNavigate,
  } from 'react-router-dom';

import Record from '../Record';
import Navbar from 'react-bootstrap/Navbar';


describe("Record", () => {
    it("renders list of service types", () => {
      render(<Record />);
      const serviceTypes = screen.getAllByRole("servicetype");
      expect(serviceTypes.length==5);
      expect(serviceTypes[0]=="Hair Cut");
      expect(serviceTypes[1]=="Perm");
      expect(serviceTypes[2]=="Modeling");
      expect(serviceTypes[3]=="Click to add more");
  
      userEvent.click(serviceTypes[0]);
      const hairCutTab = screen.getByText("Name:");
      expect(hairCutTab).toBeInTheDocument();
  
      // userEvent.click(serviceTypes[1]);
      // const permTab = screen.getByText("AnotherEmployeeName:");
      // expect(permTab).toBeInTheDocument();
    });
  
    it("can search for records", () => {
      render(<Record />);
  
      const searchInput = screen.getByPlaceholderText("Enter");
      const searchButton = screen.getByRole("button", { name: "Search Record" });
  
      userEvent.type(searchInput, "Hair Cut");
      userEvent.click(searchButton);
  
      const hairCutRecord = screen.getByText("2/12/2021");
      expect(hairCutRecord).toBeInTheDocument();
    });
  });
  
  
  
  






