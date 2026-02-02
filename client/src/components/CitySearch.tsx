import { useState, useEffect, useRef } from 'react';
import { TextInput, Paper, Text, Group, Stack, UnstyledButton, Loader, Box } from '@mantine/core';
import { IconSearch, IconMapPin } from '@tabler/icons-react';
import { useClickOutside } from '@mantine/hooks';

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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useClickOutside(() => setShowResults(false));

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=ko`
        );
        const data = await response.json();

        if (data.results) {
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
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    onSelect(result);
    setQuery('');
    setShowResults(false);
  };

  return (
    <Box ref={searchRef} pos="relative" w="100%">
      <TextInput
        placeholder="도시 또는 국가 검색..."
        leftSection={<IconSearch size={16} />}
        rightSection={loading ? <Loader size="xs" /> : null}
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        onFocus={() => query.length >= 2 && setShowResults(true)}
        radius="md"
      />

      {showResults && (
        <Paper
          pos="absolute"
          top="100%"
          left={0}
          right={0}
          mt="xs"
          shadow="md"
          withBorder
          radius="md"
          style={{ zIndex: 1000, overflow: 'hidden' }}
        >
          {results.length > 0 ? (
            <Stack gap={0}>
              {results.map((result, idx) => (
                <UnstyledButton
                  key={idx}
                  onClick={() => handleSelect(result)}
                  p="sm"
                  style={(theme) => ({
                    borderBottom: idx !== results.length - 1 ? `1px solid ${theme.colors.gray[2]}` : 'none',
                    '&:hover': { backgroundColor: theme.colors.gray[0] }
                  })}
                >
                  <Group gap="sm" wrap="nowrap">
                    <IconMapPin size={18} color="gray" style={{ flexShrink: 0 }} />
                    <Stack gap={2}>
                      <Text size="sm" fw={500}>{result.name}</Text>
                      <Text size="xs" c="dimmed">
                        {result.admin1 && `${result.admin1}, `}{result.country}
                      </Text>
                    </Stack>
                  </Group>
                </UnstyledButton>
              ))}
            </Stack>
          ) : query.length >= 2 && !loading ? (
            <Box p="md">
              <Text size="sm" c="dimmed" ta="center">검색 결과가 없습니다</Text>
            </Box>
          ) : null}
        </Paper>
      )}
    </Box>
  );
}
