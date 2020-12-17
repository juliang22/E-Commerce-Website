import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form, Alert } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import Skeleton from 'react-loading-skeleton';

import { FETCH_PRODUCT_QUERY } from '../util/queries.js'
import Rating from '../components/Rating'
import ErrorMessage from '../components/ErrorMessage';
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import Review from '../components/Review.js';
import Meta from '../components/Meta.js';

const ProductPage = ({ history, match }) => {
	const productID = match.params.id
	const { data, loading, queryError } = useQuery(FETCH_PRODUCT_QUERY, {
		variables: {
			productID
		}
	})
	const { name, image, rating, price, description, numReviews, countInStock, reviews } = data?.getProduct || {
		name: "", image: "", rating: "", price: "", description: "", numReviews: "", countInStock: "", reviews: {}
	} //if loading, data will be an empty obj, full of empty properties so that there isn't an undefined error and I don't have to put product?.<field> everywhere.

	const [qty, setQty] = useState(1)
	const [error, setError] = useState(null)

	const { addToCart, cartItems } = useContext(CartContext)
	const { user } = useContext(AuthContext)

	if (queryError) setError(<ErrorMessage variant="danger" error={ErrorMessage}></ErrorMessage>)
	else {
		const quantityExceedStock = () => {
			if (cartItems && Object.keys(cartItems).length && countInStock - ~~cartItems[name]?.qty === 0) return true
			else return false
		}
		const addToCartHandler = (e) => {
			if (!user) setError(
				<Alert variant='danger' style={{ textAlign: 'center' }
				} error={{ message: "" }
				} >
					<Link to='/login'> Log In </Link> or < Link to='/register' > Register  </Link >
					<br />
						To Add Items To Cart
				</Alert >
			)
			else {
				history.push(`/cart/${productID}?qty=${qty}`) //redirects to product id with a query string for quantity
				setQty(e.target.value)
				addToCart({ ...data?.getProduct, qty })
			}
		}
		return (
			<>
				<Meta title={name} description={description} />
				<Link to='/' className="btn btn-dark my-3">Go Back</Link>
				<Row>
					<Col col={6} >
						{name ?
							<Image
								onError={i => i.target.style.display = 'none'}
								src={image}
								alt={name}
								fluid
							/>
							:
							<Skeleton width={300} height={250} />
						}
					</Col>
					<Col col={6}>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h3>{name || <Skeleton count={1} height={60} />}</h3>
							</ListGroup.Item>
							{
								rating &&
								<ListGroup.Item>
									<Rating
										value={rating}
										numReviews={`${numReviews} Reviews`}>
									</Rating>
								</ListGroup.Item>
							}
							<ListGroup.Item>{price ? `Price: $${price}` : <Skeleton count={1} />}</ListGroup.Item>
							<ListGroup.Item>{description ? `${description}` : <Skeleton count={1} />}</ListGroup.Item>
						</ListGroup>
					</Col>
					<Col md={3}>
						<Card>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<Row>
										<Col>
											Price:
									</Col>
										<Col>
											<strong>${price}</strong>
										</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>
											Status:
									</Col>
										<Col>
											{countInStock > 0 ?
												quantityExceedStock() ?
													'Full Quantity in Cart' :
													'In Stock' :
												'Out of Stock'}
										</Col>
									</Row>
								</ListGroup.Item>
								{
									(countInStock > 0 && !quantityExceedStock()) && (
										<ListGroup.Item>
											<Row>
												<Col>QTY</Col>
												<Col>
													<Form.Control
														as='select'
														value={qty}
														onChange={(e) => setQty(e.target.value)}
													>
														{Array(countInStock - ~~cartItems[name]?.qty).fill(null).map(
															(x, i) => (
																<option key={i + 1} value={i + 1}>
																	{i + 1}
																</option>
															)
														)}
													</Form.Control>
												</Col>
											</Row>
										</ListGroup.Item>
									)
								}
								<ListGroup.Item>
									<Button
										className="btn-block"
										type='button'
										disabled={countInStock === 0 || quantityExceedStock()}
										onClick={(e) => addToCartHandler(e, name)}
									> Add to Cart
									</Button>
								</ListGroup.Item>
							</ListGroup>
							{error}
						</Card>
					</Col>
				</Row>
				{!loading &&
					<Review reviews={reviews} user={user} productID={productID} numReviews={`${numReviews} Reviews`} />}
			</>
		)
	}
}

export default ProductPage
