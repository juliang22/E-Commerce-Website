import './css/index.css';
import './css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import { Container } from 'react-bootstrap';
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import { CartContextProvider } from './context/CartContext';
import { AuthContextProvider } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AuthRoute from './util/AuthRoute';
import ShippingPage from './pages/ShippingPage';

const App = () => {
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <Router>
          <Header />
          <main className='py-3'>
            <Container>
              <Route exact path='/' component={HomePage} />
              <Route path='/product/:id' component={ProductPage} />
              <AuthRoute path='/cart/:id?' component={CartPage} redirect='/login' /> {/* Question mark means the id path is optional because we want to be able to go to cart from a particular product page and by just clciking on the cart icon */}
              <AuthRoute path={'/shipping'} component={ShippingPage} />
              <Route path='/login' component={LoginPage} />
              <Route path='/register' component={RegisterPage} />
              <AuthRoute path='/profile' component={ProfilePage} redirect='/login' />
            </Container>
          </main>
          <Footer />
        </Router >
      </CartContextProvider>
    </AuthContextProvider>
  );
}

export default App;
