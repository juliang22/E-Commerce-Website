import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import Skeleton from 'react-loading-skeleton';

import { FETCH_PRODUCT_QUERY } from '../util/queries.js'
import Rating from '../components/Rating'
import ErrorMessage from '../components/ErrorMessage';
import { CartContext } from '../context/CartContext'

const ProductPage = ({ history, match }) => {
	const { data, error } = useQuery(FETCH_PRODUCT_QUERY, {
		variables: {
			productID: match.params.id
		}
	})
	const [qty, setQty] = useState(1)

	const { addToCart } = useContext(CartContext)

	if (error) return <ErrorMessage variant='danger' error={error} />
	else {
		const { getProduct: product } = data || {} //destructures product if data has come through, else if its still loading, product is empty obj
		const addToCartHandler = (e) => {
			history.push(`/cart/${match.params.id}?qty=${qty}`) //redirects to product id with a query string for quantity
			setQty(e.target.value)
			addToCart({ ...product, qty })
		}
		return (
			<>
				<Link to='/' className="btn btn-dark my-3">Go Back</Link>
				<Row>
					<Col col={6} >
						{product?.name ?
							<Image
								onError={i => i.target.style.display = 'none'}
								src={product?.image}
								alt={product?.name}
								fluid
							/>
							:
							<Skeleton width={300} height={250} />
						}
					</Col>
					<Col col={6}>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h3>{product?.name || <Skeleton count={1} height={60} />}</h3>
							</ListGroup.Item>
							{
								product?.rating &&
								<ListGroup.Item>
									<Rating
										value={product?.rating}
										numReviews={`${product?.numReviews} Reviews`}>
									</Rating>
								</ListGroup.Item>
							}
							<ListGroup.Item>{product?.price ? `Price: $${product?.price}` : <Skeleton count={1} />}</ListGroup.Item>
							<ListGroup.Item>{product?.description ? `${product?.description}` : <Skeleton count={1} />}</ListGroup.Item>
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
											<strong>${product?.price}</strong>
										</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>
											Status:
									</Col>
										<Col>
											{product?.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
										</Col>
									</Row>
								</ListGroup.Item>
								{
									product?.countInStock > 0 && (
										<ListGroup.Item>
											<Row>
												<Col>QTY</Col>
												<Col>
													<Form.Control
														as='select'
														value={qty}
														onChange={(e) => setQty(e.target.value)}
													>
														{[...Array(product.countInStock).keys()].map(
															(x) => (
																<option key={x + 1} value={x + 1}>
																	{x + 1}
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
										disabled={product?.countInStock === 0}
										onClick={addToCartHandler}
									> Add to Cart
									</Button>
								</ListGroup.Item>
							</ListGroup>
						</Card>
					</Col>
				</Row>
			</>
		)
	}
}

export default ProductPage
