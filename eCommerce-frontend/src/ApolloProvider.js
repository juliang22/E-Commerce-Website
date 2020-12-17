// Set Apollo Client Provider - provides apolla client to application so we can connect to grpahql server
import React from 'react'
import App from './App'
import { ApolloProvider, InMemoryCache, ApolloClient, from } from '@apollo/client'
// import { createHttpLink } from "apollo-link-http";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

const handleError = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.map(({ message, locations, path }) => (
			console.log("GraphQL error]: Message: ", message) &&
			console.log("Location: ", locations) &&
			console.log("Path: ", path))
		);

	if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httplink = createUploadLink({ uri: 'https://juliang22-ecommerce.herokuapp.com/graphql', credentials: 'include' });

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	const token = localStorage.getItem('UserToken');
	// return the headers to the context so httpLink can read them => basically creates a header with the user token so that the backend knows who sent the request
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		}
	}
});

// Chaining links together (basically like express middleware)
const links = from([
	handleError,
	authLink.concat(httplink),
]);


const client = new ApolloClient({
	link: links,
	cache: new InMemoryCache(),
	// Enable sending cookies over cross-origin requests
	credentials: 'include'
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
)