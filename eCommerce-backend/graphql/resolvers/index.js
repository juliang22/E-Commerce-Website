import { productsResolver } from './products.js'

export default {
	Query: {
		...productsResolver.Query
	},
	Mutation: {
		...productsResolver.Mutation
	}
}