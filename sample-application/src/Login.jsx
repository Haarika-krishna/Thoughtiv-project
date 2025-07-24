import React, { useState } from 'react';

const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔑 Get device_id from cookies
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key.trim()] = value;
        return acc;
      }, {});
      const device_id = cookies.device_id;

      const res = await fetch('https://thoughtiv-project-1.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, device_id }), // Include device_id
      });

      const data = await res.json();

      if (data.success) {
          setShowSuccess(true);
          setTimeout(() => {
          setShowSuccess(false);
          onSuccess(); // Navigate to dashboard or close modal
        }, 2000);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h5 className="mb-3">Login</h5>
        <div className="mb-3">
          <input
            type="email"
            className="form-control form-control-lg"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control form-control-lg"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Login</button>
      </form>

      {/* ✅ Success Popup */}
      {showSuccess && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center p-4">
              <div className="text-success mb-3">
                <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5 className="text-success">Login Successful!</h5>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
