import React, { createContext, useState, useContext } from "react";
import type { MockSession } from "../App"; // or wherever it's defined

interface MockSessionContextType {
  mockSession: MockSession | null;
  setMockSession: (session: MockSession) => void;
}

const MockSessionContext = createContext<MockSessionContextType | undefined>(undefined);

export const MockSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mockSession, setMockSession] = useState<MockSession | null>(null);

  return (
    <MockSessionContext.Provider value={{ mockSession, setMockSession }}>
      {children}
    </MockSessionContext.Provider>
  );
};

export const useMockSession = () => {
  const context = useContext(MockSessionContext);
  if (!context) {
    throw new Error("useMockSession must be used within a MockSessionProvider");
  }
  return context;
};
