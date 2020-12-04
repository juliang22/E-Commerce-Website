import gql from 'graphql-tag'

export default gql`
	type Product {
		id: ID!
		name: String!
		image: String!
		description: String!
		brand: String!
		category: String!
		price: Float!
		countInStock: Int!
		rating: Float!
		numReviews: Int!
		user: ID
	}
	type User {
		username: String!
		email: String!
		password: String!
		isAdmin: Boolean!
		token: String!
	}
	type Query {
		getProducts: [Product]
		getProduct(productID: ID!): Product
	}
	type Mutation {
		createProduct(
			name: String!
			image: String!
			description: String!
			brand: String!
			category: String!
			price: Float!
			countInStock: Int!
			rating: Float!
			numReviews: Int!
			user: ID
			): Product!
		login(email: String!, password: String!): User!
		register(
			username: String!
			email: String!
			password: String!
			confirmPassword: String!): User!
		updateUserProfile(
			username: String
			email: String
			password: String
			): User!
	}
`