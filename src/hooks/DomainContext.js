import React, { createContext, useState } from 'react';

// Create the context
export const DomainContext = createContext();

// Create the provider component
export const DomainProvider = ({ children }) => {
  const [selectedDomain, setSelectedDomain] = useState('');  // State for selectedDomain

  return (
    <DomainContext.Provider value={{ selectedDomain, setSelectedDomain }}>
      {children}
    </DomainContext.Provider>
  );
};
