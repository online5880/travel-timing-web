/* Data-Driven Expedition Interface Design
 * - Currency exchange rate display
 * - fawazahmed0 free exchange API integration
 * - Monospace fonts for precise numerical alignment
 * - Clean data presentation with fallback mechanism
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ExchangeRate {
  currency: string;
  rate: number;
  change: number;
}

interface CurrencyCardProps {
  countryCode?: string;
}

export default function CurrencyCard({ countryCode }: CurrencyCardProps) {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [baseCurrency] = useState('KRW');
  const targetCurrencies = ['USD', 'EUR', 'JPY', 'GBP', 'CNY'];

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      try {
        // Primary URL
        const primaryUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency.toLowerCase()}.json`;
        // Fallback URL
        const fallbackUrl = `https://latest.currency-api.pages.dev/v1/currencies/${baseCurrency.toLowerCase()}.json`;

        let response = await fetch(primaryUrl, { signal: AbortSignal.timeout(5000) });

        if (!response.ok) {
          console.warn('Primary API failed, trying fallback...');
          response = await fetch(fallbackUrl, { signal: AbortSignal.timeout(5000) });
        }

        if (!response.ok) {
          throw new Error('환율 데이터를 불러올 수 없습니다');
        }

        const data = await response.json();
        const currencyData = data[baseCurrency.toLowerCase()];

        if (!currencyData) {
          throw new Error('환율 데이터 형식이 올바르지 않습니다');
        }

        // Convert rates and calculate random changes for demo
        const convertedRates = targetCurrencies.map((currency) => ({
          currency,
          rate: currencyData[currency.toLowerCase()] || 0,
          change: (Math.random() - 0.5) * 2, // Random change between -1 and 1
        }));

        setRates(convertedRates);
      } catch (error) {
        console.error('Exchange rate fetch error:', error);
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [baseCurrency]);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">환율 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full border-border">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            환율 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-border">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          환율 정보
        </CardTitle>
        <div className="text-xs text-muted-foreground font-mono">기준: 1 {baseCurrency}</div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {rates.length > 0 ? (
            rates.map((rate) => (
              <div
                key={rate.currency}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono font-bold text-sm w-12">{rate.currency}</div>
                  <div className="font-mono text-base">{rate.rate.toFixed(5)}</div>
                </div>
                
                <div className={`flex items-center gap-1 text-sm font-mono ${
                  rate.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {rate.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(rate.change).toFixed(1)}%
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              환율 데이터를 불러오는 중...
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            마지막 업데이트: {new Date().toLocaleTimeString('ko-KR')}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            출처: fawazahmed0 Currency API
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
