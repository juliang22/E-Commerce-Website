import apollo from 'apollo-server-express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config() // Allows us to use the .env file to keep stuff away from git, this funciton loads all the consts from the .env file into our process
import express from 'express'
import {
	graphqlUploadExpress, // The Express middleware.
} from 'graphql-upload'

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
	uploads: false, // fix for file upload
	context: ({ req }) => ({ req })
})

//Using an express server because file uploading is apparently broken on normal apollo server lol wutttt: https://github.com/apollographql/apollo-server/issues/3508
const app = express()
app.use(graphqlUploadExpress())
app.use(express.static('data')) //exposes data folder to public so static images can be served to frontend
app.use(cors(corsOptions));
server.applyMiddleware({
	app,
	cors: corsOptions
})

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(MONGODB, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		})
		console.log(`MongoDB connected: ${conn.connection.host}`)
		app.listen(PORT)
		console.log(`Server running in ${process.env.NODE_ENV} mode at port ${PORT}`)
	} catch (error) {
		console.log(`Error: ${error.message}`)
		server.stop()
		server.close()
		process.exit(1)
	}
}
await connectDB()



// mongoose
// 	.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
// 	.then(() => {
// 		console.log('MongoDB Connected')
// 		return server.listen(PORT)
// 	})
// 	.then(res => console.log(`Server running in ${process.env.NODE_ENV} mode at port ${PORT}`))
// 	.catch(error => console.error(`Trouble connecting to MongoDB: ${error}`))