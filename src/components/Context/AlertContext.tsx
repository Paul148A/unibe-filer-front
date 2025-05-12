import React, { createContext, useContext, useState } from 'react';
import Alert from '../Global/alert';
// import Alert from '../components/global/Alert';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertContextType {
  showAlert: (message: string, type: AlertType, duration?: number) => void;
}

const AlertContext = createContext<AlertContextType>({
  showAlert: () => {},
});

export const useAlert = () => useContext(AlertContext);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<{
    message: string;
    type: AlertType;
    duration?: number;
  } | null>(null);

  const showAlert = (message: string, type: AlertType, duration = 5000) => {
    setAlert({ message, type, duration });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={closeAlert}
          duration={alert.duration}
        />
      )}
    </AlertContext.Provider>
  );
};