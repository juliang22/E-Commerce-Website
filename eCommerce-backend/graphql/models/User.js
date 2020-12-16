import mongoose from 'mongoose'
const { Schema, model } = mongoose

const userSchema = new Schema({
	username: String,
	orders: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Order',
		default: []
	}],
	email: {
		type: String,
		unique: true
	},
	password: String,
	isAdmin: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true //creates a createdAt field automatically
})

export default new model('User', userSchema)