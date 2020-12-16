import React, { useContext, useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Alert, Button } from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client';

import CheckoutSteps from '../components/CheckoutSteps'
import { AuthContext } from '../context/AuthContext';
import { FETCH_ORDER_QUERY, EDIT_DELIVERY_STATUS } from '../util/queries';
import ErrorMessage from '../components/ErrorMessage';
import Skeleton from 'react-loading-skeleton';
import { CartContext } from '../context/CartContext';


const OrderPage = ({ match, history }) => {
	const { user: loggedInUser } = useContext(AuthContext)

	// If the order was just processed, delete cartItems
	const { deleteCart } = useContext(CartContext)
	const [justOrdered, setJustOrdered] = useState(history.location?.state?.justOrdered)
	useEffect(() => {
		if (justOrdered) {
			deleteCart()
			setJustOrdered(false)
		}
	}, [justOrdered, deleteCart])

	const [error, setError] = useState(false)
	const [editDeliveryStatus] = useMutation(EDIT_DELIVERY_STATUS, {
		refetchQueries: [{ query: FETCH_ORDER_QUERY, variables: { orderID: match.params.id } }],
		onError(err) {
			setError(<ErrorMessage variant='danger' error={err}></ErrorMessage>)
		}
	})
	const deliveryHandler = (orderID) => {
		editDeliveryStatus({ variables: { orderID: _id } })
	}


	const { data, loading, queryError } = useQuery(FETCH_ORDER_QUERY, {
		variables: { orderID: match.params.id }
	})

	if (queryError) return <ErrorMessage variant='danger' error={queryError}></ErrorMessage>

	const { user, orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice, paymentResult, isDelivered, deliveredAt, _id } = data?.getUserOrder[0] || {
		user: "", orderItems: "", shippingAddress: "", paymentMethod: "", taxPrice: "", shippingPrice: "", totalPrice: "", paymentResult: "", isDelivered: "", deliveredAt: "", _id: ""
	} //if loading, data will be an empty obj, full of empty properties


	return (
		<>
			{/* Only logged in user or admins has access to their order */}
			{!loading && !loggedInUser.isAdmin && user._id !== loggedInUser.id ?
				<Redirect to='/' />
				: false
			}
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8}>
					<h1>{loading ? <Skeleton count={1} height={40}></Skeleton> : `Order: ${_id}`}</h1>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<br />
							{loading ?
								<Skeleton count={2} height={20} /> :
								<div style={{ textIndent: '50px' }}>
									<p>{shippingAddress.address}</p>
									<p>{`${shippingAddress.city}, ${shippingAddress.postalCode}`}</p>
									<p>{shippingAddress.country}</p>
								</div >
							}

							{loading ?
								<Skeleton count={1} height={20} /> :
								isDelivered ?
									<Alert variant="success">
										{`Product delivered at: ${deliveredAt}`}
									</Alert> :
									<Alert variant="info">
										Product Shipment: Pending
										</Alert>
							}
						</ListGroup.Item>
						<h2>Payment Method</h2>
						{loading ?
							<Skeleton count={2} height={10} /> :
							(
								<ListGroup.Item>
									<Alert variant="success" style={{ whiteSpace: 'pre-line' }}>
										{`${paymentMethod}: Payment Success! 
										Paid on: ${new Date(paymentResult.paidAt).toDateString()}`}
									</Alert>
								</ListGroup.Item>
							)}

						<ListGroup.Item>
							<h2>Order Items</h2>
							{loading ?
								<Skeleton count={1} height={30} /> :
								(
									<ListGroup variant='flush'>
										{Object.values(orderItems).map(({ product, qtyOrdered }, index) => (
											<ListGroup.Item key={index}>
												<Row>
													<Col md={1}>
														<Image
															src={product.image}
															alt={product.name}
															fluid
															rounded
														/>
													</Col>
													<Col>
														<Link to={`/product/${product.id}`}>
															{product.name}
														</Link>
													</Col>
													<Col md={4}>
														{qtyOrdered} x ${product.price} = ${qtyOrdered * product.price}
													</Col>
												</Row>
											</ListGroup.Item>
										))}
									</ListGroup>
								)
							}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						{loading ?
							<Skeleton count={3} height={10} /> :
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<h2>Order Summary</h2>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Shipping</Col>
										<Col>${shippingPrice}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Tax</Col>
										<Col>${taxPrice}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Total</Col>
										<Col>${totalPrice}</Col>
									</Row>
								</ListGroup.Item>
								{loggedInUser.isAdmin && !isDelivered && (
									< ListGroup.Item >
										{ error}
										<Button
											type='button'
											className='btn btn-block'
											onClick={() => deliveryHandler(_id)}
										>
											Mark As Delivered
										</Button>
									</ListGroup.Item>
								)}
							</ListGroup>
						}
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default OrderPage