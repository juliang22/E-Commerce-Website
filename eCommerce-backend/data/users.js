import bcrpyt from 'bcryptjs'

const users = [{
	username: 'AdminUser',
	email: 'admin@example.com',
	password: bcrpyt.hashSync('123456', 10), // hashes passwprd syncronously, first param is demo 'user input' password, second is the amount of rounds of hasing
	isAdmin: true
}, {
	username: 'JohnDoe',
	email: 'JohnDoe@example.com',
	password: bcrpyt.hashSync('123456', 10),
	isAdmin: true
}, {
	username: 'JaneDoe',
	email: 'janeDoe@example.com',
	password: bcrpyt.hashSync('1', 10),
	isAdmin: true
}]

export default users