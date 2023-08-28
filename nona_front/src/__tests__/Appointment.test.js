import { handleStatusChange } from '../Appointment';

describe('handleStatusChange', () => {
    it('should update order status on success response', async () => {
      const customer = { order_id: 1 };
      const status = 'Confirmed';
      const data = [{ order_id: 1, status: '2' }, { order_id: 2, status: '1' }];
      const setData = jest.fn();
      const response = { status: 'success' };
      const change_order_state = jest.fn().mockResolvedValue(response);
      const connector = { change_order_state };
      BusServerConnector.getInstance = jest.fn().mockReturnValue(connector);
  
      await handleStatusChange(customer, status, data, setData);
  
      expect(change_order_state).toHaveBeenCalledWith(customer.order_id, status);
  
      const expectedData = [      { order_id: 1, status: '1' },      { order_id: 2, status: '1' },    ];
      expect(setData).toHaveBeenCalledWith(expectedData);
    });
});