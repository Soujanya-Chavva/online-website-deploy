import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase-config/firebase';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [userOrders, setUserOrders] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      // User is not logged in, handle accordingly (e.g., show a login prompt)
      return;
    }

    const fetchUserOrders = async () => {
      try {
        const ordersQuery = query(
          collection(db, 'orders'),
          where('user_id', '==', user.uid)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserOrders(ordersData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserOrders();
  }, [user]);

  return (
    <div>
        <nav class="navbar navbar-dark bg-dark navbar-fixed-top" style = {{ background:"black"}}><h4 className="neon" style = {{marginTop:"5px"}}>SHOP SPECTRUM</h4>
        <div className="home-container">
        </div>
      </nav>
      <h2>Your Orders</h2>
       {/* Link to navigate back to the products page */}
      <ul>
        {userOrders.map((order) => (
          <li key={order.id}>
            {/* Display order details here */}
            <div
              style={{
                border: '1px solid',
                marginRight: '20px',
                borderRadius: '10px',
                backgroundColor: '#edebeb',
              }}
            >
              Order ID: {order.id}<br />
              Total: {order.order_total}<br />
              Address: {order.order_address}<br />
              {/* Add more order details as needed */}
            </div>
          </li>
        ))}
      </ul>

      <Link style = {{colour: "black"}}to="/products">Go Back</Link>  

    </div>
  );
};

export default Orders;