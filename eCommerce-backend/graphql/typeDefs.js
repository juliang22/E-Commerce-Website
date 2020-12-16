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
		_id: ID!
	}
	input ShippingAddress {
		address: String!,
		city: String!,
		postalCode: String!,
		country: String!,
	}
	type ShippingAddressOutput {
		address: String!,
		city: String!,
		postalCode: String!,
		country: String!,
	}
	input OrderProductInput {
		id: ID!
		qty: Int!
	}
	type OrderProductOutput{
		product: Product!
		qtyOrdered: Int!
	}
	input PaymentInput {
		emailAddress: String
		paidAt: String!
		paymentID: String!
	}
	type PaymentResult {
		emailAddress: String
		paidAt: String!
		paymentID: String!
	}
	type Order {
		user: User!
		orderItems: [OrderProductOutput]!
		shippingAddress: ShippingAddressOutput!
		paymentMethod: String!
		paymentResult: PaymentResult!
		taxPrice:  Float!
		shippingPrice:  Float!
		totalPrice: Float!
		isDelivered: Boolean!
		deliveredAt: String!
		createdAt: String!
		_id: String!
	}
	scalar Upload 
	
	type Query {
		getProducts: [Product]
		getProduct(productID: ID!): Product
		getPayPalClientID: String!
		getUserOrders: [Order]!
		getUserOrder(orderID: ID!): [Order]!
		getUsers: [User]!
	}
	type Mutation {
		login(email: String!, password: String!): User!
		register(
			username: String!
			email: String!
			password: String!
			confirmPassword: String!
			): User!
		updateUserProfile(
			username: String
			email: String
			password: String
			): User!
		createOrder(
			orderItems: [OrderProductInput]!
			shippingAddress: ShippingAddress!
			paymentMethod: String!
			itemsPrice: Float!
			paymentResult: PaymentInput!
			shippingPrice: Float!
			taxPrice: Float!
			totalPrice: Float!
			): Order!
		deleteUser(id: ID!): String!
		editAdminStatus(id: ID!): Boolean
		deleteProduct(id: ID!): String!
		editProduct(
			id: ID!
			name: String
			image: Upload
			description: String
			brand: String
			category: String
			price: Float
			countInStock: Int
		): Product!
		createProduct(
			name: String!
			image: Upload!
			description: String!
			brand: String!
			category: String!
			price: Float!
			countInStock: Int!
		): Product!
	}
`