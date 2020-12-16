import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useQuery } from '@apollo/client';
import { FETCH_PRODUCTS_QUERY } from '../util/queries.js'
import Fuse from "fuse.js";

import ErrorMessage from '../components/ErrorMessage';
import Product from '../components/Product'
import SearchBox from '../components/SearchBox';


const HomeScreen = () => {
	const { data, loading, error } = useQuery(FETCH_PRODUCTS_QUERY)
	const loadingData = new Array(12).fill(null)

	const [query, setQuery] = useState('')
	let products = data?.getProducts

	if (!loading) {
		const fuseOptions = {
			shouldSort: true,
			threshold: 0.4,
			location: 0,
			distance: 50,
			maxPatternLength: 12,
			keys: ['name']
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
						<SearchBox setQuery={setQuery} />
						<Row>
							{products.map(product => (
								<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
									{console.log(product)}
									<Product product={product} />
								</Col>
							))}
						</Row>
					</>)
			}
		</>
	)
}

export default HomeScreen
