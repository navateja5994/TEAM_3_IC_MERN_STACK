import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  const login = (e) => {

    e.preventDefault();

    if (username === "admin" && password === "admin123") {

      localStorage.setItem("admin", "true");

      navigate("/admin/dashboard");

    } else {

      alert("Invalid Username or Password");

    }

  };


  return (

    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-icon">
          💎
        </div>

        <h1>
          CodeX Admin
        </h1>

        <p className="admin-login-subtitle">
          Welcome back! Please login to continue.
        </p>


        <form onSubmit={login} className="admin-login-form">


          <div className="input-group">

            <label>
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

          </div>


          <div className="input-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>


          <button
            type="submit"
            className="admin-login-button"
          >
            Login
          </button>


        </form>


        <p className="admin-login-footer">
          🔒 Admin access only
        </p>

      </div>

    </div>

  );
}

export default AdminLogin;