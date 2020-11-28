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