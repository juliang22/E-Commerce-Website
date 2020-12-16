import User from "../models/User.js";
import apollo from 'apollo-server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const { UserInputError } = apollo
import checkAuth from '../../util/checkAuth.js'

import { validateLoginInput, validateRegisterInput } from '../../util/validators.js'

function generateToken({ id, email, username }) {
	return jwt.sign({ id, email, username }, process.env.SECRET_KEY, { expiresIn: '20d' })
}

const createOrUpdateUser = async (username, email, password, action) => {
	// Make sure username and email doesnt already exist
	if (username) {
		let userExists = await User.findOne({ username })
		if (username.trim() === '') throw new UserInputError('Username must not be empty')
		if (userExists) throw new UserInputError('Username is taken')
	}
	if (email) {
		let userExists = await User.findOne({ email })
		if (email.trim() === '') throw new UserInputError('Email must not be empty')
		if (userExists) throw new UserInputError('Email is taken')
	}
	if (password) {
		if (password.trim() === '') throw new UserInputError('Password must not be empty')
		// Hash password and create an auth token, salt generates random number to guarantee random hashed password is created
		const salt = await bcrypt.genSalt(10)
		password = await bcrypt.hash(password, salt) //hashing password with bcrypt module, asynchronous, so we have to wait for newUser to come back
	}
	let res
	if (action.type === 'CREATE') {
		const newUser = new User({
			email,
			username,
			password,
			createdAt: new Date().toISOString()
		})
		res = await newUser.save()
	} else if (action.type === 'UPDATE') {
		const user = action.payload
		user.username = username || user.username
		user.password = password || user.password
		user.email = email || user.email
		res = await user.save()
	}
	const token = generateToken(res);
	return {
		...res._doc, //mongoose returns everything in the _doc property it seems, add _ to access returned mongoose data
		id: res._id,
		token
	}
}

const usersResolver = {
	Query: {
		getUsers: async (_, __, context) => {
			const user = await checkAuth(context)
			if (!user.isAdmin) throw new Error('User does not have admin status')
			return await User.find({ _id: { $ne: user._id } })
		}
	},
	Mutation: {
		login: async (_, { email, password }) => {
			const { errors, valid } = validateLoginInput(email, password)
			if (!valid) throw new UserInputError(`${JSON.stringify(Object.values(errors)).slice(2, -2)}`)

			const user = await User.findOne({ email })
			if (!user) {
				errors.general = "User not found"
				throw new UserInputError('User not found', { errors })
			}

			const match = await bcrypt.compare(password, user.password) //comparing passwords
			if (!match) {
				errors.general = "Wrong Credentials"
				throw new UserInputError('Incorrect Password', { errors })
			}

			//Passed all checks
			const token = generateToken(user)
			return {
				...user._doc, //mongoose returns everything in the _doc property it seems, add _ to access returned mongoose data, {...user} has wayyyy more info than we need, _doc jsut retuns the properties we set
				id: user._id, //user.id is just a string, this returns the id as an object
				token
			}
		},
		register: async (_, { email, password, confirmPassword, username }) => {
			// Validate user data
			const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
			if (!valid) throw new UserInputError(`${JSON.stringify(Object.values(errors)).slice(2, -2)}`)

			//features of register ond update were very similar so I extracted similar features into createOrUpdateUser
			return await createOrUpdateUser(username, email, password, { type: 'CREATE' })
		},
		updateUserProfile: async (_, { username, email, password }, context) => {
			//Check that they are authenticated (token sent from frontend) & that user exists in db
			let user = await checkAuth(context)
			return await createOrUpdateUser(username, email, password, { type: 'UPDATE', payload: user })
		},
		deleteUser: async (_, { id }, context) => {
			const adminUser = await checkAuth(context)
			if (!adminUser.isAdmin) throw new Error('User does not have admin status')
			const { ok } = await User.deleteOne({ _id: id })
			return ok === 1 ? id.toString() : "not deleted"
		},
		editAdminStatus: async (_, { id }, context) => {
			const adminUser = await checkAuth(context)
			if (!adminUser.isAdmin) throw new Error('User does not have admin status')
			const user = await User.findOne({ _id: id })
			user.isAdmin = !user.isAdmin
			await user.save()
			return user.isAdmin
		}
	}
}

export { usersResolver }