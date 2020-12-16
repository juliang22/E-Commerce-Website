import gql from "graphql-tag"

export const FETCH_PRODUCT_QUERY = gql`
	query($productID: ID!) {
		getProduct(productID: $productID) {
			name
			image
			description
			brand
			category
			price
			countInStock
			rating
			numReviews
			id
		}
	}
`

export const FETCH_PRODUCTS_QUERY = gql`
{
	getProducts {
	  name
	  image
	  description
	  brand
	  category
	  price
	  countInStock
	  rating
	  numReviews
	  id
	}
  }
`

export const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: ID!) {
	deleteProduct(id: $id) 
  }
`;

export const CREATE_PRODUCT = gql`
  mutation createProduct(
	 	$name: String!
		$image: Upload!
		$description: String!
		$brand: String!
		$category: String!
		$price: Float!
		$countInStock: Int!
  ) {
	createProduct(
	 	name: $name
		image: $image
		description: $description
		brand: $brand
		category: $category
		price: $price
		countInStock: $countInStock
	) {
		name
		image
		description
		brand
		category
		price
		countInStock
		id
	}
  }
`;
export const EDIT_PRODUCT = gql`
  mutation editProduct(
	  	$id: ID!
	 	$name: String
		$image: Upload
		$description: String
		$brand: String
		$category: String
		$price: Float
		$countInStock: Int
  ) {
	editProduct(
		id: $id
	 	name: $name
		image: $image
		description: $description
		brand: $brand
		category: $category
		price: $price
		countInStock: $countInStock
	) {
		name
		image
		description
		brand
		category
		price
		countInStock
		id
	}
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String! $password: String!) {
    login(email: $email password: $password) {
	  email
	  token
	  isAdmin
      username
    }
  }
`;

export const REGISTER_USER = gql`
  mutation register($username: String!
	$email: String! 
	$password: String!
	$confirmPassword: String!) {
    register(username: $username email: $email password: $password confirmPassword: $confirmPassword) {
	  email
      password
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
mutation updateUserProfile($username: String $email: String $password: String) {
	updateUserProfile(username: $username email: $email password: $password) {
		username
		email
		token
	  }
} 
`;
export const CREATE_ORDER = gql`
mutation createOrder(
	$orderItems: [OrderProductInput]!
	$shippingAddress: ShippingAddress!
	$paymentMethod: String!
	$paymentResult: PaymentInput!
	$itemsPrice: Float!
	$shippingPrice: Float!
	$taxPrice: Float!
	$totalPrice: Float!) {
	createOrder(
		orderItems: $orderItems 
		shippingAddress: $shippingAddress 
		paymentMethod: $paymentMethod 
		paymentResult: $paymentResult
		itemsPrice: $itemsPrice 
		shippingPrice: $shippingPrice 
		taxPrice: $taxPrice 
		totalPrice: $totalPrice) {
			user { username _id }
			orderItems {
				product { name }
				qtyOrdered
			}
			shippingAddress {city address postalCode country}
			paymentMethod
			paymentResult { emailAddress paidAt paymentID }
			taxPrice
			shippingPrice
			totalPrice
			isDelivered
			deliveredAt
			createdAt
			_id
	  	}
	}
`;

export const GET_PAYPAL_CLIENTID = gql`
{
	getPayPalClientID 
}
`;

export const FETCH_ORDERS_QUERY = gql`
{
	getUserOrders {
		user { username, _id }
		orderItems {
			product {name image id price}
			qtyOrdered
		}
		shippingAddress { address city postalCode country }
		paymentMethod
		taxPrice
		shippingPrice
		totalPrice
		paymentResult { paidAt }
		isDelivered
		deliveredAt
		_id
	}
  }
`

export const FETCH_ORDER_QUERY = gql`
	query($orderID: ID!) {
		getUserOrder(orderID: $orderID) {
			user { username, _id }
			orderItems {
				product {name image id price}
      			qtyOrdered
    		}
			shippingAddress { address city postalCode country }
			paymentMethod
			taxPrice
			shippingPrice
			totalPrice
			paymentResult { paidAt }
			isDelivered
			deliveredAt
			_id
		}
	}
`
export const FETCH_USER_LIST = gql`
	{
		getUsers {
			username
			email
			password
			isAdmin
			_id
		}
	}
`
export const DELETE_USER = gql`
	mutation deleteUser($id: ID!){
		deleteUser(id: $id) 
	}
`

export const EDIT_ADMIN_STATUS = gql`
	mutation editAdminStatus($id: ID!){
		editAdminStatus(id: $id) 
	}
`

// export const UPLOAD_FILE = gql`
//   mutation($file: Upload!) {
//     uploadFile(file: $file) {
//       success
//     }
//   }
// `;

