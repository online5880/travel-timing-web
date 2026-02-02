import { Paper, Text, Group, Stack, Title, Button, List, ThemeIcon, rem } from '@mantine/core';
import { IconPlane, IconExternalLink, IconCalendar, IconBulb } from '@tabler/icons-react';

interface FlightCardProps {
  locationName: string;
  lat: number;
  lng: number;
}

export default function FlightCard({ locationName, lat, lng }: FlightCardProps) {
  const handleSearch = (service: string) => {
    let url = '';
    if (service === 'google') url = `https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(locationName)}`;
    else if (service === 'skyscanner') url = `https://www.skyscanner.co.kr/transport/flights/`;
    else if (service === 'kayak') url = `https://www.kayak.co.kr/flights`;
    window.open(url, '_blank');
  };

  return (
    <Paper withBorder p="md" radius="md" shadow="xs" bg="white">
      <Stack gap="md">
        <Group justify="space-between" style={{ borderBottom: '1px solid #eee', paddingBottom: rem(10) }}>
          <Group gap="xs">
            <IconPlane size={20} color="var(--mantine-color-blue-6)" />
            <Title order={4}>항공권 검색</Title>
          </Group>
          <Text size="xs" c="dimmed">{locationName}행</Text>
        </Group>

        <Stack gap="xs">
          <Button 
            variant="light" 
            fullWidth 
            justify="space-between" 
            rightSection={<IconExternalLink size={14} />}
            onClick={() => handleSearch('google')}
          >
            Google Flights
          </Button>
          <Button 
            variant="light" 
            fullWidth 
            justify="space-between" 
            rightSection={<IconExternalLink size={14} />}
            onClick={() => handleSearch('skyscanner')}
          >
            Skyscanner
          </Button>
          <Button 
            variant="light" 
            fullWidth 
            justify="space-between" 
            rightSection={<IconExternalLink size={14} />}
            onClick={() => handleSearch('kayak')}
          >
            Kayak
          </Button>
        </Stack>

        <Stack gap="xs" pt="md" style={{ borderTop: '1px solid #eee' }}>
          <Group gap="xs">
            <IconBulb size={16} color="orange" />
            <Text size="sm" fw={600}>항공권 예약 팁</Text>
          </Group>
          <List
            spacing="xs"
            size="xs"
            center
            icon={
              <ThemeIcon color="blue" size={16} radius="xl">
                <IconCalendar size={rem(10)} />
              </ThemeIcon>
            }
          >
            <List.Item>출발 2-3개월 전 예약 시 가장 저렴</List.Item>
            <List.Item>화요일/수요일 출발편이 일반적으로 저렴</List.Item>
            <List.Item>비수기 여행 시 최대 40% 절약 가능</List.Item>
          </List>
        </Stack>

        <Text size="xs" c="dimmed" ta="right" style={{ fontFamily: 'monospace' }}>
          좌표: {lat.toFixed(4)}, {lng.toFixed(4)}
        </Text>
      </Stack>
    </Paper>
  );
}
