import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import ProductForm from '../components/ProductForm'
import { useMutation } from '@apollo/client'

import ErrorMessage from '../components/ErrorMessage'
import { CREATE_PRODUCT, FETCH_PRODUCTS_QUERY } from '../util/queries';
import { Alert } from 'react-bootstrap'
import Meta from '../components/Meta'

const CreateProductPage = ({ history }) => {

	const [error, setError] = useState(false)

	const [createProduct, createLoading] = useMutation(CREATE_PRODUCT, {
		refetchQueries: [{ query: FETCH_PRODUCTS_QUERY }],
		onCompleted: () => {
			history.push('/admin/productslist')
		},
		onError: (err) => {
			console.log(err);
			setError(<ErrorMessage variant='danger' error={err}></ErrorMessage>)
		}
	})

	const createProductHandler = ({ e, name, price, image, brand, category, countInStock, description }) => {
		e.preventDefault()
		if (image == null || image.length === 0) return setError(<Alert variant='danger'>Image not properly uploaded</Alert>)
		image = typeof image === 'string' ? undefined : image
		createProduct({ variables: { name, price, image, brand, category, countInStock, description } })
	}

	return (
		<div>
			<Meta title='Create Product' />
			<Link to='/admin/productslist' className='btn btn-light my-3'>
				Go Back
      			</Link>
			<FormContainer>
				<h1>Create Product</h1>
				{error}
				<ProductForm submitHandler={createProductHandler}></ProductForm>
			</FormContainer>
		</div>
	)
}

export default CreateProductPage
