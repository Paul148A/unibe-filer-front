import React, { useEffect } from 'react';
import './Alert.css';

type AlertProps = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
};

const Alert: React.FC<AlertProps> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="alert-close">&times;</button>
    </div>
  );
};

export default Alert;