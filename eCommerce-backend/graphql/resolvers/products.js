import Product from "../models/Product.js";
import apollo from 'apollo-server'
const { ApolloError } = apollo
import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'

import checkAuth from '../../util/checkAuth.js';

const imageHandler = async (image) => {
	const { createReadStream, filename, mimetype, encoding } = await image
	const stream = createReadStream()
	const { dirname } = path
	const __dirname = dirname(fileURLToPath(import.meta.url))
	const pathName = path.join(__dirname, `../../data/images/${filename}`)
	await stream.pipe(fs.createWriteStream(pathName))
	// Change next line before deployment from local host to server i guess?
	return `http://localhost:5000/images/${filename}`
}

const productsResolver = {
	Query: {
		// @desc	Fetch all products
		// @access	Public
		async getProducts() {
			try {
				const products = await Product.find().sort({ createdAt: -1 });
				return products
			} catch (err) {
				throw new Error(err)
			}
		},
		// @desc	Fetch all products
		// @access	Public
		async getProduct(_, { productID }) {
			try {
				const product = await Product.findById(productID)
				if (product) return product
				else throw new ApolloError("Product could not be found", 404)
			} catch (err) {
				throw new Error(err)
			}
		}
	},
	Mutation: {
		// TODO: fix resolver to include User param from User model, probs will use parent param
		createProduct: async (_, { name, image, description, brand, category, price, countInStock, rating, numReviews, user }) => {
			const newProduct = new Product({
				name, image, description, brand, category, price, countInStock, rating, numReviews, user
			})
			const res = await newProduct.save()
			return res
		},
		deleteProduct: async (_, { id }, context) => {
			const adminUser = await checkAuth(context)
			if (!adminUser.isAdmin) throw new Error('User does not have admin status')
			const { ok } = await Product.deleteOne({ _id: id })
			return ok === 1 ? id.toString() : "not deleted"
		},
		editProduct: async (_, { id, name, image, description, brand, category, price, countInStock }, context) => {
			const adminUser = await checkAuth(context)
			if (!adminUser.isAdmin) throw new Error('User does not have admin status')

			if (image) image = await imageHandler(image)

			//Removing all undefined or empty variables
			const editProd = { id, name, image, description, brand, category, price, countInStock }
			Object.keys(editProd).forEach(key => editProd[key] === undefined || editProd[key] === '' ?
				delete editProd[key] :
				{})

			//find and delete product to be updated
			const product = await Product.findOneAndDelete({ _id: id })

			//creating new product based on variables provided
			const updatedProd = Object.keys(product._doc).reduce((newProd, key) => {
				newProd[key] = editProd.hasOwnProperty(key) ? editProd[key] : product[key]
				return newProd
			}, {})
			return await new Product({ ...updatedProd }).save()
		},
		createProduct: async (_, { name, image, description, brand, category, price, countInStock }, context) => {
			const adminUser = await checkAuth(context)
			if (!adminUser.isAdmin) throw new Error('User does not have admin status')

			if (image) image = await imageHandler(image)

			// Finding any null/undefined/empty values
			const createProd = { name, image, description, brand, category, price, countInStock }
			const invalid = Object.values(createProd).find(val => val === '' || val == null)
			if (invalid === '') throw new Error('Please submit a product with all values filled out')

			return await new Product({ ...createProd, user: adminUser }).save()
		},
	}
}

export { productsResolver }
