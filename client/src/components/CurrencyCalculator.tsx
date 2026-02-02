/* Data-Driven Expedition Interface Design
 * - Currency exchange calculator
 * - Real-time conversion with selected country currency
 * - Bidirectional calculation (KRW ↔ Target Currency)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyCalculatorProps {
  countryCode?: string;
  countryName?: string;
}

export default function CurrencyCalculator({ countryCode, countryName }: CurrencyCalculatorProps) {
  const [rates, setRates] = useState<ExchangeRates>({});
  const [krwAmount, setKrwAmount] = useState<string>('10000');
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Currency code mapping by country
  const countryToCurrency: { [key: string]: string } = {
    US: 'USD',
    GB: 'GBP',
    JP: 'JPY',
    CN: 'CNY',
    EU: 'EUR',
    IN: 'INR',
    BR: 'BRL',
    MX: 'MXN',
    AU: 'AUD',
    CA: 'CAD',
    SG: 'SGD',
    HK: 'HKD',
    TH: 'THB',
    VN: 'VND',
    PH: 'PHP',
    ID: 'IDR',
    MY: 'MYR',
    NZ: 'NZD',
    CH: 'CHF',
    SE: 'SEK',
    NO: 'NOK',
    DK: 'DKK',
    PL: 'PLN',
    CZ: 'CZK',
    HU: 'HUF',
    RO: 'RON',
    TR: 'TRY',
    RU: 'RUB',
    ZA: 'ZAR',
    EG: 'EGP',
    SA: 'SAR',
    AE: 'AED',
    IL: 'ILS',
  };

  useEffect(() => {
    if (countryCode) {
      const currency = countryToCurrency[countryCode] || 'USD';
      setTargetCurrency(currency);
    }
  }, [countryCode]);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const primaryUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/krw.json`;
        const fallbackUrl = `https://latest.currency-api.pages.dev/v1/currencies/krw.json`;

        let response = await fetch(primaryUrl, { signal: AbortSignal.timeout(5000) });

        if (!response.ok) {
          response = await fetch(fallbackUrl, { signal: AbortSignal.timeout(5000) });
        }

        if (!response.ok) {
          throw new Error('환율 데이터를 불러올 수 없습니다');
        }

        const data = await response.json();
        setRates(data.krw || {});
        setLastUpdate(new Date());

        // Auto-calculate target amount
        if (krwAmount) {
          const amount = parseFloat(krwAmount);
          if (!isNaN(amount) && data.krw[targetCurrency.toLowerCase()]) {
            const converted = amount * data.krw[targetCurrency.toLowerCase()];
            setTargetAmount(converted.toFixed(2));
          }
        }
      } catch (error) {
        console.error('Exchange rate fetch error:', error);
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  // Handle KRW input change
  const handleKrwChange = (value: string) => {
    setKrwAmount(value);
    const amount = parseFloat(value);
    if (!isNaN(amount) && rates[targetCurrency.toLowerCase()]) {
      const converted = amount * rates[targetCurrency.toLowerCase()];
      setTargetAmount(converted.toFixed(2));
    } else {
      setTargetAmount('');
    }
  };

  // Handle target currency input change
  const handleTargetChange = (value: string) => {
    setTargetAmount(value);
    const amount = parseFloat(value);
    if (!isNaN(amount) && rates[targetCurrency.toLowerCase()]) {
      const converted = amount / rates[targetCurrency.toLowerCase()];
      setKrwAmount(converted.toFixed(0));
    } else {
      setKrwAmount('');
    }
  };

  const currentRate = rates[targetCurrency.toLowerCase()] || 0;
  const displayRate = (1 / currentRate).toFixed(2);

  if (error) {
    return (
      <Card className="h-full border-border">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            환율 계산기
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
          환율 계산기
        </CardTitle>
        {countryName && (
          <div className="text-xs text-muted-foreground font-mono mt-2">
            {countryName} ({targetCurrency})
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Exchange Rate Display */}
        <div className="p-3 bg-muted rounded border border-border">
          <div className="text-xs text-muted-foreground mb-2">환율</div>
          <div className="font-mono font-bold text-lg">
            1 {targetCurrency} = {displayRate} KRW
          </div>
        </div>

        {/* KRW Input */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            한국 원 (KRW)
          </label>
          <div className="relative">
            <Input
              type="number"
              value={krwAmount}
              onChange={(e) => handleKrwChange(e.target.value)}
              placeholder="금액 입력"
              className="font-mono border-border pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground font-mono">
              ₩
            </div>
          </div>
        </div>

        {/* Conversion Arrow */}
        <div className="flex justify-center py-2">
          <div className="text-muted-foreground text-xs">↕</div>
        </div>

        {/* Target Currency Input */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {targetCurrency}
          </label>
          <div className="relative">
            <Input
              type="number"
              value={targetAmount}
              onChange={(e) => handleTargetChange(e.target.value)}
              placeholder="변환 금액"
              className="font-mono border-border pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground font-mono">
              {targetCurrency === 'USD' && '$'}
              {targetCurrency === 'EUR' && '€'}
              {targetCurrency === 'JPY' && '¥'}
              {targetCurrency === 'GBP' && '£'}
              {targetCurrency === 'CNY' && '¥'}
              {!['USD', 'EUR', 'JPY', 'GBP', 'CNY'].includes(targetCurrency) && targetCurrency}
            </div>
          </div>
        </div>

        {/* Update Time */}
        <div className="pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground">
            마지막 업데이트: {lastUpdate ? lastUpdate.toLocaleTimeString('ko-KR') : '-'}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            출처: fawazahmed0 Currency API
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
