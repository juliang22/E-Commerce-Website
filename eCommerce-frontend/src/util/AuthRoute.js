import React, { useContext, useEffect } from 'react'
import { Redirect, Route } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext'

function AuthRoute({ component: Component, redirect, adminRoute = false, ...rest }) { //renaming component to Component and capturing the rest of the props passed in to AuthRoute under ...rest

	const { user } = useContext(AuthContext)

	return (
		<Route
			{...rest}
			render={props =>
				user ? <Component {...props} /> :
					<Redirect to={redirect} />
			}
		/>
	)
}

export default AuthRoute
