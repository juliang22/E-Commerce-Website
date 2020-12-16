import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, Alert } from 'react-bootstrap'
import { useMutation, useQuery } from '@apollo/client';
import { PayPalButton } from 'react-paypal-button-v2';
import Skeleton from 'react-loading-skeleton';

import { CartContext } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps'
import { CREATE_ORDER, FETCH_ORDERS_QUERY } from '../util/queries';
import { GET_PAYPAL_CLIENTID } from '../util/queries';
import ErrorMessage from '../components/ErrorMessage';

//<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
const PlaceOrderPage = ({ history }) => {
	const { shippingAddress, paymentInfo, cartItems } = useContext(CartContext)

	const { data, paypalLoading } = useQuery(GET_PAYPAL_CLIENTID)
	const [sdkReady, setSDKReady] = useState(false)
	const [checkoutError, setCheckoutError] = useState(false)
	const [error, setError] = useState(false)

	//Paypal Setup
	useEffect(() => {
		if (data && !paypalLoading) {
			const { getPayPalClientID: clientID } = data
			console.log(clientID);
			const script = document.createElement('script')
			script.type = 'text/javascript'
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}`
			script.async = true
			script.onload = () => setSDKReady(true)
			document.body.appendChild(script)
		}
	}, [data, paypalLoading])

	const testProps = () => history.push({
		pathname: `/order/5fd273c36368f61f197c7a69`,
		state: { justOrdered: true }
	})


	const [createOrder, { loading }] = useMutation(CREATE_ORDER, {
		refetchQueries: [{ query: FETCH_ORDERS_QUERY }],
		onCompleted(result) {
			console.log(result.createOrder)
			history.push({
				pathname: `/order/${result.createOrder._id}`,
				state: { justOrdered: true }
			})
		},
		onError(err) {
			console.log(err)
			setError(
				<ErrorMessage varian='danger' error={err}></ErrorMessage>
			)
		}
	})

	if (Object.keys(shippingAddress).length === 0) {
		history.push('/shipping')
	} else if (Object.keys(paymentInfo).length === 0) {
		history.push('/payment')
	}
	//   Calculate prices
	const addDecimals = (num) => {
		return (Math.round(num * 100) / 100).toFixed(2)
	}

	const orderInfo = {}

	orderInfo.itemsPrice = addDecimals(
		Object.values(cartItems).reduce((acc, item) => acc + item.price * item.qty, 0)
	)
	orderInfo.shippingPrice = addDecimals(orderInfo.itemsPrice > 100 ? 0 : 10)
	orderInfo.taxPrice = addDecimals(Number((0.15 * orderInfo.itemsPrice).toFixed(2)))
	orderInfo.totalPrice = (
		Number(orderInfo.itemsPrice) +
		Number(orderInfo.shippingPrice) +
		Number(orderInfo.taxPrice)
	).toFixed(2)

	const placeOrderHandler = (paymentResult) => {
		if (!paymentResult) setCheckoutError(
			<Alert variant='danger'>Error Completing purchase. Please try again or contact fake@email.com for support</Alert>
		)
		else {
			const orderItems = Object.values(cartItems).map(x => ({ id: x["id"], qty: Number(x.qty) }))
			createOrder({
				variables: {
					orderItems,
					shippingAddress,
					paymentMethod: paymentInfo.payment,
					itemsPrice: Number(orderInfo.itemsPrice),
					shippingPrice: Number(orderInfo.shippingPrice),
					taxPrice: Number(orderInfo.taxPrice),
					totalPrice: Number(orderInfo.totalPrice),
					paymentResult: {
						emailAddress: paymentResult.payer.email_address,
						paidAt: paymentResult.update_time,
						paymentID: paymentResult.id
					}
				}
			})
		}
	}

	if (loading) return <h1>Submitting Order...</h1>
	return (
		<>
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
							<ListGroup.Item>
								{!sdkReady ? (<Skeleton count={1} height={60} />) : (
									<PayPalButton
										amount={orderInfo.totalPrice}
										onSuccess={placeOrderHandler}
									/>
								)}
							</ListGroup.Item>
							<ListGroup.Item>
								<Button onClick={testProps}>Test checkout</Button>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default PlaceOrderPage