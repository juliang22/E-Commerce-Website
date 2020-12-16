import mongoose from 'mongoose'
const { Schema, model } = mongoose

const orderSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	orderItems: [{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product'
		},
		qtyOrdered: Number
	}],
	shippingAddress: {
		address: String,
		city: String,
		postalCode: String,
		country: String,
	},
	paymentMethod: String,
	paymentResult: {
		emailAddress: { type: String },
		paidAt: { type: String },
		paymentID: { type: String }
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
	isDelivered: {
		type: Boolean,
		default: false
	},
	deliveredAt: { type: String, default: "Products have not been delivered." }
}, {
	timestamps: true
})

export default new model('Order', orderSchema)