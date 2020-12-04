import React, { useReducer, createContext } from 'react'
import jwtDecode from 'jwt-decode'

const AuthContext = createContext()
const initialState = { user: null }

const token = localStorage.getItem('UserToken')
if (token) {
	const decodedToken = jwtDecode(token)
	if (decodedToken.exp * 1000 < Date.now) { //checking expiration date of decoded token
		localStorage.removeItem('UserToken')
	} else {
		initialState.user = decodedToken
	}
}

const AuthReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			return {
				...state,
				user: action.payload
			}
		case "LOGOUT":
			return {
				...state,
				user: null
			}
		default:
			return state
	}
}

const AuthContextProvider = (props) => {
	const [state, authDispatch] = useReducer(AuthReducer, initialState)

	const update = (user) => {
		localStorage.setItem('UserToken', user.token)
		authDispatch({
			type: "UPDATE",
			payload: user
		})
	}

	const login = (user) => {
		localStorage.setItem('UserToken', user.token)
		authDispatch({
			type: "LOGIN",
			payload: user
		})
	}

	// TODO: FIgure out a way to save cart context after a user logs out and logs back in => if not, delete cart context on logout
	const logout = (user) => {
		localStorage.removeItem('UserToken')
		localStorage.removeItem('cartItems')
		authDispatch({
			type: "LOGOUT"
		})
	}

	return (
		<AuthContext.Provider value={{ user: state.user, login, update, logout }} {...props} />
	)
}

export { AuthContext, AuthContextProvider }