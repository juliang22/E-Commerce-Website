import React, { useState } from 'react'
import { Table, Button, Row, Col, Alert } from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client'
// import { Waypoint } from 'react-waypoint'

import ErrorMessage from '../components/ErrorMessage'
import { FETCH_ALL_PRODUCT_QUERY, DELETE_PRODUCT } from '../util/queries'
import Meta from '../components/Meta'

const ProductListScreen = ({ history, match }) => {

	const { data } = useQuery(FETCH_ALL_PRODUCT_QUERY)
	const [error, setError] = useState(false)
	const [message, setMessage] = useState(false)
	const [deleteProduct] = useMutation(DELETE_PRODUCT, {
		update(cache, { data }) {
			if (data.deleteUser === "not deleted") {
				setMessage("Problem deleting user")
				return
			}
			const { getProducts: prevProducts } = cache.readQuery({
				query: FETCH_ALL_PRODUCT_QUERY
			});

			cache.writeQuery({
				query: FETCH_ALL_PRODUCT_QUERY,
				data: {
					getProducts: prevProducts.filter(prod => prod.id !== data.deleteProduct)
				}
			})
		},
		onCompleted() {
			setMessage(<Alert
				variant="success"
				onClose={() => setMessage(false)}
				style={{ width: '30%' }}
				className='float-right'
				dismissible>Product Deleted
				</Alert>)
		},
		onError(err) {
			setError(err)
		}
	})

	const deleteHandler = (id) => {
		if (window.confirm('Are you sure')) {
			deleteProduct({ variables: { id } })
		}
	}

	const createProductHandler = () => {
		history.push('/admin/createproduct')
	}
	const editProductHandler = (id) => {
		history.push(`/admin/product/edit/${id}`)
	}

	return (
		<>
			<Meta title='Product List' />
			{error && <ErrorMessage variant='danger' error={error} />}
			<Row className='align-items-center'>
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className='text-right'>
					<Button className='my-3' onClick={createProductHandler}>
						<i className='fas fa-plus'></i> Create Product
          			</Button>
				</Col>
			</Row>
			<Table striped bordered hover responsive className='table-sm'>
				<thead>
					<tr>
						<th>ID</th>
						<th>NAME</th>
						<th>PRICE</th>
						<th>CATEGORY</th>
						<th>BRAND</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{data?.getAllProducts.map((product, i) => (
						<tr key={product.id}>
							<td>{product.id}</td>
							<td>{product.name}</td>
							<td>${product.price}</td>
							<td>{product.category}</td>
							<td>{product.brand}</td>
							<td>
								<Button variant='light' className='btn-sm' onClick={() => editProductHandler(product.id)}>
									<i className='fas fa-edit'></i>
								</Button>
								<Button
									variant='danger'
									className='btn-sm'
									onClick={() => deleteHandler(product.id)}
								>
									<i className='fas fa-trash'></i>
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
			{/* { (
				<Waypoint onEnter={() => fetchMore({
					variables: { _id: data?.getProducts[data.getProducts.length - 1].id },
					updateQuery: (prev, { fetchMoreResult }) => {
						if (!fetchMoreResult) return
						return {
							getProducts: [...prev.getProducts, ...fetchMoreResult.getProducts]
						}
					}
				})} />
			)} */}
			{message}
		</>
	)
}

export default ProductListScreen