import React, { useContext } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { Redirect } from 'react-router-dom';
import { ApolloConsumer } from '@apollo/client'

import { AuthContext } from '../context/AuthContext'


const Header = () => {
	const { user, logout } = useContext(AuthContext)

	const logoutHandler = (e) => {
		e.preventDefault()
		logout()
	}

	const userDropdown = () => (
		<>
			<LinkContainer to='/cart'>
				<Nav.Link><i className='fas fa-shopping-cart'></i> Cart</Nav.Link>
			</LinkContainer>
			<NavDropdown title={user.username}>
				<LinkContainer to='/profile'>
					<NavDropdown.Item> <i className='fas fa-user py-3'></i>
				&nbsp;&nbsp;Profile
				</NavDropdown.Item>
				</LinkContainer>
				<NavDropdown.Item onClick={e => logoutHandler(e)}>
					<i className="fas fa-sign-out-alt"></i>
			&nbsp;&nbsp;Logout
			</NavDropdown.Item>
			</NavDropdown>
		</>
	)

	return (
		<header>
			{user ?
				false : (
					<>
						{/* Clear cache and logout */}
						<ApolloConsumer>
							{client => {
								client.clearStore()
								client.cache.gc()
							}}
						</ApolloConsumer>
						<Redirect to='/login' />
					</>
				)
			}
			<Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
				<Container>
					<LinkContainer to='/'>
						<Navbar.Brand>JulianShop</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="ml-auto">
							{user ?
								userDropdown()
								: (
									<LinkContainer to="/login">
										<Nav.Link ><i className='fas fa-user'></i> Login</Nav.Link>
									</LinkContainer>
								)}
							{user?.isAdmin &&
								<NavDropdown title='Admin' id='adminmenu'>
									<LinkContainer to='/admin/userlist'>
										<NavDropdown.Item>
											<i className='fas fa-users py-3'></i>
													&nbsp;&nbsp;User List
												</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/productslist'>
										<NavDropdown.Item>
											<i className="fas fa-gift py-3"></i>
													&nbsp;&nbsp;Product List
													</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/orderslist'>
										<NavDropdown.Item>
											<i className="fas fa-clipboard-list py-3"></i>
													&nbsp;&nbsp;Order List
													</NavDropdown.Item>
									</LinkContainer>
								</NavDropdown>
							}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	)
}

export default Header
