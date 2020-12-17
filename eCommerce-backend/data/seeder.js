import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './users.js'
import products from './products.js'
import User from '../graphql/models/User.js'
import Product from '../graphql/models/Product.js'
import Order from '../graphql/models/Order.js'

dotenv.config()

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
		})
		console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
	} catch (error) {
		console.error(`Error: ${error.message}`.red.underline.bold)
		process.exit(1)
	}
}
// await connectDB()
connectDB()


const importData = async () => {
	try {
		await Order.deleteMany()
		await Product.deleteMany()
		await User.deleteMany()

		const createdUsers = await User.insertMany(users)
		const adminUser = createdUsers[0]._id

		const sampleProducts = products.map(product => {
			return { ...product, user: adminUser }
		})

		await Product.insertMany(sampleProducts)

		console.log('Data Imported!'.green.inverse)
		process.exit()
	} catch (error) {
		console.error(`${error}`.red.inverse)
		process.exit(1) //exits with an error status
	}
}

const destroyData = async () => {
	try {
		await Order.deleteMany()
		await Product.deleteMany()
		await User.deleteMany()

		console.log('Data Destroyed!'.red.inverse)
		process.exit()
	} catch (error) {
		console.error(`${error}`.red.inverse)
		process.exit(1)
	}
}

if (process.argv[2] === '-d') { //checks for the arg flag -d on npm run data:destroy/data:import 
	destroyData()
} else {
	importData()
}