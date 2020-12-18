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
	console.log("DIRNAME", __dirname);
	return `${process.env.HEROKU_HOST}/images/${filename}`
}

const productsResolver = {
	Query: {
		getAllProducts: async () => await Product.find({}),
		async getProducts(_, { _id, filter }) {
			filter = filter === '' ? false : filter
			try {
				//if a user normally scrolls down and no filter is set
				if (_id && !filter) return await Product.find({ _id: { $gt: _id } }).limit(8)
				//inital query if a user sets a filter
				else if (!_id && filter) return await Product.find({}).sort({ [filter]: -1 }).limit(25)
				//if a user sets a filter then scrolls down
				else if (_id && filter) {
					const prod = await Product.findOne({ _id })
					return await Product.find({ [filter]: { $lt: prod[filter] } }).sort({ [filter]: -1 }).limit(8)
				}
				// query on page load
				else return await Product.find({}).sort({ _id }).limit(25)
			} catch (err) {
				throw new Error(err)
			}
		},
		async getTopProducts() {
			return await Product.find({}).sort({ rating: -1 }).limit(3)
		},
		async getProduct(_, { productID }) {
			try {
				const product = await Product.findById(productID).populate('reviews')
				if (product) return product
				else throw new ApolloError("Product could not be found", 404)
			} catch (err) {
				throw new Error(err)
			}
		}
	},
	Mutation: {
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
		createReview: async (_, { rating, comment, productID }, context) => {
			let user = await checkAuth(context)
			let product = await Product.findOne({ _id: productID }).populate('user').populate('reviews')
			if (!product) throw new Error('Product not found')

			const alreadyReviewed = product.reviews.find(r => r.user._id.toString() === user._id.toString())
			if (alreadyReviewed) throw new Error('You have already submitted a review for this product')

			const review = {
				username: user.username,
				rating,
				comment,
				user: user._id,
				createdAt: new Date().toISOString()
			}
			product.reviews.push(review)
			product.numReviews = product.reviews.length
			product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
			await product.save()
			return true
		}
	}
}

export { productsResolver }
