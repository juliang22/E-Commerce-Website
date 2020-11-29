import mongoose from 'mongoose'
const { Schema, model } = mongoose

const userSchema = new Schema({
	name: String,
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