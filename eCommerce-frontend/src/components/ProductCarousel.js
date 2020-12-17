
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useQuery } from '@apollo/client'

import { GET_TOP_PRODUCTS } from '../util/queries'


const ProductCarousel = () => {

	const { data, loading } = useQuery(GET_TOP_PRODUCTS)

	return (
		loading ? <h1>Loading..</h1> :
			<Carousel pause='hover' className='bg-dark' style={{ marginBottom: '50px' }} >
				{data?.getTopProducts.map((product) => (
					<Carousel.Item key={product.id}>
						<Link to={`/product/${product.id}`}>
							<Image src={product.image} alt={product.name} className='justify-content-md-center' fluid />
							<Carousel.Caption className='carousel-caption'>
								<h2> {product.name} (${product.price})</h2>
							</Carousel.Caption>
						</Link>
					</Carousel.Item>
				))}
			</Carousel>
	)
}

export default ProductCarousel