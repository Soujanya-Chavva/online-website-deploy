import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db , doc} from '../../firebase-config/firebase'; // Import your Firebase configuration
import { signOut } from 'firebase/auth';
import {
  collection,
  getDocs, getDoc, Timestamp, addDoc
} from 'firebase/firestore';
import './Products.css';
import Modal from 'react-modal'; 
import { Link } from 'react-router-dom';


import { BsCart, BsCurrencyRupee, BsFilePerson, BsPersonCircle, BsSearch, BsCartCheck } from "react-icons/bs";

const Products = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState({
    username: '',
    email: '',
    address: '',
  });

  const openUserModal = () => {
    setSelectedUser({
      username: user.username || '',
      email: user.email || '',
      address: user.address || '',
    });
    setIsUserModalOpen(true);
  };


  const incrementQuantity = (product_id) => {
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [product_id]: (prevQuantity[product_id] || 0) + 1,
    }));
  };


  // Function for decrementing the quantity when the user clicks - button
  const decrementQuantity = (product_id) => {
    if (quantity[product_id] > 1) {
      setQuantity((prevQuantity) => ({
        ...prevQuantity,
        [product_id]: prevQuantity[product_id] - 1,
      }));
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        console.log(user.uid,"hey")
      if (user) {
        setUser(user);
  
        // Fetch user's data from 'users' collection
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser((prevUser) => ({ ...prevUser, username: userData.username, email: userData.email, address: userData.user_address}));
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        setUser(null);
      }
    });
  
    // Fetch products from Firestore
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error(error);
      }
    };

  
    fetchProducts();
  
    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddToCart = async (product_id, quantity) => {
    if (!user) {
      // User is not logged in, handle accordingly (e.g., show a login prompt)
      return;
    }
  
    try {
      // Create a new cart item document in the "cart" collection
      const cartItemRef = await addDoc(collection(db, 'cart'), {
        uid: user.uid,
        product_id,
        quantity,
        order_id: null,
        timestamp: Timestamp.now(),
      });
      alert("Added to cart successfully")
      console.log('Item added to cart with ID: ', cartItemRef.id);
    } catch (error) {
      console.error('Error adding item to cart: ', error);
    }
  };



  const handleLogout = async () => {
    if(user){
    try {
    //   await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
}
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark navbar-fixed-top">
        <h4 className="neon">SHOP SPECTRUM</h4>
        {user && (
          <ul className="top-right-list">
            <li style={{ marginRight: "10px", cursor: "pointer" }}>
              <BsPersonCircle
                className="icon"
                onClick={openUserModal}
                />
                {user && <span style={{ marginLeft: "5px", fontSize: "medium" }}>{user.username}   </span>}
            </li>
            <li style={{ marginRight: "10px", cursor: "pointer" }}>
                <Link style={{ color: "white"}} to="/cart" >
                <BsCart className="icon" />Cart
                </Link>
                
            </li>
            <li style={{ marginRight: "10px", cursor: "pointer" }}>
                <Link style={{ color: "white"}} to="/orders" >
                <BsCartCheck className="icon" />Orders
                </Link>
                
            </li>

            <li style={{ marginRight: "10px", cursor: "pointer" }}><span style={{ fontSize: "medium" }} className="link" onClick={handleLogout}>Logout</span></li>

          </ul>
        )}
      </nav>

      <br></br>
    <br></br>
      <h2 className="products_name">PRODUCTS  </h2>

      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <h4 className="productName"  onClick={() => {setSelectedProduct(product);
            setIsModalOpen(true); 
              }} > {product.product_name.slice(0, 50)}...</h4>
            <div>
                <img style={{ width: '200px', height: '400px', border: "1px solid black", marginLeft:"10px" }} src={require(`./images/` + product.image + `.jpg`)} alt={product.product_name} />
            </div>
            <p style = {{marginTop:"10px"}}>Price: <BsCurrencyRupee className="icon"></BsCurrencyRupee>{product.product_price}</p>
            <p>Description: {product.product_description.slice(0, 50)}...</p>

            <div className='product-controls'>
                <button onClick={() => decrementQuantity(product.product_id)}>-</button>
                <input
                  type="number"
                  value={quantity[product.product_id] || 0}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value);
                    setQuantity((prevQuantity) => ({
                      ...prevQuantity,
                      [product.product_id]: newQuantity,
                    }));

                  }}

                />
                <button onClick={() => incrementQuantity(product.product_id)}>+</button>
              </div>

              <br>
              </br>
              <br></br>
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart(product.id, quantity[product.product_id] || 1)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>


        {/* Modal  for product*/}
        <Modal className="Modal" isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        {selectedProduct && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: "80px" }}>
            <div>
            <img style={{ width: '400px', height: '400px', border: "1px solid black", marginLeft:"10px" }}
              src={require(`./images/` + selectedProduct.image + `.jpg`)}
              alt={selectedProduct.product_name}
            />
            </div>
            <div style={{ marginLeft: '100px', marginTop:"0px" }}>
                <h2 style={{ textDecoration: "underline" }}>Product Details</h2>
                <h2 style={{ fontWeight: 'bold', fontSize: 'medium' }}>{selectedProduct.product_name}</h2>
                <p style={{ fontSize: 'medium' }}>Price: <BsCurrencyRupee className="icon" />{selectedProduct.product_price}</p>
                <p style={{ fontSize: 'medium' }}>Description: {selectedProduct.product_description}</p>
                {/* Close button */}
                <button onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        )}
      </Modal>


        {/* User Info Modal */}
      <Modal

      
        className="Modal" 
        isOpen={isUserModalOpen}
        onRequestClose={() => setIsUserModalOpen(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2>User Information</h2>
          <p><strong>Username:</strong> {selectedUser.username}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Address:</strong> {selectedUser.address}</p>
          <button onClick={() => setIsUserModalOpen(false)}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default Products;