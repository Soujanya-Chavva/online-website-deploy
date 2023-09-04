import {
    collection,
    query,
    where,
    getDocs,
    doc,
    deleteDoc,
    getDoc,
    addDoc,
    updateDoc
  } from 'firebase/firestore';
  import { signOut } from 'firebase/auth';
  import React, { useState, useEffect } from 'react';
  import {  useNavigate } from 'react-router-dom';
  import { BsCart, BsCurrencyRupee, BsFilePerson, BsPersonCircle, BsSearch, BsCartCheck } from "react-icons/bs";
  import { auth, db,  } from '../../firebase-config/firebase'; // Import your Firebase configuration
 
  import './Cart.css';
  import { Link } from 'react-router-dom';
  
  const Cart = () => {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [productDetails, setProductDetails] = useState({}); // To store product details (name and price)
    const navigate = useNavigate();
    const [cartTotal, setCartTotal] = useState(0);
    const [address, setAddress] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(false);
    const isAddressValid = address.trim() !== '';


  
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            setUser(user);
  
            // Fetch cart items for the authenticated user
            
            const fetchCartItems = async () => {
              const cartItemsQuery = query(
                collection(db, 'cart'),
                where('uid', '==', user.uid),
                where('order_id', '==', null)
              );
              const cartItemsSnapshot = await getDocs(cartItemsQuery);
              const cartItemsData = cartItemsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
    
              // Create an array of product IDs from cart items
              const productIds = cartItemsData.map((item) => item.product_id);
    
              // Fetch product names and prices based on product IDs
              const productDetailsData = {};
              for (const productId of productIds) {
                try {
                  const productDocRef = doc(db, 'products', productId);
                  const productDoc = await getDoc(productDocRef);
                  if (productDoc.exists()) {
                    const productData = productDoc.data();
                    productDetailsData[productId] = {
                      name: productData.product_name,
                      price: productData.product_price,
                    };
                  }
                } catch (error) {
                  console.error(error);
                }
              }
    
              // Calculate the cart total by summing the prices
              const total = cartItemsData.reduce((acc, item) => {
                const price = productDetailsData[item.product_id]?.price || 0;
                return acc + price * item.quantity;
              }, 0);
    
              setProductDetails(productDetailsData);
              setCartItems(cartItemsData);
              setCartTotal(total);
            };
    
            fetchCartItems();
          } else {
            // User is not authenticated, clear cart items and total
            setCartItems([]);
            setProductDetails({});
            setCartTotal(0);
          }
        });
    
        return () => unsubscribe();
      }, [user]);


    const handleLogout = async () => {
      try {
        await signOut(auth);
        // Redirect to the login page after logout
        // You can use window.location.href or your preferred method here
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleRemoveFromCart = async (cartItemId) => {
      try {
        // Delete the cart item document from Firestore
        await deleteDoc(doc(db, 'cart', cartItemId));
        // Update the cart items state by filtering out the removed item
        setCartItems((prevCartItems) =>
          prevCartItems.filter((item) => item.id !== cartItemId)
        );
      } catch (error) {
        console.error(error);
      }
    };

    const handlePlaceOrder = async () => {
        try {
          if (!user) {
            console.error('User is not authenticated.');
            return;
          }

          if (!isAddressValid) {
            window.alert('Please enter a valid address.');
            return;
          }
      
          // Create a new order document
          const orderData = {
            user_id: user.uid,
            order_total: cartTotal,
            order_address: address,
            order_status: 'placed',
          };
      
          const orderRef = await addDoc(collection(db, 'orders'), orderData);
          alert("Order placed successfully")
      
          // Update the cart items with the order_id
          for (const cartItem of cartItems) {
            const cartItemRef = doc(db, 'cart', cartItem.id);
            await updateDoc(cartItemRef, { order_id: orderRef.id });
          }
      
          setOrderSuccess(true);
          navigate("/products")
        } catch (error) {
          console.error(error);
        }
      };
  
    // ...
  
    return (
      <div>
        <nav className="navbar navbar-dark bg-dark">
          <h4 className="neon">SHOP SPECTRUM</h4>
          {user && (
            <ul>
              <li style={{ marginRight: '10px', cursor: 'pointer' }}>
                <span
                  style={{ fontSize: 'medium', color: 'white' }}
                  className="link"
                  onClick={handleLogout}
                >
                  Logout
                </span>
              </li>
            </ul>
          )}
        </nav>


              {/* Display user_id here */}
      {user && (
        <p>User ID: {user.uid}</p>
      )}


        <h2>Your Cart</h2>
        <ul style={{ listStyleType: 'none' }}>
          {cartItems.length === 0 ? (
            <li>No items in your cart.</li>
          ) : (
            cartItems.map((item) => (
              <li style={{ marginBottom: '10px' }} key={item.id}>
                <div
                  style={{
                    border: '1px solid',
                    marginRight: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#edebeb',
                  }}
                >
                  <strong style={{ marginLeft: '10px', textDecoration: 'underline' }}>
                    Product ID: {item.product_id}
                  </strong>
                  <br></br>
                  <br></br>
                  <p style={{ marginLeft: '10px' }}>Product Name: {productDetails[item.product_id]?.name}</p>
                  <p style={{ marginLeft: '10px' }}>Product Price: {productDetails[item.product_id]?.price}</p>
                  <p style={{ marginLeft: '10px' }}>Quantity: {item.quantity}</p>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    style={{
                      marginBottom: '10px',
                      marginLeft: '10px',
                      height: '35px',
                      borderRadius: '10px',
                    }}
                  >
                     
                    Remove from Cart
                  </button>

                </div>
              </li>
            ))
          )}
        </ul>
        <h4>Cart Total: <BsCurrencyRupee></BsCurrencyRupee>{cartTotal.toFixed(2)}</h4>

        <div>
            <input
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={handlePlaceOrder}  disabled={!isAddressValid}>Place Order</button>
        </div>
      </div>
    );
  };
  
  export default Cart;