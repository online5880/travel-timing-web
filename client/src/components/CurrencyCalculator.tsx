import { useEffect, useState } from 'react';
import { Paper, Title, Text, NumberInput, Stack, Group, Box, Divider, Alert, Loader } from '@mantine/core';
import { IconCoin, IconArrowsExchange, IconAlertCircle, IconClock } from '@tabler/icons-react';

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyCalculatorProps {
  countryCode?: string;
  countryName?: string;
}

export default function CurrencyCalculator({ countryCode, countryName }: CurrencyCalculatorProps) {
  const [rates, setRates] = useState<ExchangeRates>({});
  const [krwAmount, setKrwAmount] = useState<number | string>(10000);
  const [targetAmount, setTargetAmount] = useState<number | string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const countryToCurrency: { [key: string]: string } = {
    US: 'USD', GB: 'GBP', JP: 'JPY', CN: 'CNY', EU: 'EUR', IN: 'INR', BR: 'BRL', MX: 'MXN',
    AU: 'AUD', CA: 'CAD', SG: 'SGD', HK: 'HKD', TH: 'THB', VN: 'VND', PH: 'PHP', ID: 'IDR',
    MY: 'MYR', NZ: 'NZD', CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN', CZ: 'CZK',
    HU: 'HUF', RO: 'RON', TR: 'TRY', RU: 'RUB', ZA: 'ZAR', EG: 'EGP', SA: 'SAR', AE: 'AED', IL: 'ILS',
    KR: 'KRW', FR: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR',
  };

  useEffect(() => {
    if (countryCode) {
      const currency = countryToCurrency[countryCode.toUpperCase()] || 'USD';
      setTargetCurrency(currency);
    }
  }, [countryCode]);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/krw.json`);
        if (!response.ok) throw new Error('환율 데이터를 불러올 수 없습니다');
        
        const data = await response.json();
        const krwRates = data.krw || {};
        setRates(krwRates);
        setLastUpdate(new Date());

        const currencyKey = targetCurrency.toLowerCase();
        if (krwAmount && krwRates[currencyKey]) {
          const converted = Number(krwAmount) * krwRates[currencyKey];
          setTargetAmount(Number(converted.toFixed(2)));
        }
      } catch (error) {
        console.error('Exchange rate fetch error:', error);
        setError('환율 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [targetCurrency]);

  const handleKrwChange = (val: number | string) => {
    setKrwAmount(val);
    const currencyKey = targetCurrency.toLowerCase();
    if (val !== '' && rates[currencyKey]) {
      const converted = Number(val) * rates[currencyKey];
      setTargetAmount(Number(converted.toFixed(2)));
    } else {
      setTargetAmount('');
    }
  };

  const handleTargetChange = (val: number | string) => {
    setTargetAmount(val);
    const currencyKey = targetCurrency.toLowerCase();
    if (val !== '' && rates[currencyKey]) {
      const converted = Number(val) / rates[currencyKey];
      setKrwAmount(Math.round(converted));
    } else {
      setKrwAmount('');
    }
  };

  const currentRate = rates[targetCurrency.toLowerCase()] || 0;
  const displayRate = currentRate !== 0 ? (1 / currentRate).toFixed(2) : '0.00';

  return (
    <Paper withBorder shadow="sm" radius="md" p="md" h="100%">
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap="xs">
            <IconCoin size={20} color="var(--mantine-color-blue-6)" />
            <Title order={4}>환율 계산기</Title>
          </Group>
          {countryName && (
            <Text size="xs" c="dimmed" fw={500}>
              {countryName} ({targetCurrency})
            </Text>
          )}
        </Group>

        {error ? (
          <Alert icon={<IconAlertCircle size={16} />} title="오류" color="red">
            {error}
          </Alert>
        ) : loading ? (
          <Group justify="center" py="xl"><Loader size="sm" /></Group>
        ) : (
          <>
            <Box p="sm" bg="blue.0" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
              <Text size="xs" c="blue.7" fw={700} mb={4}>현재 환율</Text>
              <Text size="xl" fw={800} c="blue.9">
                1 {targetCurrency} = {displayRate} KRW
              </Text>
            </Box>

            <Stack gap="xs">
              <NumberInput
                label="대한민국 원 (KRW)"
                placeholder="금액 입력"
                value={krwAmount}
                onChange={handleKrwChange}
                thousandSeparator=","
                suffix=" ₩"
                hideControls
              />
              
              <Group justify="center">
                <IconArrowsExchange size={20} color="gray" />
              </Group>

              <NumberInput
                label={`${targetCurrency} 금액`}
                placeholder="변환 금액"
                value={targetAmount}
                onChange={handleTargetChange}
                thousandSeparator=","
                suffix={` ${targetCurrency}`}
                hideControls
              />
            </Stack>

            <Divider />

            <Group justify="space-between">
              <Group gap={4}>
                <IconClock size={12} color="gray" />
                <Text size="10px" c="dimmed">
                  업데이트: {lastUpdate ? lastUpdate.toLocaleTimeString('ko-KR') : '-'}
                </Text>
              </Group>
              <Text size="10px" c="dimmed">출처: fawazahmed0 API</Text>
            </Group>
          </>
        )}
      </Stack>
    </Paper>
  );
}
