import { Paper, Text, Group, Stack, Title, Loader, Alert, Box, SimpleGrid, rem } from '@mantine/core';
import { IconChartBar, IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MonthlyData {
  month: string;
  monthNum: number;
  temp: number;
}

interface MonthlyTemperatureChartProps {
  lat: number;
  lng: number;
}

export default function MonthlyTemperatureChart({ lat, lng }: MonthlyTemperatureChartProps) {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://climate-api.open-meteo.com/v1/climate?latitude=${lat}&longitude=${lng}&start_date=2025-01-01&end_date=2025-12-31&daily=temperature_2m_mean&models=EC_Earth3P_HR`
        );

        if (!response.ok) throw new Error('기상 데이터를 불러올 수 없습니다');

        const result = await response.json();
        const times = result.daily.time;
        const temps = result.daily.temperature_2m_mean;

        const monthlyAverages: { [key: number]: number[] } = {};
        times.forEach((date: string, idx: number) => {
          const month = new Date(date).getMonth() + 1;
          if (!monthlyAverages[month]) monthlyAverages[month] = [];
          monthlyAverages[month].push(temps[idx]);
        });

        const chartData: MonthlyData[] = [];
        const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

        for (let i = 1; i <= 12; i++) {
          if (monthlyAverages[i]) {
            const avg = monthlyAverages[i].reduce((a, b) => a + b, 0) / monthlyAverages[i].length;
            chartData.push({
              month: monthNames[i - 1],
              monthNum: i,
              temp: parseFloat(avg.toFixed(1)),
            });
          }
        }
        setData(chartData);
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    };
    fetchMonthlyData();
  }, [lat, lng]);

  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return '#3b82f6';
    if (temp < 10) return '#06b6d4';
    if (temp < 15) return '#10b981';
    if (temp < 20) return '#eab308';
    if (temp < 25) return '#f97316';
    return '#ef4444';
  };

  if (loading) return <Paper withBorder p="md" radius="md" h={300}><Center h="100%"><Loader /></Center></Paper>;
  if (error) return <Paper withBorder p="md" radius="md"><Alert color="red">{error}</Alert></Paper>;

  const bestMonths = [...data]
    .sort((a, b) => Math.abs(a.temp - 20) - Math.abs(b.temp - 20))
    .slice(0, 3)
    .map(m => m.month)
    .join(', ');

  return (
    <Paper withBorder p="md" radius="md" shadow="xs" bg="white">
      <Stack gap="md">
        <Group justify="space-between" style={{ borderBottom: '1px solid #eee', paddingBottom: rem(10) }}>
          <Group gap="xs">
            <IconChartBar size={20} color="var(--mantine-color-blue-6)" />
            <Title order={4}>2025년 월별 기온</Title>
          </Group>
          <Text size="xs" c="dimmed">추천: {bestMonths}</Text>
        </Group>

        <Box h={200}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="month" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="temp" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getTemperatureColor(entry.temp)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <SimpleGrid cols={3} spacing="xs" pt="xs" style={{ borderTop: '1px solid #eee' }}>
          {[
            { label: '< 0°C', color: '#3b82f6' },
            { label: '0-15°C', color: '#10b981' },
            { label: '> 25°C', color: '#ef4444' }
          ].map(item => (
            <Group key={item.label} gap={4}>
              <Box w={8} h={8} style={{ borderRadius: '50%', backgroundColor: item.color }} />
              <Text size="xs" c="dimmed">{item.label}</Text>
            </Group>
          ))}
        </SimpleGrid>
      </Stack>
    </Paper>
  );
}

import { Center } from '@mantine/core';
