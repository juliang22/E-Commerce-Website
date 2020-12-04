import { productsResolver } from './products.js'
import { usersResolver } from './users.js'

export default {
	Query: {
		...productsResolver.Query
	},
	Mutation: {
		...productsResolver.Mutation,
		...usersResolver.Mutation
	}
}