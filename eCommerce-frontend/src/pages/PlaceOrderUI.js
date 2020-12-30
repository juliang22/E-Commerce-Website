import React from 'react'
import { Alert, Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
// import { CardElement } from '@stripe/react-stripe-js';

import CheckoutSteps from '../components/CheckoutSteps'
import Meta from '../components/Meta'



const PlaceOrderUI = ({ error, shippingAddress, paymentInfo, cartItems, orderInfo, orderHandler, SDKReady, checkoutError }) => {
	//TODO: Stripe is being buggy so I'm removing it for now
	return (
		<>
			<Meta title='Place Order' />
			{error ? error : false}
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Address: </strong>
								{shippingAddress.address}, {shippingAddress.city}{' '}
								{shippingAddress.postalCode},{' '}
								{shippingAddress.country}
							</p>
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Method</h2>
							<strong>Method: </strong>
							{paymentInfo.payment}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items</h2>
							{Object.keys(cartItems).length === 0 ? (
								<Alert variant='danger'>Your cart is empty</Alert>
							) : (
									<ListGroup variant='flush'>
										{Object.values(cartItems).map((item, index) => (
											<ListGroup.Item key={index}>
												<Row>
													<Col md={1}>
														<Image
															src={item.image}
															alt={item.name}
															fluid
															rounded
														/>
													</Col>
													<Col>
														<Link to={`/product/${item.id}`}>
															{item.name}
														</Link>
													</Col>
													<Col md={4}>
														{item.qty} x ${item.price} = ${item.qty * item.price}
													</Col>
												</Row>
											</ListGroup.Item>
										))}
									</ListGroup>
								)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>${orderInfo.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>${orderInfo.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>${orderInfo.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${orderInfo.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								{checkoutError}
							</ListGroup.Item>
							{/* {orderInfo.payment === 'Paypal' ? */}
							<ListGroup.Item>
								{!SDKReady ? (<Skeleton count={1} height={60} />) : (
									<PayPalButton
										amount={orderInfo.totalPrice}
										onSuccess={orderHandler}
									/>
								)}
								{/* </ListGroup.Item> :
								<form onSubmit={orderHandler}>
									<CardElement
										options={{
											style: {
												base: {
													fontSize: '16px',
													color: '#424770',
													'::placeholder': {
														color: '#aab7c4',
													},
												},
												invalid: {
													color: '#9e2146',
												},
											},
										}}
									/>
									<button type="submit" disabled={!SDKReady}>
										Pay
     								 </button>
								</form>
							}
							<ListGroup.Item> */}
								{/* <Button onClick={testProps}>Test checkout</Button> */}
								<Button style={{ display: 'flex', margin: '0 auto' }} >
									<Link to="/" style={{ color: 'white' }}>Return to Shopping</Link>
								</Button>

							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
			{/* <form onSubmit={orderHandler}>
				<CardElement
					options={{
						style: {
							base: {
								fontSize: '16px',
								color: '#424770',
								'::placeholder': {
									color: '#aab7c4',
								},
							},
							invalid: {
								color: '#9e2146',
							},
						},
					}}
				/>
				<button type="submit" disabled={!SDKReady}>
					Pay
     								 </button>
			</form> */}
		</>
	)
}

export default PlaceOrderUI
