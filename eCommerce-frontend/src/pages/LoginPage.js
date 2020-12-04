import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useMutation } from '@apollo/client';

import ErrorMessage from '../components/ErrorMessage'
import FormContainer from '../components/FormContainer'
import { AuthContext } from '../context/AuthContext'
import { LOGIN_USER } from '../util/queries';

const LoginScreen = ({ location, history }) => {
	const [email, setEmail] = useState('')
	const [errors, setErrors] = useState({})
	const [password, setPassword] = useState('')

	const { login } = useContext(AuthContext)
	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update(_, result) {
			console.log("Logged in data: ", result.data.login)
			login(result.data.login) //This sends the logged in user data (after successful login) to AuthContext where the token is added to the authorization header
			history.push('/')
		},
		onError(err) {
			setErrors(err)
			console.log(err);
		}
	})

	const loginHandler = (e) => {
		e.preventDefault()
		loginUser({ variables: { email, password } })
	}

	return (
		<FormContainer>
			<h1>Sign In</h1>
			{Object.keys(errors).length > 0 && <ErrorMessage error={errors} variant='danger'></ErrorMessage>}
			<Form onSubmit={loginHandler}>
				<Form.Group controlId='email'>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type='email'
						placeholder='Enter email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Button type='submit' variant='primary'>
					{loading ? 'Logging In ' : 'Sign In'}
				</Button>
			</Form>

			<Row className='py-3'>
				<Col>
					New Customer?{' '}
					<Link to={'/register'}>
						Register
          </Link>
				</Col>
			</Row>
		</FormContainer>
	)
}

export default LoginScreen