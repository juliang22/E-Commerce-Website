import { productsResolver } from './products.js'
import { usersResolver } from './users.js'
import { ordersResolver } from './orders.js'
import { PayPalResolver } from './PayPal.js'
import {
	GraphQLUpload, // The GraphQL "Upload" Scalar
} from 'graphql-upload'

export default {
	Upload: GraphQLUpload, //For image uploads
	Query: {
		...productsResolver.Query,
		...PayPalResolver.Query,
		...ordersResolver.Query,
		...usersResolver.Query
	},
	Mutation: {
		...productsResolver.Mutation,
		...usersResolver.Mutation,
		...ordersResolver.Mutation
	}
}