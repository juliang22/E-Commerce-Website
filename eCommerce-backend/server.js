import apollo from 'apollo-server'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config() // Allows us to use the .env file to keep stuff away from git

import resolvers from './graphql/resolvers/index.js'
import typeDefs from './graphql/typeDefs.js'

const PORT = process.env.PORT || 5000
const MONGODB = process.env.MONGODB
const { ApolloServer } = apollo

const corsOptions = {
	origin: "http://localhost:3000",
	credentials: true
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	cors: corsOptions
})

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(MONGODB, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		})
		console.log(`MongoDB connected: ${conn.connection.host}`)
		server.listen(PORT)
		console.log(`Server running in ${process.env.NODE_ENV} mode at port ${PORT}`)
	} catch (error) {
		console.log(`Error: ${error.message}`)
		process.exit(1)
	}
}

connectDB()


// mongoose
// 	.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
// 	.then(() => {
// 		console.log('MongoDB Connected')
// 		return server.listen(PORT)
// 	})
// 	.then(res => console.log(`Server running in ${process.env.NODE_ENV} mode at port ${PORT}`))
// 	.catch(error => console.error(`Trouble connecting to MongoDB: ${error}`))