import React, { useState, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'

import ErrorMessage from '../components/ErrorMessage'
import FormContainer from '../components/FormContainer'
import { REGISTER_USER, LOGIN_USER } from '../util/queries';
import { AuthContext } from '../context/AuthContext'
import { useMutation } from '@apollo/client'
import Meta from '../components/Meta'

const RegisterScreen = ({ location, history }) => {

	const [errors, setErrors] = useState('')
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const { login, user } = useContext(AuthContext)
	const [loginUser] = useMutation(LOGIN_USER, {
		update(_, result) {
			login(result.data.login) //This sends the logged in user data (after successful login) to AuthContext where the token is added to the authorization header
			history.push('/')
		},
		onError(err) {
			setErrors(err)
			console.log(err);
		}
	})

	const [registerUser] = useMutation(REGISTER_USER, {
		update(_, result) {
			loginUser({ variables: { email, password } })
		}, onError(err) {
			setErrors(err)
			console.log(err)
		},
	})

	const registerHandler = (e) => {
		e.preventDefault()
		registerUser({ variables: { username, email, password, confirmPassword } })
	}

	return (
		user ?
			<Redirect to="/"></Redirect> :
			<FormContainer>
				<Meta title='Register' />
				<h1>Sign Up</h1>
				{Object.keys(errors).length > 0 && <ErrorMessage error={errors} variant='danger'></ErrorMessage>}
				<Form onSubmit={registerHandler}>
					<Form.Group controlId='name'>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type='name'
							placeholder='Enter name'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						></Form.Control>
					</Form.Group>
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

					<Form.Group controlId='confirmPassword'>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Confirm password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Button type='submit' variant='primary'>
						Register
	</Button>
				</Form>

				<Row className='py-3'>
					<Col>
						Have an Account?{' '}
						<Link to={'/login'}>
							Login
	  </Link>
					</Col>
				</Row>
			</FormContainer>
	)
}

export default RegisterScreen