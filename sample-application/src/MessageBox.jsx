// MessageBox.jsx
import React from 'react';

const MessageBox = ({ type, message }) => {
  const color = type === 'success' ? 'green' : 'red';
  const icon = type === 'success' ? '✅' : '❌';

  return (
    <div className="alert" style={{ border: `1px solid ${color}`, padding: '10px', color: color, borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: `${type === 'success' ? '#e6ffe6' : '#ffe6e6'}` }}>
      <span style={{ fontSize: '1.2rem' }}>{icon}</span>
      <span>{message}</span>
    </div>
  );
};

export default MessageBox;