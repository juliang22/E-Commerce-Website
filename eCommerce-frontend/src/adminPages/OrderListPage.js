import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useQuery } from '@apollo/client';

import { FETCH_ALL_ORDERS_QUERY } from '../util/queries';
import Meta from '../components/Meta';


const OrderListPage = ({ history }) => {

  const { data, loading } = useQuery(FETCH_ALL_ORDERS_QUERY)

  return (
    <>
      <Meta title='Order List' />
      <h1>Orders</h1>
      <Table striped bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading ?
            <h1>Loading...</h1> :
            data.getOrders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.username}</td>
                <td>{order.paymentResult.paidAt}</td>
                <td>${order.totalPrice}</td>
                <td>
                  <i className='fas fa-check' style={{ color: 'green', marginRight: '20px' }}></i>
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  )
}

export default OrderListPage