import checkAuth from '../../util/checkAuth.js';

const PayPalResolver = {
	Query: {
		getPayPalClientID: async (_, __, context) => {
			await checkAuth(context)
			return process.env.PAYPAL_CLIENT_ID
		}
	}
}

export { PayPalResolver }
