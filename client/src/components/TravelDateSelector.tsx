import { Paper, Text, Group, Stack, Title, Button, Alert, Box, SimpleGrid, rem } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCalendar, IconAlertCircle, IconTrendingUp, IconTrendingDown, IconCloud } from '@tabler/icons-react';
import { useState, useCallback, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';

const MONTHLY_TEMP_DATA: { [key: string]: number[] } = {
  'bangkok': [25.2, 26.8, 28.5, 30.2, 31.5, 30.8, 29.5, 29.2, 28.5, 27.8, 26.2, 24.8],
  'paris': [4.2, 5.1, 8.9, 11.3, 15.8, 19.2, 21.5, 21.0, 17.3, 12.8, 8.5, 5.2],
  'london': [3.8, 4.2, 7.1, 9.8, 14.2, 17.5, 19.8, 19.2, 15.6, 11.2, 7.3, 4.5],
  'tokyo': [3.5, 4.8, 9.2, 14.6, 19.8, 23.5, 28.1, 29.6, 25.2, 18.9, 12.3, 6.1],
  'sydney': [25.8, 25.6, 23.9, 20.1, 16.8, 13.9, 13.2, 14.5, 17.2, 20.1, 22.8, 24.9],
  'new york': [0.2, 2.1, 6.8, 12.5, 18.3, 23.5, 26.1, 25.2, 20.8, 14.2, 8.5, 2.8],
  'dubai': [24.1, 25.8, 29.2, 33.5, 37.8, 40.2, 41.5, 41.2, 38.9, 34.2, 29.5, 25.2],
  'seoul': [0.2, 1.8, 7.5, 13.2, 19.8, 23.5, 26.1, 25.8, 20.2, 13.5, 6.8, 0.5],
  'default': [10, 11, 14, 18, 22, 25, 27, 26, 23, 18, 13, 10],
};

interface TravelDateSelectorProps {
  lat: number;
  lng: number;
  cityName?: string;
}

interface TemperatureTrend {
  date: string;
  month: number;
  day: number;
  avgTemp: number;
  maxTemp: number;
  minTemp: number;
}

export default function TravelDateSelector({ lat, lng, cityName = 'default' }: TravelDateSelectorProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000));
  const [temperatureTrend, setTemperatureTrend] = useState<TemperatureTrend[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getMonthlyTempData = useCallback(() => {
    const cityKey = cityName.toLowerCase().replace(/\s+/g, '');
    return MONTHLY_TEMP_DATA[cityKey as keyof typeof MONTHLY_TEMP_DATA] || MONTHLY_TEMP_DATA['default'];
  }, [cityName]);

  const analyzeTemperatureTrend = () => {
    if (!startDate || !endDate) {
      setError('시작 날짜와 종료 날짜를 모두 선택해주세요');
      return;
    }

    if (startDate > endDate) {
      setError('시작 날짜가 종료 날짜보다 클 수 없습니다');
      return;
    }

    setError(null);
    const monthlyTemps = getMonthlyTempData();
    const trends: TemperatureTrend[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      const monthTemp = monthlyTemps[month];
      const dayVariation = (day - 15) * 0.15;
      const avgTemp = monthTemp + dayVariation;

      trends.push({
        date: currentDate.toISOString().split('T')[0],
        month: month + 1,
        day: day,
        avgTemp: Math.round(avgTemp * 10) / 10,
        maxTemp: Math.round((avgTemp + 4) * 10) / 10,
        minTemp: Math.round((avgTemp - 4) * 10) / 10,
      });

      currentDate.setDate(currentDate.getDate() + 1);
      if (trends.length > 31) break; // Limit to 31 days for performance
    }

    setTemperatureTrend(trends);
  };

  const stats = temperatureTrend.length > 0 ? {
    avgTemp: Math.round((temperatureTrend.reduce((a, b) => a + b.avgTemp, 0) / temperatureTrend.length) * 10) / 10,
    maxTemp: Math.max(...temperatureTrend.map(t => t.maxTemp)),
    minTemp: Math.min(...temperatureTrend.map(t => t.minTemp)),
    dayCount: temperatureTrend.length,
  } : null;

  return (
    <Paper withBorder p="md" radius="md" shadow="xs" bg="white">
      <Stack gap="md">
        <Group justify="space-between" style={{ borderBottom: '1px solid #eee', paddingBottom: rem(10) }}>
          <Group gap="xs">
            <IconCalendar size={20} color="var(--mantine-color-blue-6)" />
            <Title order={4}>여행 일자 선택</Title>
          </Group>
        </Group>

        <SimpleGrid cols={2} spacing="sm">
          <DateInput
            label="시작 날짜"
            placeholder="날짜 선택"
            value={startDate}
            onChange={setStartDate}
            radius="md"
          />
          <DateInput
            label="종료 날짜"
            placeholder="날짜 선택"
            value={endDate}
            onChange={setEndDate}
            radius="md"
          />
        </SimpleGrid>

        <Button onClick={analyzeTemperatureTrend} fullWidth radius="md">
          기온 트렌드 분석
        </Button>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" radius="md">
            {error}
          </Alert>
        )}

        {stats && (
          <Stack gap="md">
            <SimpleGrid cols={3} spacing="xs">
              <Paper withBorder p="xs" radius="md" bg="blue.0">
                <Text size="xs" c="blue.8" fw={700}>평균 기온</Text>
                <Text size="sm" fw={700} style={{ fontFamily: 'monospace' }}>{stats.avgTemp}°C</Text>
              </Paper>
              <Paper withBorder p="xs" radius="md" bg="orange.0">
                <Text size="xs" c="orange.8" fw={700}>최고 기온</Text>
                <Text size="sm" fw={700} style={{ fontFamily: 'monospace' }}>{stats.maxTemp}°C</Text>
              </Paper>
              <Paper withBorder p="xs" radius="md" bg="cyan.0">
                <Text size="xs" c="cyan.8" fw={700}>최저 기온</Text>
                <Text size="sm" fw={700} style={{ fontFamily: 'monospace' }}>{stats.minTemp}°C</Text>
              </Paper>
            </SimpleGrid>

            <Box h={200} style={{ border: '1px solid #eee', borderRadius: rem(8), padding: rem(10) }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={temperatureTrend.map(t => ({ date: t.date.slice(5), avg: t.avgTemp }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="date" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Area type="monotone" dataKey="avg" stroke="#228be6" fill="#e7f5ff" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
