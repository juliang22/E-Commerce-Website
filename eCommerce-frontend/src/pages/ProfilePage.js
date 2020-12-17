import React, { useState, useContext } from 'react'
import { Table, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useMutation, useQuery } from '@apollo/client';

import { AuthContext } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage'
import { UPDATE_USER_PROFILE } from '../util/queries';
import { FETCH_USER_ORDERS_QUERY } from '../util/queries';
import Meta from '../components/Meta';

const ProfilePage = ({ location, history }) => {
	const [newUsername, setNewUsername] = useState('')
	const [newEmail, setNewEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)

	const { login, user: { username, email } } = useContext(AuthContext)

	const { data, loading } = useQuery(FETCH_USER_ORDERS_QUERY)

	const [updateProfile] = useMutation(UPDATE_USER_PROFILE, {
		update(_, result) {
			setSuccess(<Alert variant='success'>Profile Updated</Alert>)
			console.log("result", result.data.updateUserProfile)
			login(result.data.updateUserProfile)
			setError(false)
			setNewUsername('')
			setNewEmail('')
			setConfirmPassword('')
			setPassword('')
		}, onError(err) {
			setSuccess(null)
			setError(<ErrorMessage variant='danger' error={err}></ErrorMessage>)
		}
	})

	const submitHandler = (e) => {
		e.preventDefault()
		if (password !== confirmPassword) {
			setError(<Alert variant='danger'>Passwords do not match</Alert>)
			setSuccess(null)
		} else {
			updateProfile({ variables: { username: newUsername, email: newEmail, password: password } })
		}
	}

	return (
		<Row>
			<Meta title='Profile' />
			<Col md={4}>
				<h2>Update Profile</h2>
				{error}
				{success}
				<Form onSubmit={submitHandler}>
					<Form.Group controlId='name'>
						<Form.Label>Username</Form.Label>
						<Form.Control
							type='name'
							placeholder={`current username: ${username}`}
							value={newUsername}
							onChange={(e) => setNewUsername(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='email'>
						<Form.Label>Email Address</Form.Label>
						<Form.Control
							type='email'
							placeholder={`current email: ${email}`}
							value={newEmail}
							onChange={(e) => setNewEmail(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='password'>
						<Form.Label>New Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Enter new password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='confirmPassword'>
						<Form.Label>Confirm New Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Confirm new password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Button type='submit' variant='primary'>
						Update
            </Button>
				</Form>
			</Col>
			<Col md={8}>
				<h2 style={{ textAlign: "center" }}>My Orders</h2>
				{data?.getUserOrders.length > 0 && !loading ?
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>TOTAL</th>
								<th>PAID</th>
								<th>DELIVERED</th>
								<th></th>
							</tr>
						</thead>
						{data.getUserOrders.map(({ user, orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice, paymentResult, isDelivered, deliveredAt, _id }) => (
							<tbody key={_id}>
								<tr>
									<td>{_id}</td>
									<td>{totalPrice}</td>
									<td>
										{new Date(paymentResult.paidAt).toDateString()}
									</td>
									<td>
										{isDelivered ? (
											deliveredAt.substring(0, 10)
										) : (
												<i className='fas fa-times' style={{ color: 'red' }}></i>
											)}
									</td>
									<td>
										<LinkContainer to={`/order/${_id}`}>
											<Button className='btn-sm' variant='light'>
												Details
                      </Button>
										</LinkContainer>
									</td>
								</tr>

							</tbody>
						))}
					</Table>
					:
					<h4 style={{ textAlign: 'center' }}>Purchased items will display here :)</h4>
				}
			</Col>
		</Row>
	)
}

export default ProfilePage