import React, { useState, useContext, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets.js';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { REACT_APP_USERNAME, REACT_APP_PASSWORD } from '../config/config.js';


const Navbar = ({ setShowLogin, updateUserData }) => {
  const [menu, setMenu] = useState("menu");
  const [token, setToken] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);


  const getToken = async () => {
    try {
      const response = await axios.post('/api/token', {
        username: REACT_APP_USERNAME,
        password: REACT_APP_PASSWORD,
      });
      return response.data.token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };
  const login = async () => {
    const token = await getToken();
    updateToken(token);
    navigate("/");
  }

  const updateToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', {
        username: REACT_APP_USERNAME,
        password: REACT_APP_PASSWORD,
      });

      if (response.data.success) {
        const newToken = response.data.token;
        updateToken(newToken);
        setShowLogin(false);

        // Fetch user data from server using the token
        const userDataResponse = await axios.get('/api/user', {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });

        // Update the user data in the context
        const userData = userDataResponse.data;
        updateUserData(userData);
      } else {
        console.error('Login failed:', response.data.error);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

const { getTotalCartAmount } = useContext(StoreContext);

const navigate = useNavigate();

const logout = () => {
  localStorage.removeItem("token");
  setToken(null);
  navigate("/signin");

}

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>home</Link>
        <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>menu</a>
        <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app"?"active":""}>mobile-app</a>
        <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>contact us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {token ? (
  <div>
  <img src={assets.profile_icon} alt="" onClick={() => {
    setShowProfileDropdown(true);
    console.log(showProfileDropdown);
  }} />
  <ul className={`nav-profile-dropdown ${showProfileDropdown ? 'show' : ''}`}>
    <li>
      <img src={assets.bag_icon} alt="" />
      Orders
    </li>
    <hr />
    <li onClick={logout}>
      <img src={assets.logout_icon} alt="" />
      Logout
    </li>
  </ul>
  </div>
) : (
  <button onClick={() => { handleLogin(); setShowLogin(true); {login} }}>Sign in</button>
)}
      </div>
    </div>
  )
}

export default Navbar
