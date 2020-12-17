import Order from '../models/Order.js'
import User from "../models/User.js"
import Product from "../models/Product.js"
import apollo from 'apollo-server'
const { ApolloError } = apollo

import checkAuth from '../../util/checkAuth.js';

const ordersResolver = {
	Query: {
		async getUserOrders(_, __, context) {
			const user = await checkAuth(context)
			const orders = await Order.find({ _id: user.orders })
				.populate('user') //Have to populate referenced collections manually
				.populate('orderItems.product')
			return orders
		},
		async getUserOrder(_, { orderID }, context) {
			const user = await checkAuth(context)
			//if user is admin, simply return the order
			if (user.isAdmin) return await Order.find({ _id: orderID })
				.populate('user') //Have to populate referenced collections manually
				.populate('orderItems.product')

			// else find the orders for that user and see if they have the correct order in their order list
			const orders = await Order.find({ _id: user.orders })
				.populate('user') //Have to populate referenced collections manually
				.populate('orderItems.product')
			const order = orders.filter(order => order._id.toString() === orderID)
			if (order) return order
			else throw new Error('This order belongs to another user')
		},
		async getOrders(_, __, context) {
			const adminUser = await checkAuth(context)
			if (!adminUser.isAdmin) throw new Error('User does not have admin status')
			return await Order.find()
				.populate('user') //Have to populate referenced collections manually
				.populate('orderItems.product')
				.sort({ createdAt: -1 })
		}
	},
	Mutation: {
		createOrder: async (_, { orderItems, paymentResult, ...rest }, context) => {
			const user = await checkAuth(context)
			const promises = orderItems.map(async ({ id, qty }) => {
				return { product: await Product.findOne({ _id: id }), qtyOrdered: qty }
			})

			return Promise.all(promises).then(async products => {
				const order = new Order({ orderItems: products, user, paymentResult, ...rest, createdAt: new Date().toISOString() })
				user.orders.push(order._id)
				await user.save()
				if (order) {
					const res = await order.save()
					return { ...res._doc }
				} else throw new Error("Order creation unsuccessful")
			}).catch(err => {
				throw new ApolloError("Product could not be found in database", err)
			})
		},
		async markOrderAsDelivered(_, { orderID }, context) {
			const adminUser = await checkAuth(context)
			if (!adminUser.isAdmin) throw new Error('User does not have admin status')
			const order = await Order.findOne({ _id: orderID })
			order.isDelivered = !order.isDelivered
			order.deliveredAt = new Date().toISOString()
			await order.save()
			return order.isDelivered
		}
	}
}

export { ordersResolver }