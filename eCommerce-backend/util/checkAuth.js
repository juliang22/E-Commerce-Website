import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import apollo from 'apollo-server'
const { AuthenticationError } = apollo

// JWT making requests: Whenever the user wants to access a protected route or resource, the user agent should send the JWT token, typically in the Authorization header using the Bearer schema. The content of the header should look like the following: Authorization: Bearer <token>

const authHeader = (context) => {
	// context = {...headers}, has an object with many things including headers that include the authentification info
	const authHeader = context.req.headers.authorization // Looks like: Authorization: Bearer <token>

	if (authHeader) {
		const token = authHeader.split('Bearer ')[1] //grabs just the token after "Bearer"
		if (token) {
			try {
				const user = jwt.verify(token, process.env.SECRET_KEY)
				return user
			} catch (error) {
				throw new AuthenticationError('Invalid/Expired token')
			}
		}
		throw new Error(`Authentication token must be 'Bearer [token]'`)
	}
	throw new Error('Authorization header must be provided')
}

export default authHeader
// Have to include a header for testing:
// "Authorization": "Bearer <user token>" => can include this in the HTTP header bottom section of gql playground