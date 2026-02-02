import { useState, useEffect } from 'react';
import { TextInput, Paper, Text, Group, Stack, UnstyledButton, Loader, Box } from '@mantine/core';
import { IconSearch, IconMapPin } from '@tabler/icons-react';
import { useClickOutside, useDebouncedValue } from '@mantine/hooks';

interface SearchResult {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  country_code: string;
}

interface CitySearchProps {
  onSelect: (location: SearchResult) => void;
}

export default function CitySearch({ onSelect }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useClickOutside(() => setShowResults(false));

  useEffect(() => {
    const fetchResults = async () => {
      // 한 글자 검색도 허용하도록 변경 (한국어 특성 고려)
      if (debouncedQuery.trim().length < 1) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        // Open-Meteo Geocoding API 사용
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(debouncedQuery)}&count=10&language=ko&format=json`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const formattedResults = data.results.map((result: any) => ({
            name: result.name,
            admin1: result.admin1,
            country: result.country,
            latitude: result.latitude,
            longitude: result.longitude,
            country_code: result.country_code,
          }));
          setResults(formattedResults);
          setShowResults(true);
        } else {
          // 한국어 검색 결과가 없을 경우 영문 검색 시도 (예: 서울 -> Seoul)
          setResults([]);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSelect = (result: SearchResult) => {
    onSelect(result);
    setQuery(result.name); // 선택한 이름으로 입력창 업데이트
    setShowResults(false);
  };

  return (
    <Box ref={searchRef} pos="relative" w="100%">
      <TextInput
        placeholder="도시 또는 국가 검색 (예: 서울, Tokyo, France)"
        leftSection={<IconSearch size={16} />}
        rightSection={loading ? <Loader size="xs" /> : null}
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        onFocus={() => query.length >= 1 && setShowResults(true)}
        radius="md"
        size="md"
      />

      {showResults && (
        <Paper
          pos="absolute"
          top="100%"
          left={0}
          right={0}
          mt="xs"
          shadow="xl"
          withBorder
          radius="md"
          style={{ zIndex: 1000, overflow: 'hidden' }}
        >
          {results.length > 0 ? (
            <Stack gap={0}>
              {results.map((result, idx) => (
                <UnstyledButton
                  key={`${result.latitude}-${result.longitude}-${idx}`}
                  onClick={() => handleSelect(result)}
                  p="sm"
                  style={(theme) => ({
                    borderBottom: idx !== results.length - 1 ? `1px solid ${theme.colors.gray[2]}` : 'none',
                    '&:hover': { backgroundColor: theme.colors.gray[0] }
                  })}
                >
                  <Group gap="sm" wrap="nowrap">
                    <IconMapPin size={18} color="var(--mantine-color-blue-6)" style={{ flexShrink: 0 }} />
                    <Stack gap={2}>
                      <Text size="sm" fw={600}>{result.name}</Text>
                      <Text size="xs" c="dimmed">
                        {result.admin1 && `${result.admin1}, `}{result.country}
                      </Text>
                    </Stack>
                  </Group>
                </UnstyledButton>
              ))}
            </Stack>
          ) : debouncedQuery.length >= 1 && !loading ? (
            <Box p="md">
              <Text size="sm" c="dimmed" ta="center">
                '{debouncedQuery}'에 대한 검색 결과가 없습니다.
                <br />
                영문 이름으로 검색해 보세요. (예: Seoul)
              </Text>
            </Box>
          ) : null}
        </Paper>
      )}
    </Box>
  );
}
