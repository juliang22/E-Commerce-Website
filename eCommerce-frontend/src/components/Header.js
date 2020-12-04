import React, { useContext } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { Redirect } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext'

const Header = () => {
	const { user, logout } = useContext(AuthContext)

	const logoutHandler = (e) => {
		e.preventDefault()
		logout()
	}

	return (
		<header>
			{user ? false : <Redirect to='/login' />}
			<Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
				<Container>
					<LinkContainer to='/'>
						<Navbar.Brand>Pro Shop</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="ml-auto">
							{user ? (
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
											<i class="fas fa-sign-out-alt"></i>
										&nbsp;&nbsp;Logout
										</NavDropdown.Item>
									</NavDropdown>
								</>
							) : (
									<LinkContainer to="/login">
										<Nav.Link ><i className='fas fa-user'></i> Login</Nav.Link>
									</LinkContainer>
								)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	)
}

export default Header
