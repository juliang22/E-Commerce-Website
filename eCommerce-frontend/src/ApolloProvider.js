// Set Apollo Client Provider - provides apolla client to application so we can connect to grpahql server
import React from 'react'
import App from './App'
import { ApolloProvider, InMemoryCache, ApolloClient, from } from '@apollo/client'
import { createHttpLink } from "apollo-link-http";
import { onError } from "@apollo/client/link/error";

const handleError = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.map(({ message, locations, path }) => (
			console.log("GraphQL error]: Message: ", message),
			console.log("Location: ", locations),
			console.log("Path: ", path))
		);

	if (networkError) console.log(`[Network error]: ${networkError}`);
});

// Chaining links together (basically like express middleware)
const links = from([
	handleError,
	createHttpLink({ uri: 'http://localhost:5000/graphql' })
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