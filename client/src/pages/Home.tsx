import { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Group, 
  Button, 
  AppShell, 
  Header, 
  Footer, 
  Box, 
  Paper, 
  SimpleGrid, 
  Stack,
  Center,
  rem
} from '@mantine/core';
import { IconMapPin, IconInfoCircle } from '@tabler/icons-react';
import MapView from '@/components/MapView';
import WeatherCard from '@/components/WeatherCard';
import CurrencyCalculator from '@/components/CurrencyCalculator';
import MonthlyTemperatureChart from '@/components/MonthlyTemperatureChart';
import TravelDateSelector from '@/components/TravelDateSelector';
import FlightCard from '@/components/FlightCard';
import CitySearch from '@/components/CitySearch';

interface LocationData {
  lat: number;
  lng: number;
  name: string;
  country: string;
  country_code: string;
}

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setSelectedLocation({ lat, lng, name, country: '', country_code: '' });
  };

  const handleSearchSelect = (location: any) => {
    setSelectedLocation({
      lat: location.latitude,
      lng: location.longitude,
      name: location.name,
      country: location.country,
      country_code: location.country_code,
    });
  };

  return (
    <AppShell
      header={{ height: 120 }}
      footer={{ height: 60 }}
      padding="md"
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      <AppShell.Header p="md">
        <Container size="xl">
          <Group justify="space-between" mb="md">
            <div>
              <Title order={2}>Travel Timing Finder</Title>
              <Text size="sm" c="dimmed">데이터 기반 여행 시기 검색 플랫폼</Text>
            </div>
            <Button variant="light" leftSection={<IconInfoCircle size={16} />}>
              사용 가이드
            </Button>
          </Group>
          <Box maw={400}>
            <CitySearch onSelect={handleSearchSelect} />
          </Box>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl">
          <Stack gap="md">
            {/* Map Section */}
            <Paper withBorder shadow="sm" radius="md" overflow="hidden">
              <Box p="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
                <Group justify="space-between">
                  <Group gap="xs">
                    <IconMapPin size={20} />
                    <Text fw={700}>세계 지도</Text>
                  </Group>
                  {selectedLocation && (
                    <Text size="sm">
                      <Text span c="dimmed">선택된 위치: </Text>
                      <Text span fw={500}>{selectedLocation.name}</Text>
                      {selectedLocation.country && (
                        <Text span c="dimmed" ml={5}>({selectedLocation.country})</Text>
                      )}
                    </Text>
                  )}
                </Group>
              </Box>
              <Box h={500}>
                <MapView
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                />
              </Box>
            </Paper>

            {/* Data Cards Section */}
            {!selectedLocation ? (
              <Paper withBorder p={50} radius="md" style={{ borderStyle: 'dashed' }} bg="gray.0">
                <Center>
                  <Stack align="center" gap="sm">
                    <IconMapPin size={48} color="gray" />
                    <Title order={3}>여행지를 검색하거나 지도에서 선택하세요</Title>
                    <Text c="dimmed" ta="center" maw={500}>
                      상단 검색창에서 도시나 국가를 검색하거나, 지도를 클릭하여 여행지를 선택하면 해당 지역의 날씨, 환율, 월별 기온, 항공권 정보를 확인할 수 있습니다.
                    </Text>
                  </Stack>
                </Center>
              </Paper>
            ) : (
              <>
                <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
                  <WeatherCard lat={selectedLocation.lat} lng={selectedLocation.lng} />
                  <CurrencyCalculator
                    countryCode={selectedLocation.country_code}
                    countryName={selectedLocation.country}
                  />
                  <TravelDateSelector 
                    lat={selectedLocation.lat} 
                    lng={selectedLocation.lng} 
                    cityName={selectedLocation.name} 
                  />
                  <MonthlyTemperatureChart lat={selectedLocation.lat} lng={selectedLocation.lng} />
                </SimpleGrid>
                <FlightCard
                  locationName={selectedLocation.name}
                  lat={selectedLocation.lat}
                  lng={selectedLocation.lng}
                />
              </>
            )}
          </Stack>
        </Container>
      </AppShell.Main>

      <AppShell.Footer p="md">
        <Container size="xl">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">© 2025 Travel Timing Finder. 모든 권리 보유.</Text>
            <Group gap="md">
              <Text component="a" href="#" size="sm" c="dimmed">개인정보처리방침</Text>
              <Text component="a" href="#" size="sm" c="dimmed">이용약관</Text>
              <Text component="a" href="#" size="sm" c="dimmed">문의하기</Text>
            </Group>
          </Group>
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
}
