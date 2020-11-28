import React from 'react'
import { Alert } from 'react-bootstrap'

const ErrorMessage = ({ variant, error }) => {
	return (
		<Alert variant={variant}>
			{JSON.stringify(error.message)}
		</Alert>
	)
}

ErrorMessage.defaultProps = {
	variant: 'info',
}

export default ErrorMessage