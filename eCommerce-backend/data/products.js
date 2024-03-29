import faker from 'faker'

const staticProducts = [
  {
    name: 'Airpods Wireless Bluetooth Headphones',
    image: `https://juliang22-ecommerce.herokuapp.com/images/airpods.jpg`,
    description:
      'Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working',
    brand: 'Apple',
    category: 'Electronics',
    price: 89.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'iPhone 11 Pro 256GB Memory',
    image: `https://juliang22-ecommerce.herokuapp.com/images/phone.jpg`,
    description:
      'Introducing the iPhone 11 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life',
    brand: 'Apple',
    category: 'Electronics',
    price: 599.99,
    countInStock: 7,
    rating: 4.0,
    numReviews: 8,
  },
  {
    name: 'Cannon EOS 80D DSLR Camera',
    image: `https://juliang22-ecommerce.herokuapp.com/images/camera.jpg`,
    description:
      'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design',
    brand: 'Cannon',
    category: 'Electronics',
    price: 929.99,
    countInStock: 5,
    rating: 3,
    numReviews: 12,
  },
  {
    name: 'Sony Playstation 4 Pro White Version',
    image: `https://juliang22-ecommerce.herokuapp.com/images/playstation.jpg`,
    description:
      'The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music',
    brand: 'Sony',
    category: 'Electronics',
    price: 399.99,
    countInStock: 11,
    rating: 5,
    numReviews: 12,
  },
  {
    name: 'Logitech G-Series Gaming Mouse',
    image: `https://juliang22-ecommerce.herokuapp.com/images/mouse.jpg`,
    description:
      'Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience',
    brand: 'Logitech',
    category: 'Electronics',
    price: 49.99,
    countInStock: 7,
    rating: 3.5,
    numReviews: 10,
  },
  {
    name: 'Amazon Echo Dot 3rd Generation',
    image: `https://juliang22-ecommerce.herokuapp.com/images/alexa.jpg`,
    description:
      'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small space',
    brand: 'Amazon',
    category: 'Electronics',
    price: 29.99,
    countInStock: 0,
    rating: 4,
    numReviews: 12,
  }
]

const randomProducts = Array(150).fill(null).reduce(acc => {
  const product = {
    name: faker.commerce.productName(),
    image: faker.random.image(),
    description: faker.commerce.productDescription(),
    brand: faker.company.companyName(),
    category: faker.commerce.product(),
    price: Number(faker.commerce.price()),
    countInStock: Number(Math.random() * 150).toFixed(0),
    rating: Number(Math.random() * 5).toFixed(2),
    numReviews: Number(Math.random() * 100).toFixed(0),
  }
  acc.push(product)
  return acc
}, [])

const products = [...staticProducts, ...randomProducts]
export default products
