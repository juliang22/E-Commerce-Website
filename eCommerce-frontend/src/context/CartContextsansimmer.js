import React, { useReducer, createContext } from 'react'

const CartContext = createContext()

//! This file is not actually used, just an example of past code
/* 
EXAMPLE OF WHAT CART CONTEXT WOULD LOOK LIKE WITHOUT IMMER. IT IS A GHASTLY SIGHT 
*/


const cartReducer = (state, action) => {
	let newCartState
	switch (action.type) {
		case 'ADD_TO_CART':
			newCartState = state.cartItems.hasOwnProperty(action.payload.name) ? {
				//Updating product in cart
				...state,
				cartItems: {
					...state.cartItems,
					[action.payload.name]: {
						...action.payload,
						qty: Number(action.payload.qty) + Number(state.cartItems[action.payload.name].qty)
					}
				}
			} : {
					//Adding new product to cart
					...state,
					cartItems: {
						...state.cartItems,
						[action.payload.name]: action.payload
					}
				}
			localStorage.setItem('cartItems', JSON.stringify({ ...newCartState.cartItems }))
			return newCartState
		case 'UPDATE_CART':
			newCartState = action.payload.qty ? {
				//Updating the qty of a product
				...state,
				cartItems: {
					...state.cartItems,
					[action.payload.name]: action.payload
				}
			} : {
					//Deleting a product
					...state,
					cartItems: Object.keys(state.cartItems).reduce((newObj, key) => {
						if (key !== action.payload.name) newObj[key] = state.cartItems[key]
						return newObj
					}, {})
				}
			localStorage.setItem('cartItems', JSON.stringify({ ...newCartState.cartItems }))
			return newCartState
		default:
			return state
		case 'SAVE_ADDRESS':
			let addressState = {
				...state,
				shippingAddress: {
					...action.payload
				}
			}
			localStorage.setItem('shippingAddress', JSON.stringify(addressState))
			return addressState
	}
}
const cartItems = localStorage.getItem('cartItems') ?
	JSON.parse(localStorage.getItem('cartItems')) :
	{ shippingAddress: {} }
const shippingAddress = localStorage.getItem('shippingAddress') ?
	JSON.parse(localStorage.getItem('shippingAddress')) :
	{ cartItems: {} }
const initialCartState = { ...cartItems, ...shippingAddress }

const CartContextProvider = (props) => {
	const [cartState, cartDispatch] = useReducer(cartReducer, initialCartState)

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

	const saveAddress = (address) => {
		cartDispatch({
			type: 'SAVE_ADDRESS',
			payload: address
		})
	}

	return <CartContext.Provider value={{ cartItems: cartState.cartItems, addToCart, updateCart, saveAddress, shippingAddress: cartState.shippingAddress }} {...props} />
}

export { CartContext, CartContextProvider }