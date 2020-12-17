import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useQuery } from '@apollo/client';
import { FETCH_PRODUCTS_QUERY } from '../util/queries.js'
import Fuse from "fuse.js";
import { Waypoint } from 'react-waypoint';

import ErrorMessage from '../components/ErrorMessage';
import Product from '../components/Product'
import SearchBox from '../components/SearchBox';
import ProductCarousel from '../components/ProductCarousel.js';
import Meta from '../components/Meta.js';

const HomeScreen = () => {
	const { data, loading, error, fetchMore } = useQuery(FETCH_PRODUCTS_QUERY)
	const loadingData = new Array(12).fill(null)

	//Search functionality
	const [query, setQuery] = useState('')
	let products = data?.getProducts
	if (!loading) {
		const fuseOptions = {
			shouldSort: true, //sorts by closest match
			threshold: 0.4,
			distance: 50,
			keys: ['name', 'description', 'brand']
		}
		const fuse = new Fuse(products, fuseOptions)
		if (query.length > 0) {
			products = fuse.search(query)
			products = products.map(({ item }) => item)
		}
	}


	if (error) return <ErrorMessage variant='danger' error={error} />
	else return (
		<>
			<Meta />
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
					<>
						<ProductCarousel />
						<SearchBox setQuery={setQuery} />
						<Row>
							{products.map((product, i) => (
								<>
									<Col key={product.id} sm={12} md={6} lg={4} xl={3}>
										<Product product={product} />
									</Col>

									{i === data.getProducts.length - 10 && (
										<Waypoint onEnter={() => fetchMore({
											variables: { _id: product.id },
											updateQuery: (prev, { fetchMoreResult }) => {
												if (!fetchMoreResult) return
												return {
													getProducts: [...prev.getProducts, ...fetchMoreResult.getProducts]
												}
											}
										})} />
									)}
								</>
							))}
						</Row>
					</>)
			}
		</>
	)
}

export default HomeScreen
