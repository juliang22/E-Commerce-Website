import React, { createContext } from 'react'
import { useImmerReducer } from 'use-immer'

const CartContext = createContext()

const cartReducer = (draft, action) => {
	switch (action.type) {
		case 'ADD_TO_CART':
			draft.cartItems.hasOwnProperty(action.payload.name) ?
				//Updating product in cart
				draft.cartItems[action.payload.name].qty = Number(action.payload.qty) + Number(draft.cartItems[action.payload.name].qty) :
				//Adding new product to cart
				draft.cartItems[action.payload.name] = action.payload
			localStorage.setItem('cartItems', JSON.stringify({ ...draft.cartItems }))
			return
		case 'UPDATE_CART':
			action.payload.qty ?
				//Updating the qty of a product
				draft.cartItems[action.payload.name] = action.payload :
				//Deleting a product
				draft.cartItems = Object.keys(draft.cartItems).reduce((newObj, key) => {
					if (key !== action.payload.name) newObj[key] = draft.cartItems[key]
					return newObj
				}, {})
			localStorage.setItem('cartItems', JSON.stringify({ ...draft.cartItems }))
			return
		case 'DELETE_CART':
			draft.cartItems = {}
			draft.shippingAddress = {}
			draft.paymentInfo = {}
			localStorage.removeItem('cartItems', {})
			localStorage.removeItem('shippingAddress', {})
			return
		case 'SAVE_ADDRESS':
			draft.shippingAddress = action.payload
			localStorage.setItem('shippingAddress', JSON.stringify(draft.shippingAddress))
			return
		case 'SAVE_PAYMENT_METHOD':
			draft.paymentInfo.payment = action.payload
			return
		default:
			return draft
	}
}
const cartItems = localStorage.getItem('cartItems') ?
	JSON.parse(localStorage.getItem('cartItems')) :
	{}
const shippingAddress = localStorage.getItem('shippingAddress') ?
	JSON.parse(localStorage.getItem('shippingAddress')) :
	{}
const paymentInfo = localStorage.getItem('paymentInfo') ?
	JSON.parse(localStorage.getItem('paymentInfo')) :
	{}
const initialCartState = { cartItems, shippingAddress, paymentInfo }

const CartContextProvider = (props) => {
	const [cartState, cartDispatch] = useImmerReducer(cartReducer, initialCartState)

	const addToCart = (item) => {
		cartDispatch({
			type: 'ADD_TO_CART',
			payload: item
		})
	}

	const updateCart = (item) => {
		cartDispatch({
			type: 'UPDATE_CART',
			payload: item
		})
	}

	const deleteCart = () => {
		cartDispatch({
			type: 'DELETE_CART',
		})
	}

	const saveAddress = (address) => {
		cartDispatch({
			type: 'SAVE_ADDRESS',
			payload: address
		})
	}

	const savePaymentMethod = (payment) => {
		cartDispatch({
			type: 'SAVE_PAYMENT_METHOD',
			payload: payment
		})
	}

	return <CartContext.Provider value={{
		cartItems: cartState.cartItems,
		shippingAddress: cartState.shippingAddress,
		paymentInfo: cartState.paymentInfo,
		addToCart, updateCart, deleteCart, saveAddress, savePaymentMethod
	}} {...props} />
}

export { CartContext, CartContextProvider }