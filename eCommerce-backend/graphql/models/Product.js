import mongoose from 'mongoose'
const { model, Schema } = mongoose

const reviewSchema = new Schema({
	name: String,
	rating: Number,
	comment: String
}, {
	timestamps: true
})

const productSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User' // references user model, when creating a new product, the userID will be passed in, this ref field will look up that user id in the User collection and connect it with the product
	},
	name: String,
	image: String,
	description: String,
	brand: String,
	category: String,
	price: {
		type: Number,
		default: 0
	},
	reviews: [reviewSchema],
	countInStock: {
		type: Number,
		default: 0
	},
	rating: {
		type: Number,
		default: 0
	},
	numReviews: {
		type: Number,
		default: 0
	}
}, {
	timestamps: true
})

export default model('Product', productSchema)