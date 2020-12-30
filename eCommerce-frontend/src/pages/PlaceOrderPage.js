import React, { useContext, useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
// import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';

import { CartContext } from '../context/CartContext'
import { CREATE_ORDER, FETCH_USER_ORDERS_QUERY } from '../util/queries'
import { GET_PAYPAL_CLIENTID } from '../util/queries'
import ErrorMessage from '../components/ErrorMessage'
import PlaceOrderUI from './PlaceOrderUI'
import { Alert } from 'react-bootstrap'
import useEmail from '../hooks/useEmail';


//<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
const PlaceOrderPage = ({ history }) => {
	const { shippingAddress, paymentInfo, cartItems } = useContext(CartContext)

	const { data, paypalLoading } = useQuery(GET_PAYPAL_CLIENTID)
	const [sdkReady, setSDKReady] = useState(false)
	const [checkoutError, setCheckoutError] = useState(false)
	const [error, setError] = useState(false)
	const { emailCustomer, emailOwner } = useEmail()

	//Paypal Setup
	useEffect(() => {
		if (data && !paypalLoading) {
			const { getPayPalClientID: clientID } = data
			const script = document.createElement('script')
			script.type = 'text/javascript'
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}`
			script.async = true
			script.onload = () => setSDKReady(true)
			document.body.appendChild(script)
		}
	}, [data, paypalLoading])

	// const testProps = () => history.push({
	// 	pathname: `/order/5fd273c36368f61f197c7a69`,
	// 	state: { justOrdered: true }
	// })

	const [createOrder, { loading }] = useMutation(CREATE_ORDER, {
		refetchQueries: [{ query: FETCH_USER_ORDERS_QUERY }],
		onCompleted(result) {
			const { createOrder: { _id, orderItems, user } } = result
			const productsString = orderItems.reduce((acc, item, i) => i === 0 ? `${item.product.name}` : `${acc}, ${item.product.name}`, '')
			emailCustomer({
				order_number: _id,
				to_name: user.username,
				product_list: productsString,
				to_email: user.email
			})
			emailOwner({ to_name: user.username, product_list: productsString })

			history.push({
				pathname: `/order/${_id}`,
				state: { justOrdered: true }
			})
		},
		onError(err) {
			console.log(err)
			setError(
				<ErrorMessage varian='danger' error={err}></ErrorMessage>
			)
		}
	})

	if (Object.keys(shippingAddress).length === 0) {
		history.push('/shipping')
	} else if (Object.keys(paymentInfo).length === 0) {
		history.push('/payment')
	}
	//   Calculate prices
	const addDecimals = (num) => {
		return (Math.round(num * 100) / 100).toFixed(2)
	}

	const orderInfo = {}

	orderInfo.itemsPrice = addDecimals(
		Object.values(cartItems).reduce((acc, item) => acc + item.price * item.qty, 0)
	)
	orderInfo.shippingPrice = addDecimals(orderInfo.itemsPrice > 100 ? 0 : 10)
	orderInfo.taxPrice = addDecimals(Number((0.15 * orderInfo.itemsPrice).toFixed(2)))
	orderInfo.totalPrice = (
		Number(orderInfo.itemsPrice) +
		Number(orderInfo.shippingPrice) +
		Number(orderInfo.taxPrice)
	).toFixed(2)

	const paypalOrderHandler = (paymentResult) => {
		if (!paymentResult) setCheckoutError(
			<Alert variant='danger'>Error Completing purchase. Please try again or contact fake@email.com for support</Alert>
		)
		else {
			const orderItems = Object.values(cartItems).map(x => ({ id: x["id"], qty: Number(x.qty) }))
			createOrder({
				variables: {
					orderItems,
					shippingAddress,
					paymentMethod: paymentInfo.payment,
					itemsPrice: Number(orderInfo.itemsPrice),
					shippingPrice: Number(orderInfo.shippingPrice),
					taxPrice: Number(orderInfo.taxPrice),
					totalPrice: Number(orderInfo.totalPrice),
					paymentResult: {
						emailAddress: paymentResult.payer.email_address,
						paidAt: paymentResult.update_time,
						paymentID: paymentResult.id
					}
				}
			})
		}
	}


	// const stripe = useStripe();
	// console.log(stripe);
	// const elements = useElements();
	// console.log(elements);

	// const stripeOrderHandler = async (e) => {
	// 	e.preventDefault();
	// 	if (!stripe || !elements) return
	// 	const cardElement = elements.getElement(CardElement)
	// 	const { error, paymentMethod } = await stripe.createPaymentMethod({
	// 		type: 'card',
	// 		card: cardElement,
	// 	})

	// 	if (error) console.log('[error]', error);
	// 	else console.log('[PaymentMethod]', paymentMethod);
	// }

	if (loading) return <h1>Submitting Order...</h1>
	return (
		<PlaceOrderUI
			error={error}
			shippingAddress={shippingAddress}
			paymentInfo={paymentInfo}
			cartItems={cartItems}
			orderInfo={orderInfo}
			// orderHandler={paymentInfo.payment === 'PayPal' ? paypalOrderHandler : stripeOrderHandler}
			orderHandler={paypalOrderHandler}
			// paypalSDKReady={paymentInfo.payment === 'PayPal' ? sdkReady : stripe}
			SDKReady={sdkReady}
			checkoutError={checkoutError}
		></PlaceOrderUI>
	)
}

export default PlaceOrderPage