import { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Group, 
  Button, 
  AppShell, 
  Box, 
  Paper, 
  SimpleGrid, 
  Stack,
  Center
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
      header={{ height: 80 }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Container size="xl" h="100%">
          <Group justify="space-between" h="100%" wrap="nowrap">
            <Box style={{ flexShrink: 0 }}>
              <Title order={3} c="blue.7" style={{ whiteSpace: 'nowrap' }}>Travel Timing</Title>
              <Text size="xs" c="dimmed" visibleFrom="xs">데이터 기반 여행 가이드</Text>
            </Box>
            <Box style={{ flexGrow: 1, maxWidth: rem(500) }}>
              <CitySearch onSelect={handleSearchSelect} />
            </Box>
            <Button variant="light" leftSection={<IconInfoCircle size={16} />} visibleFrom="sm">
              가이드
            </Button>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main bg="gray.0">
        <Container size="xl" py="md">
          <Stack gap="lg">
            {/* Map Section */}
            <Paper withBorder shadow="sm" radius="md" style={{ overflow: 'hidden', backgroundColor: 'white' }}>
              <Box p="xs" style={{ borderBottom: '1px solid #eee' }}>
                <Group justify="space-between">
                  <Group gap="xs">
                    <IconMapPin size={20} color="var(--mantine-color-blue-6)" />
                    <Text fw={700}>세계 지도</Text>
                  </Group>
                  {selectedLocation && (
                    <Text size="sm" fw={500} c="blue.8">
                      {selectedLocation.name} {selectedLocation.country && `(${selectedLocation.country})`}
                    </Text>
                  )}
                </Group>
              </Box>
              <Box style={{ height: '450px', position: 'relative' }}>
                <MapView
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                />
              </Box>
            </Paper>

            {/* Data Cards Section */}
            {!selectedLocation ? (
              <Paper withBorder p={80} radius="md" style={{ borderStyle: 'dashed' }} bg="white">
                <Center>
                  <Stack align="center" gap="sm">
                    <IconMapPin size={48} color="var(--mantine-color-gray-3)" />
                    <Title order={3} c="gray.6">여행지를 검색하거나 지도에서 선택하세요</Title>
                    <Text c="dimmed" ta="center" maw={500}>
                      상단 검색창에서 도시를 검색하거나 지도를 클릭하면 날씨, 환율, 항공권 정보를 확인할 수 있습니다.
                    </Text>
                  </Stack>
                </Center>
              </Paper>
            ) : (
              <>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
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

      <Box component="footer" p="xl" bg="white" style={{ borderTop: '1px solid #eee', marginTop: 'auto' }}>
        <Container size="xl">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">© 2025 Travel Timing Finder. All rights reserved.</Text>
            <Group gap="lg">
              <Text component="a" href="#" size="sm" c="dimmed">Privacy</Text>
              <Text component="a" href="#" size="sm" c="dimmed">Terms</Text>
            </Group>
          </Group>
        </Container>
      </Box>
    </AppShell>
  );
}

function rem(px: number) {
  return `${px / 16}rem`;
}
