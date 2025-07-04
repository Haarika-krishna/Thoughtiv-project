// MessageBox.jsx
import React from 'react';

const MessageBox = ({ type = 'success', message }) => {
  const styles = {
    success: {
      icon: '✔️',
      bg: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb',
    },
    error: {
      icon: '❌',
      bg: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
    },
    info: {
      icon: 'ℹ️',
      bg: '#d1ecf1',
      color: '#0c5460',
      border: '1px solid #bee5eb',
    },
  };

  const style = styles[type] || styles.success;

  return (
    <div style={{
      backgroundColor: style.bg,
      color: style.color,
      border: style.border,
      padding: '12px 20px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '15px'
    }}>
      <span style={{ fontSize: '1.5rem' }}>{style.icon}</span>
      <span>{message}</span>
    </div>
  );
};

export default MessageBox;
