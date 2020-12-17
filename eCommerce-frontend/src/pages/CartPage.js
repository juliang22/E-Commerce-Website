import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';

import ErrorMessage from '../components/ErrorMessage'
import { CartContext } from '../context/CartContext'
import Meta from '../components/Meta';

const CartPage = ({ match, location, history }) => {
	const { cartItems, updateCart } = useContext(CartContext)
	//const qty = Number(location.search.split('=')[1]) //after the ? in the search params (?qty=1) and then splits it and grabs what is after the =

	const checkoutHandler = (name) => {
		history.push('/shipping') // If not logged in, go to login, if they are, go to shipping
	}

	return (
		<Row>
			<Meta title='Cart' />
			<Col md={8}>
				<h1>Shopping Cart</h1>
				{Object.keys(cartItems).length === 0 ?
					<ErrorMessage error={{ message: `Your cart is empty` }}>
						<Link to='/'>Go Back</Link>
					</ErrorMessage> : (
						<ListGroup variant='flush'>
							{Object.values(cartItems).map(item => (
								<ListGroup.Item key={item.name}>
									<Row>
										<Col md={2}>
											<Image src={item.image} alt={item.name} fluid rounded />
										</Col>
										<Col md={6}>
											<Link to={`/product/${item.id}`}>{item.name}</Link>
										</Col>
										<Col md={2}>${ }{item.price}</Col>
										<Col md={2}>
											<Form.Control
												as='select'
												value={item.qty}
												onChange={(e) => updateCart({ ...item, qty: Number(e.target.value) })}
											>
												{Array(item.countInStock).fill(null).map(
													(x, i) => (
														<option key={i + 1} value={i + 1}>
															{i + 1}
														</option>
													)
												)}
											</Form.Control>
											<Col md={2}>
												<Button
													type='button'
													variant='light'
													onClick={() => updateCart({ ...item, qty: 0 })}
												>
													<i className='fas fa-trash' />
												</Button>
											</Col>
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					)

				}
			</Col >
			<Col md={4}>
				<Card>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Subtotal: ({cartItems ? Object.values(cartItems).reduce((acc, itm) => acc + Number(itm.qty), 0) : 0})</h2>
							${cartItems ? Object.values(cartItems).reduce((acc, itm) => acc + itm.price * itm.qty, 0).toFixed(2) : 0}
						</ListGroup.Item>
						<ListGroup.Item>
							<Button
								type='button'
								className='btn-block'
								disabled={Object.values(cartItems).length === 0}
								onClick={checkoutHandler}
							>Proceed to Checkout
							</Button>
						</ListGroup.Item>
					</ListGroup>
				</Card>
			</Col>
			<Col md={8}>

			</Col>
		</Row>
	)
}

export default CartPage
