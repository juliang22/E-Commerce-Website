import React, { useReducer, createContext } from 'react'
import jwtDecode from 'jwt-decode'

const AuthContext = createContext()
const initialState = { user: null }

// This will run whenever the page gets refreshed or user logs in
const decodeToken = (token = localStorage.getItem('UserToken'), isAdmin = (localStorage.getItem('isAdmin') === 'true')) => {
	if (token) {
		const decodedToken = jwtDecode(token)
		console.log(decodedToken)
		if (decodedToken.exp * 1000 < Date.now) { //checking expiration date of decoded token
			localStorage.removeItem('UserToken')
		} else {
			initialState.user = { ...decodedToken, isAdmin }
			localStorage.setItem('isAdmin', isAdmin)
			return initialState.user
		}
	}
}
decodeToken()

const AuthReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			const token = decodeToken(action.payload.token, action.payload.isAdmin)
			return {
				...state,
				user: token
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

	// TODO: Make it so different users can log in and out and keep cart context
	const logout = () => {
		localStorage.clear();
		authDispatch({
			type: "LOGOUT"
		})
	}

	return (
		<AuthContext.Provider value={{ user: state.user, login, update, logout }} {...props} />
	)
}

export { AuthContext, AuthContextProvider }