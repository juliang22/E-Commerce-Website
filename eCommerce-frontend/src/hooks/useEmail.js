import emailjs from 'emailjs-com'

const useEmail = () => {
	emailjs.init("user_ehXnw3UGTBGubPoK61Z0Q")

	const emailCustomer = ({ order_number, to_name, product_list, to_email }) => emailjs.send("service_3zvk49g", "template_s2xh4sh", { order_number, to_name, product_list, to_email })
	const emailOwner = ({ to_name, product_list }) => emailjs.send("service_3zvk49g", "template_sz9zfve", { product_list, to_name })

	return { emailCustomer, emailOwner }
}

export default useEmail