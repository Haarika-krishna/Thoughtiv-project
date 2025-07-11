
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const  Price = ()=> {
  const plans = [
    {
      title: 'Free',
      price: 0,
      description: 'Basic web scraping access for individual and you can get 20 results in one request.',
    },
    {
      title: 'Developer',
      price: 500,
      description: 'Advanced access for developers and can get 100 results in single request.',
    },
    {
      title: 'Startup',
      price: 1500,
      description: 'Perfect for small startups needing regular data and can get 400 results in single request..',
    },
    {
      title: 'Business',
      price: 2500,
      description: 'Full access for businesses with high-volume scraping needs and can get 800 results in single request..',
    },
  ];

  return (
    <div className="container-fluid py-5">
      <h2 className="text-center mb-4">Want to start</h2>
      <div className="row">
        {plans.map((plan, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">{plan.title}</h5>
                <h6 className="card-price">₹{plan.price}/month</h6>
                <p className="card-text">{plan.description}</p>
                <button className="btn btn-primary mt-3">Choose Plan</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Price;
