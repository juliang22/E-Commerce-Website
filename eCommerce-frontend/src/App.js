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
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import UserListScreen from './adminPages/UserListPage';
import AdminRoute from './util/AdminRoute';
import ProductListPage from './adminPages/ProductListPage';
import EditProductPage from './adminPages/EditProductPage';
import CreateProductPage from './adminPages/CreateProductPage';

const App = () => {
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <Router>
          <Header />
          <main className='py-3'>
            <Container>
              {/* Accessed by anyone */}
              <Route exact path='/' component={HomePage} />
              <Route path='/login' component={LoginPage} />
              <Route path='/register' component={RegisterPage} />
              <Route path='/product/:id' component={ProductPage} />
              <AuthRoute path='/cart/:id?' component={CartPage} redirect='/login' /> {/* Question mark means the id path is optional because we want to be able to go to cart from a particular product page and by just clciking on the cart icon */}
              {/* Accessed by logged in users */}
              <AuthRoute path={'/shipping'} component={ShippingPage} />
              <AuthRoute path={'/payment'} component={PaymentPage} />
              <AuthRoute path={'/placeorder'} component={PlaceOrderPage} />
              <AuthRoute path='/order/:id?' component={OrderPage} redirect='/login' />
              <AuthRoute path='/profile' component={ProfilePage} redirect='/login' />
              {/* Accessed by admin users only */}
              <AdminRoute path='/admin/userlist' component={UserListScreen} redirect='/' />
              <AdminRoute path='/admin/productslist' component={ProductListPage} redirect='/' />
              <AdminRoute path='/admin/product/edit/:id' component={EditProductPage} redirect='/' />
              <AdminRoute path='/admin/createproduct' component={CreateProductPage} redirect='/' />
            </Container>
          </main>
          <Footer />
        </Router >
      </CartContextProvider>
    </AuthContextProvider>
  );
}

export default App;
