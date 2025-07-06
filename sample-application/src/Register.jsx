import MessageBox from './MessageBox';
import React, { useState } from 'react';

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

const Register = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const device_id = getCookie('device_id');

    if (!device_id) {
      setErrorMsg('Device ID missing. Please refresh the page.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/register', {  // ✅ Update if using local
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, device_id }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg('Registered Successfully!');
        setErrorMsg('');
        setTimeout(() => {
          setSuccessMsg('');
          onSuccess();
        }, 2000);
      } else {
        setErrorMsg(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMsg('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h5 className="mb-3">Register</h5>

      {errorMsg && <MessageBox type="error" message={errorMsg} />}
      {successMsg && <MessageBox type="success" message={successMsg} />}

      <input
        type="text"
        name="name"
        placeholder="Name"
        className="form-control mb-2"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="form-control mb-2"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="form-control mb-3"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit" className="btn btn-primary w-100">
        Register
      </button>
    </form>
  );
};

export default Register;
