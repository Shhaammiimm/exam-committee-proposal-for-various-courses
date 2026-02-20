import React, { createContext, useContext, useState } from 'react';

const ProposalContext = createContext(null);

export function ProposalProvider({ children }) {
  const [currentProposalId, setCurrentProposalId] = useState(null);

  return (
    <ProposalContext.Provider value={{ currentProposalId, setCurrentProposalId }}>
      {children}
    </ProposalContext.Provider>
  );
}

export function useProposal() {
  const ctx = useContext(ProposalContext);
  return ctx || { currentProposalId: null, setCurrentProposalId: () => {} };
}
