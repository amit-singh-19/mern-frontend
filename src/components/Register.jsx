import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [user, setUser] = useState({});
  const [error, setError] = useState();
  const API_URL = import.meta.env.VITE_API_URL;
  const Navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const url = `${API_URL}/api/users/register`;
      await axios.post(url, user);
      setError("Data saved successfully");
      Navigate("/login");
    } catch (error) {
      console.log(error);
      setError(`${error.message}`);
    }
  };
  return (
    <div className="register-container">
      <h1 className="title">Register</h1>
      <p className="error">{error}</p>
      <form action="">
        <div className="name-field">
          <div className="input">
            <input
              type="text"
              onChange={(e) => setUser({ ...user, firstname: e.target.value })}
              required
            />
            <label htmlFor="firstname">First Name </label>
          </div>
          <div className="input">
            <input
              type="text"
              onChange={(e) => setUser({ ...user, lastname: e.target.value })}
              required
            />
            <label htmlFor="lastname">Last Name </label>
          </div>
        </div>
        <div className="input">
          <input
            type="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
          <label htmlFor="firstname">Email </label>
        </div>
        <div className="input">
          <input
            type="password"
            autoComplete="off"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
          <label htmlFor="firstname">Password </label>
        </div>
        <button onClick={handleSubmit}>Register</button>
        <p>
          Already have account? <Link to="/login" className="login-link">Create Account</Link>
        </p>
      </form>
    </div>
  );
}

// export default function Register() {
//   const firstname = useRef();
//   const lastname = useRef();
//   const email = useRef();
//   const password = useRef();

//   const handleSubmit = () => {
//     const user = {
//       firstname: firstname.current.value,
//       lastname: lastname.current.value,
//       email: email.current.value,
//       password: password.current.value,
//     };

//     console.log(user);
//   };

//   return (
//     <div className="App-Register-Row">
//       <div>
//         <h2>Register Form</h2>
//         <div>
//           <label htmlFor="firstname">First Name: </label>
//           <input type="text" placeholder="Enter First Name" ref={firstname} />
//         </div>
//         <div>
//           <label htmlFor="lastname">Last Name: </label>
//           <input type="text" placeholder="Enter Last Name" ref={lastname} />
//         </div>
//         <div>
//           <label htmlFor="email">Email: </label>
//           <input type="email" placeholder="Enter Email" ref={email} />
//         </div>
//         <div>
//           <label htmlFor="password">Password: </label>
//           <input type="password" placeholder="Enter Password" ref={password} />
//         </div>
//         <div>
//           <button onClick={handleSubmit}>Register</button>
//         </div>
//       </div>
//     </div>
//   );
// }
