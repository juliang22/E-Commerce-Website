import React, { useState, useEffect } from 'react'
import { Form, Button, Card } from 'react-bootstrap'

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)


const ProductForm = ({ data, submitHandler }) => {
	const [name, setName] = useState(data?.getProduct?.name || '')
	const [price, setPrice] = useState(data?.getProduct?.price || 0)
	const [image, setImage] = useState(data?.getProduct?.image || '')
	const [files, setFiles] = useState([]) // for handling fileupload
	const [brand, setBrand] = useState(data?.getProduct?.brand || '')
	const [category, setCategory] = useState(data?.getProduct?.category || '')
	const [countInStock, setCountInStock] = useState(data?.getProduct?.countInStock || 0)
	const [description, setDescription] = useState(data?.getProduct?.description || '')

	useEffect(() => {
		if (files.length !== 0) setImage(false)
	}, [files])

	return (
		<div>
			<Form onSubmit={(e) => submitHandler({ e, id: data?.getProduct.id, name, price: Number(price), image: files[0]?.file, brand, category, countInStock: Number(countInStock), description })}>
				<Form.Group controlId='name'>
					<Form.Label>Name</Form.Label>
					<Form.Control
						type='name'
						placeholder={data?.getProduct?.name || 'Enter name'}
						value={name}
						onChange={(e) => setName(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group controlId='price'>
					<Form.Label>Price</Form.Label>
					<Form.Control
						type='number'
						placeholder={data?.getProduct.price || 'Enter price'}
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					></Form.Control>
				</Form.Group>
				{image ?
					<Card.Img src={image} variant='top'></Card.Img> :
					false
				}

				<FilePond
					files={files}
					onupdatefiles={setFiles}
					// onupdatefiles={file => setFiles(file[0]?.file)}
					allowMultiple={false}
					name="files"
					labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
				/>

				<Form.Group controlId='brand'>
					<Form.Label>Brand</Form.Label>
					<Form.Control
						type='text'
						placeholder={data?.getProduct.brand || 'Enter brand'}
						value={brand}
						onChange={(e) => setBrand(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group controlId='countInStock'>
					<Form.Label>Count In Stock</Form.Label>
					<Form.Control
						type='number'
						placeholder={data?.getProduct.countInStock || 'Enter countInStock'}
						value={countInStock}
						onChange={(e) => setCountInStock(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group controlId='category'>
					<Form.Label>Category</Form.Label>
					<Form.Control
						type='text'
						placeholder={data?.getProduct.category || 'Enter category'}
						value={category}
						onChange={(e) => setCategory(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group controlId='description'>
					<Form.Label>Description</Form.Label>
					<Form.Control
						type='text'
						placeholder={data?.getProduct.description || 'Enter description'}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Button type='submit' variant='primary'>
					Update
            		</Button>
			</Form>
		</div>
	)
}

export default ProductForm
