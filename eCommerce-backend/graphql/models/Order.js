import mongoose from 'mongoose'
const { Schema, model } = mongoose

const orderSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	orderItems: [{
		name: {
			name: String,
			qty: Number,
			image: String,
			price: Number,
			product: {
				type: mongoose.Schema.Types.ObjectId
			}
		}
	}],
	shippingAddress: {
		address: String,
		city: String,
		postalCode: String,
		country: String,
	},
	paymentMethod: String,
	paymentResult: {
		id: String,
		status: String,
		updateTime: String,
		emailAddress: String
	},
	taxPrice: {
		type: Number,
		default: 0.0
	},
	shippingPrice: {
		type: Number,
		default: 0.0
	},
	totalPrice: {
		type: Number,
		default: 0.0
	},
	isPaid: {
		type: Boolean,
		default: false
	},
	paidAt: Date,
	isDelivered: {
		type: Boolean,
		default: false
	},
	deliveredAt: Date,
})

export default new model('Order', orderSchema)