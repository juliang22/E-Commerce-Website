import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function AdminRoute({ component: Component, redirect, ...rest }) { //renaming component to Component and capturing the rest of the props passed in to AuthRoute under ...rest

	const { user } = useContext(AuthContext)

	return (
		<Route
			{...rest}
			render={props =>
				user && user?.isAdmin ? <Component {...props} /> :
					<Redirect to={redirect} />
			}
		/>
	)
}

export default AdminRoute