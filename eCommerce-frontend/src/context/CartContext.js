import React, { useReducer, createContext } from 'react'

const CartContext = createContext()

const cartReducer = (state, action) => {
	switch (action.type) {
		case 'ADD_TO_CART':
			let newState = state.hasOwnProperty(action.payload.name) ? {
				...state,
				[action.payload.name]: {
					...action.payload,
					qty: Number(action.payload.qty) + Number(state[action.payload.name].qty)
				}
			} : {
					...state,
					[action.payload.name]: action.payload
				}
			localStorage.setItem('cartItems', JSON.stringify(newState))
			return newState
		case 'UPDATE_CART':
			let updatedState = action.payload.qty ? {
				...state,
				[action.payload.name]: action.payload
			} : Object.keys(state).reduce((newObj, key) => {
				if (key !== action.payload.name) newObj[key] = state[key]
				return newObj
			}, {})
			localStorage.setItem('cartItems', JSON.stringify(updatedState))
			return updatedState
		default:
			return state
	}
}
const cartItemsFromStorage = localStorage.getItem('cartItems') ?
	JSON.parse(localStorage.getItem('cartItems')) :
	[]
const initialCartState = { ...cartItemsFromStorage }
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

	return <CartContext.Provider value={{ cartState, addToCart, updateCart }} {...props} />
}

export { CartContext, CartContextProvider }