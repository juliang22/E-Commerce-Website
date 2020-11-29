import Product from "../models/Product.js";
import apollo from 'apollo-server'
const { ApolloError } = apollo
// new ApolloError(message, code, additionalProperties);

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
		}
	}
}

export { productsResolver }
