export interface ExchangeRates {
  [currencyCode: string]: number;
}

export const fetchUserCurrency = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/currency/');
    if (response.ok) {
      const currency = await response.text();
      if (currency && currency.length === 3) {
        return currency.toUpperCase();
      }
    }
    return 'INR';
  } catch (error) {
    console.error('Error fetching user currency:', error);
    return 'INR';
  }
};

export const fetchExchangeRates = async (baseCurrency = 'INR'): Promise<ExchangeRates | null> => {
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    if (response.ok) {
      const data = await response.json();
      return data.rates;
    }
    return null;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
};
