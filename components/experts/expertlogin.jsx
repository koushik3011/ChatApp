"use client";

import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import styles from '../../styles/ExpertLogin.module.css';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [isLoginActive, setIsLoginActive] = useState(true); // State to toggle between login and signup forms
  const [signupName, setSignupName] = useState(''); // State for signup username
  const [signupEmail, setSignupEmail] = useState(''); // State for signup email
  const [signupPassword, setSignupPassword] = useState(''); // State for signup password
  const [loginUsername, setLoginUsername] = useState(''); // State for login username
  const [loginPassword, setLoginPassword] = useState(''); // State for login password
  const [Description, setdescription] = useState(''); // State for signup description
  const [usernameAvailable, setUsernameAvailable] = useState(true); // State to check if username is available
  const [usernameChecked, setUsernameChecked] = useState(false); // State to check if username has been checked
  const [style, setStyle] = useState({ display: "none", color: "green" }); // Style for success message
  const [content, setContent] = useState(""); // State for login error message

  useEffect(() => {
    // Function to check if the user is already logged in
    const fetchData = async () => {
      try {
        const response = await fetch('/api/expert/check-login', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        // Check if response is OK
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        // Redirect if user is already logged in
        if (data.id) {
          router.push(`/expert/${data.id.value}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error condition if needed
      }
    };
    fetchData();
  }, []);

  // Function to switch to the signup form
  const handleRegisterClick = () => {
    setIsLoginActive(false);
  };

  // Function to switch to the login form
  const handleLoginClick = () => {
    setIsLoginActive(true);
  };

  // Function to handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/expert/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: signupName, email: signupEmail,
         password: signupPassword, description: Description })
    });
    const data = await response.json();
    console.log(data);
    // Display success message and reset form fields
    if (data.message === 'Expert created successfully') {
      setUsernameChecked(false);
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setdescription('');
      setStyle({ display: "block", color: "green" });
    }
  };

  // Function to handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/expert/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
      username: loginUsername,
      password: loginPassword }),
      credentials: 'include'
    });
    const data = await response.json();
    console.log(data);
    // Redirect if login is successful, otherwise display error message
    if (data.message === 'Success') {
      return router.push(`/expert/${data.ExpertID}`); // Change to absolute URL if necessary
    } else {
      setContent(data.message);
    }
  };

  // Function to handle username change during signup
  const handleUsernameChange = async (e) => {
    const username = e.target.value;
    setSignupName(username);
    setUsernameChecked(true);
    // Check username availability if username is not empty
    if (username.length > 0) {
      const response = await fetch('/api/expert/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      console.log(data);
      setUsernameAvailable(data.available);
    } else {
      setUsernameAvailable(true);
    }
  };
  return (
    <div className={styles.body}>
      <div className={`${styles.container} ${isLoginActive ? '' : styles.active}`} id="container">  
        {/* Signup form */}
        <div className={`${styles['form-container']} ${styles['sign-up']}`}>
          <form onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <input
              required
              type="text"
              placeholder="Username"
              value={signupName}
              onChange={handleUsernameChange}
            />
            {usernameChecked && (
              <span style={{ color: usernameAvailable ? 'green' : 'red' }}>
                {usernameAvailable ? 'Username is available' : 'Username is taken'}
              </span>
            )}
            <input
              required
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <textarea
              type="text"
              placeholder="Description"
              value={Description}
              onChange={(e) => setdescription(e.target.value)}
            />
            <p style={style}>Account Created Successfully</p>
            <button type="submit" disabled={!usernameAvailable}>Sign Up</button>
          </form>
        </div>
        {/* Login form */}
        <div className={`${styles['form-container']} ${styles['sign-in']}`}>
          <form onSubmit={handleLogin}>
            <h1>Sign In</h1>
            <input
              required
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <p style={{ color: "red" }}>{content}</p>
            <button type="submit">Sign In</button>
          </form>
        </div>
        {/* Toggle container for switching between login and signup */}
        <div className={styles['toggle-container']}>
          <div className={styles.toggle}>
            <div className={`${styles['toggle-panel']} ${styles['toggle-left']}`}>
              <h1>Expert</h1>
              <p>Already have an account?</p>
              <button className={styles.hidden} id="login" onClick={handleLoginClick}>Sign In</button>
            </div>
            <div className={`${styles['toggle-panel']} ${styles['toggle-right']}`}>
              <h1>Expert Account</h1>
              <p>Dont have an account?</p>
              <button className={styles.hidden} id="register" onClick={handleRegisterClick}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
