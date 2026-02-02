import { Paper, Text, Group, Stack, SimpleGrid, Title, Loader, Alert, Box, rem } from '@mantine/core';
import { IconCloud, IconDroplets, IconWind, IconEye, IconAlertCircle, IconTemperature } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  wind_speed: number;
  visibility: number;
  icon: string;
}

interface WeatherCardProps {
  lat: number;
  lng: number;
}

const OPENWEATHER_API_KEY = 'b9a96eccd173dac5a8d2579f28f1bc30';

export default function WeatherCard({ lat, lng }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error('날씨 데이터를 불러올 수 없습니다');
        }

        const data = await response.json();
        setWeather({
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          description: data.weather[0].main,
          wind_speed: data.wind.speed,
          visibility: data.visibility,
          icon: data.weather[0].icon,
        });
      } catch (error) {
        console.error('Weather fetch error:', error);
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  if (loading) {
    return (
      <Paper withBorder p="md" radius="md" h="100%">
        <Stack align="center" justify="center" h={200}>
          <Loader size="md" />
          <Text size="sm" c="dimmed">날씨 정보를 불러오는 중...</Text>
        </Stack>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper withBorder p="md" radius="md" h="100%">
        <Alert icon={<IconAlertCircle size={16} />} title="오류" color="red">
          {error}
        </Alert>
      </Paper>
    );
  }

  if (!weather) return null;

  const getTempColor = (temp: number) => {
    if (temp < 10) return 'blue.6';
    if (temp < 20) return 'cyan.6';
    if (temp < 25) return 'green.6';
    if (temp < 30) return 'yellow.7';
    return 'orange.7';
  };

  const getWeatherDescription = (desc: string): string => {
    const descriptions: { [key: string]: string } = {
      'Clear': '맑음',
      'Clouds': '흐림',
      'Rain': '비',
      'Drizzle': '이슬비',
      'Thunderstorm': '뇌우',
      'Snow': '눈',
      'Mist': '안개',
      'Smoke': '연기',
      'Haze': '실안개',
      'Dust': '먼지',
      'Fog': '안개',
      'Sand': '모래',
      'Ash': '화산재',
      'Squall': '돌풍',
      'Tornado': '토네이도',
    };
    return descriptions[desc] || desc;
  };

  return (
    <Paper withBorder p="md" radius="md" shadow="xs" bg="white">
      <Stack gap="md">
        <Group justify="space-between" style={{ borderBottom: '1px solid #eee', paddingBottom: rem(10) }}>
          <Title order={4}>날씨 정보</Title>
          <IconCloud size={20} color="gray" />
        </Group>

        <Group justify="space-between" align="center">
          <Stack gap={0}>
            <Text size={rem(36)} fw={700} c={getTempColor(weather.temp)} style={{ fontFamily: 'monospace' }}>
              {weather.temp.toFixed(1)}°C
            </Text>
            <Text size="sm" c="dimmed" fw={500}>
              {getWeatherDescription(weather.description)}
            </Text>
          </Stack>
          <Box>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
              alt="weather icon"
              style={{ width: rem(64), height: rem(64) }}
            />
          </Box>
        </Group>

        <SimpleGrid cols={2} spacing="md" pt="md" style={{ borderTop: '1px solid #eee' }}>
          <Group gap="xs">
            <IconDroplets size={18} color="var(--mantine-color-blue-5)" />
            <Box>
              <Text size="xs" c="dimmed">습도</Text>
              <Text size="sm" fw={600}>{weather.humidity.toFixed(0)}%</Text>
            </Box>
          </Group>
          
          <Group gap="xs">
            <IconWind size={18} color="var(--mantine-color-gray-5)" />
            <Box>
              <Text size="xs" c="dimmed">풍속</Text>
              <Text size="sm" fw={600}>{weather.wind_speed.toFixed(1)} m/s</Text>
            </Box>
          </Group>

          <Group gap="xs">
            <IconTemperature size={18} color="var(--mantine-color-orange-5)" />
            <Box>
              <Text size="xs" c="dimmed">체감</Text>
              <Text size="sm" fw={600}>{weather.feels_like.toFixed(1)}°C</Text>
            </Box>
          </Group>

          <Group gap="xs">
            <IconEye size={18} color="var(--mantine-color-cyan-5)" />
            <Box>
              <Text size="xs" c="dimmed">가시거리</Text>
              <Text size="sm" fw={600}>{(weather.visibility / 1000).toFixed(1)} km</Text>
            </Box>
          </Group>
        </SimpleGrid>
      </Stack>
    </Paper>
  );
}
