import React from 'react'
import { Alert } from 'react-bootstrap'

const ErrorMessage = ({ variant, error }) => {
	return (
		<Alert variant={variant}>
			{JSON.stringify(error.message).split("\"").map(message => (
				message.charAt(message.length - 1) === '\\' ? message.slice(0, -1) : message
			))}
		</Alert>
	)
}

ErrorMessage.defaultProps = {
	variant: 'info',
}

export default ErrorMessage