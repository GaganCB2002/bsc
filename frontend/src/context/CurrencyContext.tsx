/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchUserCurrency, fetchExchangeRates } from '../services/currencyService';
import type { ExchangeRates } from '../services/currencyService';

interface CurrencyContextType {
  currencyCode: string;
  setCurrencyCode: (code: string) => void;
  formatPrice: (amountInINR: number) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currencyCode: 'INR',
  setCurrencyCode: () => {},
  formatPrice: (amountInINR) => `₹${amountInINR.toLocaleString('en-IN')}`,
  isLoading: true,
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState('INR');
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initCurrency = async () => {
      try {
        const [userCurr, exchangeRates] = await Promise.all([
          fetchUserCurrency(),
          fetchExchangeRates('INR')
        ]);
        
        if (exchangeRates) setRates(exchangeRates);
        
        if (exchangeRates && exchangeRates[userCurr]) {
          setCurrencyCode(userCurr);
        } else {
          setCurrencyCode('INR');
        }
      } catch (error) {
        console.error('Failed to initialize currency:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initCurrency();
  }, []);

  const formatPrice = useCallback((amountInINR: number) => {
    if (isNaN(amountInINR) || amountInINR === null || amountInINR === undefined) return '';

    if (!rates || !rates[currencyCode] || currencyCode === 'INR') {
      return `₹${amountInINR.toLocaleString('en-IN')}`;
    }
    
    const convertedAmount = amountInINR * rates[currencyCode];
    
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(convertedAmount);
  }, [rates, currencyCode]);

  return (
    <CurrencyContext.Provider value={{ currencyCode, setCurrencyCode, formatPrice, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

