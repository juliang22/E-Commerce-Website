import bcrpyt from 'bcryptjs'

const users = [{
	name: 'Admin user',
	email: 'admin@example.com',
	password: bcrpyt.hashSync('123456', 10), // hashes passwprd syncronously, first param is demo 'user input' password, second is the amount of rounds of hasing
	isAdmin: true
}, {
	name: 'John Doe',
	email: 'JohnDoe@example.com',
	password: bcrpyt.hashSync('123456', 10),
	isAdmin: true
}, {
	name: 'Jane Doe',
	email: 'janeDoe@example.com',
	password: bcrpyt.hashSync('123456', 10),
	isAdmin: true
}]

export default users