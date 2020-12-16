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
			const orders = await Order.find({ _id: user.orders })
				.populate('user') //Have to populate referenced collections manually
				.populate('orderItems.product')
			const order = orders.filter(order => order._id.toString() === orderID)
			if (order) return order
			else throw new Error('This order belongs to another user')
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
				console.log(order);
				if (order) {
					const res = await order.save()
					console.log(res._doc);
					return { ...res._doc }
				} else throw new Error("Order creation unsuccessful")
			}).catch(err => {
				throw new ApolloError("Product could not be found in database", err)
			})
		}
	}
}

export { ordersResolver }