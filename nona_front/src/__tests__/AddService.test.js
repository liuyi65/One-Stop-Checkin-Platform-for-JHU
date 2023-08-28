import AddService from '../AddService';
import BusServerConnector from '../ServerConnector';
import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';


import { MemoryRouter } from 'react-router-dom';
import * as router from 'react-router'
const navigate = jest.fn()

beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

test('renders add service page', () => {
  render(<AddService />);
  const serviceElement = screen.getByTestId('AddService');
  expect(serviceElement).toBeInTheDocument();
});

test('allows user to enter service name', () => {
  render(<AddService />);
  const serviceInput = screen.getByLabelText('Main Service*');
  fireEvent.change(serviceInput, { target: { value: 'test service' } });
  expect(serviceInput.value).toBe('test service');
});

test('allows user to select day', () => {
  render(<AddService />);
  const dayInput = screen.getByLabelText('Weekday*');
  fireEvent.change(dayInput, { target: { value: 'Monday' } });
  expect(dayInput.value).toBe('Monday');
});

test('allows user to add time and slots', () => {
  render(<AddService />);
  const addTimeButton = screen.getByTestId('addtime');
  fireEvent.click(addTimeButton);
  const slotInput = screen.getByTestId('testslot');
  fireEvent.change(slotInput, { target: { value: '10' } });
  const timeInputs = screen.getByTestId('testtime');
  fireEvent.change(timeInputs, { target: { value: '09:00' } });

  expect(timeInputs.value).toBe('09:00');

  expect(slotInput.value).toBe('10');
});

test('allows user to enter price', () => {
  render(<AddService />);
  const priceInput = screen.getByLabelText('Price*');
  fireEvent.change(priceInput, { target: { value: '10' } });
  expect(priceInput.value).toBe('10');
});

test('allows user to enter info', () => {
  render(<AddService />);
  const infoInput = screen.getByLabelText('Service Information');
  fireEvent.change(infoInput, { target: { value: 'test info' } });
  expect(infoInput.value).toBe('test info');
});


test('should call the onSubmit function when the form is submitted', async () => {
  // const navigateMock = jest.fn();

  let connector = BusServerConnector.getInstance();
  const mock = jest.spyOn(connector, 'create_service');  // spy on foo
  mock.mockImplementation((service_name, service_description, base_price, service_time)=>true);  // replace implementation
  const mock1 = jest.spyOn(connector, 'refresh_actual_time_slots'); 
  mock1.mockImplementation((week_ahead)=>true);  // replace implementation
  render(
  <MemoryRouter>
  <AddService />
  </MemoryRouter>);

  const serviceInput = screen.getByLabelText('Main Service*');
  const dayInput = screen.getByLabelText('Weekday*');
  const addTimeButton = screen.getByTestId('addtime');
  const priceInput = screen.getByLabelText('Price*');
  const infoInput = screen.getByLabelText('Service Information');

  const submitButton = screen.getByRole('button', { name: 'Save Changes' })

  fireEvent.change(serviceInput, { target: { value: 'Test Service' } });
  fireEvent.change(dayInput, { target: { value: 'Monday' } });
  fireEvent.change(priceInput, { target: { value: '10.0' } });
  fireEvent.change(infoInput, { target: { value: 'Test Info' } });
  fireEvent.click(addTimeButton);
  const slotInput = screen.getByTestId('testslot');
  fireEvent.change(slotInput, { target: { value: '10' } });


  const timeInputs = screen.getByTestId('testtime');
  fireEvent.change(timeInputs, { target: { value: '09:00' } });


  fireEvent.submit(submitButton);

  await waitFor(() => {
    expect(connector.create_service).toHaveBeenCalledWith('Test Service', 'Test Info', '10.0', [
      { hour: '09', minute: '00', weekday: 'Monday', slots: '10' },
    ]);
    expect(connector.create_service).toHaveBeenCalledTimes(1);
    expect(connector.refresh_actual_time_slots).toHaveBeenCalledWith(2);
    expect(connector.refresh_actual_time_slots).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('../SubmitSuccess');
  });
  mock.mockRestore(); 
});