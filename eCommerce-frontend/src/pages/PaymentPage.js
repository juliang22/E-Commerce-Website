import React, { useContext, useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'

import CheckoutSteps from '../components/CheckoutSteps'
import { CartContext } from '../context/CartContext'
import Meta from '../components/Meta'

const PaymentScreen = ({ history }) => {
	const { shippingAddress, savePaymentMethod } = useContext(CartContext)

	if (!shippingAddress) {
		history.push('/shipping')
	}

	const [paymentMethod, setPaymentMethod] = useState('PayPal')


	const submitHandler = (e) => {
		e.preventDefault()
		savePaymentMethod(paymentMethod)
		history.push('/placeorder')
	}

	return (
		<FormContainer>
			<Meta title='Payment' />
			<CheckoutSteps step1 step2 step3 />
			<h1>Payment Method</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group>
					<Form.Label as='legend'>Select Method</Form.Label>
					<Col>
						<Form.Check
							type='radio'
							label='PayPal or Credit Card'
							id='PayPal'
							name='paymentMethod'
							value={paymentMethod}
							checked
							onChange={setPaymentMethod}
						></Form.Check>
						{/* TODO: Stripe is being buggy so I'm removing it for now */}
						{/* <Form.Check
							type='radio'
							label='Stripe'
							id='Stripe'
							name='paymentMethod'
							value='Stripe'
							onChange={(e) => setPaymentMethod(e.target.value)}
						></Form.Check> */}
					</Col>
				</Form.Group>

				<Button type='submit' variant='primary'>
					Continue
        </Button>
			</Form>
		</FormContainer>
	)
}

export default PaymentScreen