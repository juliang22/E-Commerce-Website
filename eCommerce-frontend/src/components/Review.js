import React, { useState } from 'react'
import { Alert, Button, Col, Form, ListGroup, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import Rating from './Rating'
import { useMutation } from '@apollo/client';

import { FETCH_PRODUCT_QUERY, CREATE_REVIEW } from '../util/queries.js'
import ErrorMessage from './ErrorMessage';

const Review = ({ reviews, user, productID, numReviews }) => {
	const [rating, setRating] = useState(false)
	const [comment, setComment] = useState('')
	const [reviewSubmitted, setReviewSubmitted] = useState(false)

	const [submitReview] = useMutation(CREATE_REVIEW, {
		refetchQueries: [{ query: FETCH_PRODUCT_QUERY, variables: { productID } }],
		onCompleted(success) {
			if (success) setReviewSubmitted(<Alert variant='success'>
				Review submitted successfully
		  </Alert>)
		},
		onError(err) {
			setReviewSubmitted(<ErrorMessage variant='danger' error={err} />)
		}
	})

	const reviewSubmitHandler = (e) => {
		e.preventDefault()
		submitReview({ variables: { comment, rating: Number(rating), productID } })
		setRating(false)
		setComment('')
	}

	return (
		<Row>
			<Col md={6}>
				<h2>Reviews</h2>
				{reviews.length === 0 && <Alert variant='info'>No Reviews</Alert>}
				<ListGroup variant='flush'>
					{reviews && reviews.map(review => (
						<ListGroup.Item key={review._id}>
							<strong>{review.username}</strong>
							<Rating value={review.rating} ></Rating>
							<p>{new Date(review.createdAt).toDateString()}</p>
							<p>{review.comment}</p>
						</ListGroup.Item>
					))}
					<ListGroup.Item>
						<h2>Write a Customer Review</h2>
						{reviewSubmitted}
						{user ? (
							<Form onSubmit={reviewSubmitHandler}>
								<Form.Group controlId='rating'>
									<Form.Label>Rating</Form.Label>
									<Form.Control
										as='select'
										value={rating}
										onChange={(e) => setRating(e.target.value)}
									>
										<option value=''>Select...</option>
										<option value='1'>1 - Poor</option>
										<option value='2'>2 - Fair</option>
										<option value='3'>3 - Good</option>
										<option value='4'>4 - Very Good</option>
										<option value='5'>5 - Excellent</option>
									</Form.Control>
								</Form.Group>
								<Form.Group controlId='comment'>
									<Form.Label>Comment</Form.Label>
									<Form.Control
										as='textarea'
										row='3'
										value={comment}
										onChange={(e) => setComment(e.target.value)}
									></Form.Control>
								</Form.Group>
								<Button
									// disabled={loadingProductReview}
									type='submit'
									variant='primary'
								>
									Submit
                      </Button>
							</Form>
						) : (
								<Alert>
									Please <Link to='/login'>sign in</Link> to write a review{' '}
								</Alert>
							)}
					</ListGroup.Item>
				</ListGroup>
			</Col>
		</Row>
	)
}

export default Review
