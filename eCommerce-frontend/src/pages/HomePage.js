import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { useQuery } from '@apollo/client';
import { FETCH_PRODUCTS_QUERY } from '../util/queries.js'

import ErrorMessage from '../components/ErrorMessage';
import Product from '../components/Product'


const HomeScreen = () => {
	const { data, loading, error } = useQuery(FETCH_PRODUCTS_QUERY)
	const loadingData = new Array(12).fill(null)

	if (error) return <ErrorMessage variant='danger' error={error} />
	else return (
		<>
			{loading ?
				(<Row>
					{loadingData.map((box, i) => (
						<Col key={i} sm={12} md={6} lg={4} xl={3}>
							<Product product={box} />
						</Col>
					))}
				</Row>
				) :
				(
					<Row>
						{data.getProducts &&
							data.getProducts.map(product => (
								<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
									<Product product={product} />
								</Col>
							))}
					</Row>
				)
			}
		</>
	)
}

export default HomeScreen
