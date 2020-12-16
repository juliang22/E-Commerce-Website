import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import Skeleton from 'react-loading-skeleton';

const Product = ({ product }) => {
	return (
		<Card className='my-3 p-3 rounded'>
			<Link to={`/product/${product?.id}`}>
				{product?.image ?
					<Card.Img src={product?.image} variant='top'>
					</Card.Img> :
					<Skeleton width={205} duration={2} height={205} />
				}
			</Link>
			<Card.Body>
				<Link to={`/product/${product?.id}`}>
					<Card.Title as='div'> <strong>{product?.name || <Skeleton count={2} />}</strong></Card.Title>
				</Link>
				{
					product?.rating &&
					<Card.Text as='div'>
						<Rating
							value={product?.rating}
							numReviews={`${product?.numReviews} reviews`}
						/>
					</Card.Text>
				}
				<Card.Text as='h3'> {product?.price ? `$${product?.price}` : <Skeleton count={1} />}</Card.Text>
			</Card.Body>
		</Card >
	)
}

export default Product
