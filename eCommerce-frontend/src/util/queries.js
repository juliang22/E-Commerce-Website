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

export const LOGIN_USER = gql`
  mutation login($email: String! $password: String!) {
    login(email: $email password: $password) {
	  email
	  token
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