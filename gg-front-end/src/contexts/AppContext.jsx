// src/context/AppContext.jsx
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export default function AppProvider({ children }) {
  const [user, setUser] = useState(null); // example shared state

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}
