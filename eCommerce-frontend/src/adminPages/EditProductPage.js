import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom'

import { FETCH_PRODUCT_QUERY, EDIT_PRODUCT } from '../util/queries';
import ErrorMessage from '../components/ErrorMessage'
import FormContainer from '../components/FormContainer'
import ProductForm from '../components/ProductForm'

const EditProducePage = ({ match, history }) => {
	const productID = match.params.id
	const { data, loading } = useQuery(FETCH_PRODUCT_QUERY, { variables: { productID } })

	const [error, setError] = useState(false)

	const [editProduct, editLoading] = useMutation(EDIT_PRODUCT, {
		onCompleted: () => {
			history.push('/admin/productslist')
		},
		onError: (err) => {
			console.log(err);
			setError(<ErrorMessage variant='danger' error={err}></ErrorMessage>)
		}
	})




	// const uploadFileHandler = async (e) => {
	// 	const file = e.target.files[0]
	// 	const formData = new FormData()
	// 	formData.append('image', file)
	// 	setUploading(true)

	// 	try {
	// 		const config = {
	// 			headers: {
	// 				'Content-Type': 'multipart/form-data',
	// 			},
	// 		}

	// 		const { data } = await axios.post('/api/upload', formData, config)

	// 		setImage(data)
	// 		setUploading(false)
	// 	} catch (error) {
	// 		console.error(error)
	// 		setUploading(false)
	// 	}
	// }

	const submitHandler = ({ e, id, name, price, image, brand, category, countInStock, description }) => {
		e.preventDefault()
		image = typeof image === 'string' ? undefined : image
		editProduct({
			variables: { id, name, price, image, brand, category, countInStock, description }
		})
	}



	return (
		<>
			<Link to='/admin/productslist' className='btn btn-light my-3'>
				Go Back
      </Link>
			<FormContainer>
				{loading ?
					<h1>Loading...</h1> :
					<>
						<h1>Edit Product</h1>
						{error}
						<ProductForm data={data} submitHandler={submitHandler}>
						</ProductForm>
					</>
				}
			</FormContainer>
		</>
	)
}

export default EditProducePage