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
    <Router>
      <Routes>
      <Route exact path="/" element= { <Home/>}/>
      <Route exact path="/login" element= { <Login/>}/>
      <Route exact path="/signup" element= { <Register/>}/>
      <Route exact path="/products" element= { <Products/>}/>
      <Route exact path="/cart" element= { <Cart/>}/>
      <Route exact path = "/orders" element = {<Orders/>} />


      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
