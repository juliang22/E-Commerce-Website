import './css/index.css';
import './css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import { Container } from 'react-bootstrap';
import HomeScreen from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage';
import { CartContextProvider } from './context/CartContext';

const App = () => {
  return (
    <CartContextProvider>
      <Router>
        <Header />
        <main className='py-3'>
          <Container>
            <Route exact path='/' component={HomeScreen} />
            <Route path='/product/:id' component={ProductPage} />
            <Route path='/cart/:id?' component={CartPage} /> {/* Question mark means the id path is optional because we want to be able to go to cart from a particular product page and by just clciking on the cart icon */}
          </Container>
        </main>
        <Footer />
      </Router >
    </CartContextProvider>
  );
}

export default App;
