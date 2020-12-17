
import React, { useEffect, useState, useContext } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Alert } from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client';

import ErrorMessage from '../components/ErrorMessage'
import { FETCH_USER_LIST, DELETE_USER, EDIT_ADMIN_STATUS } from '../util/queries';
import Meta from '../components/Meta';

const UserListScreen = ({ history }) => {

	const { data, loading, error: queryError } = useQuery(FETCH_USER_LIST)
	const [error, setError] = useState(false)
	if (error) setError(queryError)

	const [toggleAdmin] = useMutation(EDIT_ADMIN_STATUS, {
		refetchQueries: [{ query: FETCH_USER_LIST }]
	})

	const [message, setMessage] = useState(false)
	const [deleteUser] = useMutation(DELETE_USER, {
		update(cache, { data }) {
			if (data.deleteUser === "not deleted") {
				setMessage("Problem deleting user")
				return
			}
			const { getUsers: prevUsers } = cache.readQuery({
				query: FETCH_USER_LIST
			});

			cache.writeQuery({
				query: FETCH_USER_LIST,
				data: {
					getUsers: prevUsers.filter(user => user._id !== data.deleteUser)
				}
			})
		},
		onCompleted() {
			setMessage(<Alert
				variant="success"
				onClose={() => setMessage(false)}
				style={{ width: '30%' }}
				className='float-right'
				dismissible>User Deleted
				</Alert>)
		},
		onError(err) {
			setError(err)
		}
	})

	const deleteHandler = (id) => {
		if (window.confirm('Are you sure')) {
			deleteUser({ variables: { id } })
		}
	}

	return (
		<>
			<Meta title='User List' />
			{error && <ErrorMessage variant='danger' error={error} />}
			<h1>Users</h1>
			{loading ? (
				<h1>Loading userslist...</h1> //TODO: Skeleton screens
			) : (
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>EMAIL</th>
								<th>ADMIN</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{data.getUsers.map(user => (
								<tr key={user._id}>
									<td>{user._id}</td>
									<td>{user.username}</td>
									<td>
										<a href={`mailto:${user.email}`}>{user.email}</a>
									</td>
									<td>
										{user.isAdmin ? (
											<i className='fas fa-check' style={{ color: 'green', marginRight: '20px' }}></i>
										) : (
												<i className='fas fa-times' style={{ color: 'red', marginRight: '20px' }}></i>
											)}
										<Button variant='info' className='btn-sm' onClick={() => toggleAdmin({ variables: { id: user._id } })} >
											<i className='fas fa-edit'></i>
											Edit Admin Status
										</Button>
									</td>
									<td>
										<Button
											variant='danger'
											className='btn-sm'
											onClick={() => deleteHandler(user._id)}
										>
											<i className='fas fa-trash'></i>
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			{message}
		</>
	)
}

export default UserListScreen