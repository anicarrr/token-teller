"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChainIdList } from '@/enums';

interface AppContextType {
  selectedChainId: number;
  setSelectedChainId: (chainId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [selectedChainId, setSelectedChainId] = useState<number>(ChainIdList.EthereumSepolia);

  const value = {
    selectedChainId,
    setSelectedChainId,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}