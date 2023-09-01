import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Products from './Pages/Products/Products';
import Cart from './Pages/Cart/Cart';
import Orders from './Pages/Orders/Orders';

function App() {
  return (
    <div>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"/>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <Router basename='/online-website-deploy'>
      <Routes>
      <Route exact path="/" element= { <Home/>}/>
      <Route  path="/login" element= { <Login/>}/>
      <Route  path="/signup" element= { <Register/>}/>
      <Route  path="/products" element= { <Products/>}/>
      <Route  path="/cart" element= { <Cart/>}/>
      <Route  path = "/orders" element = {<Orders/>} />


      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
