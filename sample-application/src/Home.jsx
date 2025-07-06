import React, { useState, useEffect } from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';

const Home = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [place, setPlace] = useState('');
  const [limit, setLimit] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const navigate = useNavigate();

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  const setCookie = (name, value, years) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + years);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
  };

  useEffect(() => {
    let deviceId = getCookie('device_id');
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setCookie('device_id', deviceId, 10);
    }
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setResults([]);

    const device_id = getCookie('device_id');

    try {
      // Step 1: Check permission first
      const permissionRes = await fetch('https://thoughtiv-apiproject.onrender.com/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    device_id,
    keyword,
    location: place,
    limit
  }),
});


      const permissionData = await permissionRes.json();

      if (!permissionData.success) {
        const msg = permissionData.message || '';

        if (msg.toLowerCase().includes('register')) {
          setShowRegisterPrompt(true);
        } else if (msg.toLowerCase().includes('premium')) {
          setShowPremiumPrompt(true);
        } else {
          setError(msg || 'Unknown error occurred');
        }

        setLoading(false);
        return;
      }

      // Step 2: If allowed, fetch actual search results
      const res = await fetch('https://thoughtiv-apiproject.onrender.com/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, location: place, limit, device_id }),
      });

      const data = await res.json();

      if (data.success) {
        setResults(data.data || []);
      } else {
        setError(data.message || 'Search failed');
      }

    } catch (err) {
      console.error('Search error:', err);
      setError('Something went wrong while searching.');
    }

    setLoading(false);
  };

  return (
    <>
      <div className="homepage-container">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
          <div className="container-fluid ps-4 w-100">
            <Link className="navbar-brand fw-bold" to="/">SerpAPI</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item"><Link className="nav-link" to="/docs">Documentation</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/integration">Integration</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/pricing">Pricing</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/features">Features</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/usecases">Use Cases</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/team">Team</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/faq">FAQ</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/contact">Contact Us</Link></li>
              </ul>
              <div className="d-flex p-3">
                <button onClick={() => setShowLogin(true)} className="link-button">Login</button>
                <button onClick={() => setShowRegister(true)} className="link-button">Register</button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="hero text-center text-white">
          <div className="container-fluid">
            <h1 className="display-4 fw-bold">Google Maps API</h1>
            <p className="lead">Search and download businesses using Google Maps API</p>

            {/* Input Section */}
            <div className="container my-4 inputbox">
              <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-4">
                <input type="text" className="form-control form-control-lg" placeholder="Keyword"
                  style={{ maxWidth: '200px' }} value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <input type="text" className="form-control form-control-lg" placeholder="Place"
                  style={{ maxWidth: '200px' }} value={place} onChange={(e) => setPlace(e.target.value)} />
                <input type="number" className="form-control form-control-lg" placeholder="No. of results"
                  style={{ maxWidth: '200px' }} value={limit} onChange={(e) => setLimit(e.target.value)} />
                <button className="btn btn-primary btn-lg text-center search-btn"
                  onClick={handleSearch} disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Results Section */}
        <section className="results-section py-5">
          <div className="container">
            <h3 className="text-center mb-4">Search Results</h3>
            {error && <p className="text-danger text-center">{error}</p>}
            {results.length === 0 && !loading && !error && (
              <p className="text-center">No results to show</p>
            )}
            <div className="row">
              {results.map((item, index) => (
                <div className="col-md-4 mb-3" key={index}>
                  <div className="card p-3 shadow-sm">
                    <h5>{item.title}</h5>
                    <p>{item.address}</p>
                    {item.phone && <p><strong>Phone:</strong> {item.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer text-center py-4 bg-dark text-white">
          <p>© 2025 API Scraper. All rights reserved.</p>
        </footer>
      </div>

      {/* Modals */}
      {showRegister && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowRegister(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content p-4">
              <div className="modal-header">
                <h5 className="modal-title">Register</h5>
                <button type="button" className="btn-close" onClick={() => setShowRegister(false)}></button>
              </div>
              <div className="modal-body">
                <Register onSuccess={() => {
                  setShowRegister(false);
                  setShowRegisterSuccess(true);
                  setTimeout(() => setShowRegisterSuccess(false), 2000);
                }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowLogin(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content p-4">
              <div className="modal-header">
                <h5 className="modal-title">Login</h5>
                <button type="button" className="btn-close" onClick={() => setShowLogin(false)}></button>
              </div>
              <div className="modal-body">
                <Login onSuccess={() => {
                  setShowLogin(false);
                  setShowLoginSuccess(true);
                  setTimeout(() => {
                    setShowLoginSuccess(false);
                    navigate('/dashboard');
                  }, 2000);
                }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showLoginSuccess && (
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

      {showRegisterSuccess && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center p-4">
              <div className="text-success mb-3">
                <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5 className="text-success">Registered Successfully!</h5>
            </div>
          </div>
        </div>
      )}

     {/* Register Prompt Modal */}
{showRegisterPrompt && (
  <div
    className="modal show fade d-block"
    tabIndex="-1"
    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    onClick={() => setShowRegisterPrompt(false)}
  >
    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content p-4 rounded-4 shadow-lg border-0" style={{ background: '#ffffff' }}>
        <div className="modal-header border-0">
          <h5 className="modal-title w-100 text-center fw-semibold" style={{ color: '#333' }}>
            🚀 Unlock More Searches
          </h5>
        </div>
        <div className="modal-body text-center">
          <p className="text-muted">You've used your 1 free search.</p>
          <p className="fw-medium">Register now to continue using our service!</p>
          <button
            className="btn btn-primary px-4 py-2 rounded-pill mt-3"
            onClick={() => {
              setShowRegisterPrompt(false);
              setShowRegister(true);
            }}
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Premium Prompt Modal */}
      {showPremiumPrompt && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowPremiumPrompt(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content text-center p-4">
              <h5>Upgrade to Premium</h5>
              <p>You’ve used your free search limit. Unlock unlimited access by upgrading to premium.</p>
              <button className="btn btn-warning" onClick={() => {
                setShowPremiumPrompt(false);
                navigate('/pricing');
              }}>Upgrade Now</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
