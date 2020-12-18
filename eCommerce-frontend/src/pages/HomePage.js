import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useQuery } from '@apollo/client';
import { FETCH_ALL_PRODUCT_QUERY, FETCH_PRODUCTS_QUERY } from '../util/queries.js'
import Fuse from "fuse.js";
import { Waypoint } from 'react-waypoint';

import ErrorMessage from '../components/ErrorMessage';
import Product from '../components/Product'
import SearchBox from '../components/Search&SortBox';
import ProductCarousel from '../components/ProductCarousel.js';
import Meta from '../components/Meta.js';

const HomeScreen = () => {
	const loadingData = new Array(12).fill(null)

	const { data, loading, error, fetchMore } = useQuery(FETCH_PRODUCTS_QUERY)
	const products = data?.getProducts

	const { data: allProducts, loading: allProductsLoading } = useQuery(FETCH_ALL_PRODUCT_QUERY)

	//Search functionality
	const [searchResults, setSearchResults] = useState(false)
	const [query, setQuery] = useState('')
	const fuseOptions = {
		shouldSort: true, //sorts by closest match
		threshold: 0.4,
		distance: 50,
		keys: ['name', 'description', 'brand'],
	}

	useEffect(() => {
		setSearchResults(data?.getProducts)
	}, [data])

	const fuse = allProductsLoading ? false : new Fuse(allProducts?.getAllProducts, fuseOptions)
	const queryHandler = (query) => {
		if (fuse) {
			filter ?
				setSearchResults(fuse.search(query).map(({ item }) => item).sort((a, b) => b[filter] - a[filter])) :
				setSearchResults(fuse.search(query).map(({ item }) => item))

		}
		if (query === '') setSearchResults(data?.getProducts)
	}

	const filterHandler = (e) => {
		e.preventDefault()
		const selectedFilter = e.target.value
		setFilter(selectedFilter)
		if (query === '') {
			fetchMore({
				variables: { filter: selectedFilter },
				updateQuery: (prev, { fetchMoreResult }) => {
					if (!fetchMoreResult) return
					return {
						getProducts: [...fetchMoreResult.getProducts]
					}
				}
			})
		} else {
			setSearchResults(fuse.search(query).map(({ item }) => item).sort((a, b) => b[selectedFilter] - a[selectedFilter]))
		}
	}

	const [filter, setFilter] = useState('')

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
						<SearchBox query={query} queryHandler={queryHandler} setQuery={setQuery} filter={filter} filterHandler={filterHandler} />
						<Row>
							{searchResults &&
								searchResults?.map((product, i) => (
									<>
										<Col key={product.id} sm={12} md={6} lg={4} xl={3}>
											<Product product={product} />
										</Col>

										{i === data.getProducts.length - 10 && (
											<Waypoint onEnter={() => fetchMore({
												variables: { _id: product.id, filter },
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
