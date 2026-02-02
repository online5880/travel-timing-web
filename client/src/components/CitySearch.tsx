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
      if (debouncedQuery.trim().length < 1) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        // Photon API 테스트 결과 lang=ko 파라미터가 400 에러를 유발함
        // 기본 언어로 검색하고 결과에서 이름을 처리하도록 수정
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(debouncedQuery)}&limit=10`
        );
        
        if (!response.ok) {
          throw new Error('Search API response not ok');
        }
        
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const formattedResults = data.features.map((feature: any) => {
            const props = feature.properties;
            const coords = feature.geometry.coordinates;
            
            // 한국어 검색 시 name이 한국어로 오는 경우가 많으므로 우선 사용
            return {
              name: props.name || props.city || props.state || 'Unknown',
              admin1: props.state || props.district,
              country: props.country,
              latitude: coords[1],
              longitude: coords[0],
              country_code: props.countrycode || '',
            };
          });
          setResults(formattedResults);
          setShowResults(true);
        } else {
          // Photon 결과 없을 시 Open-Meteo 백업 (한국어 지원)
          const backupResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(debouncedQuery)}&count=5&language=ko`
          );
          const backupData = await backupResponse.json();
          
          if (backupData.results) {
            const backupResults = backupData.results.map((result: any) => ({
              name: result.name,
              admin1: result.admin1,
              country: result.country,
              latitude: result.latitude,
              longitude: result.longitude,
              country_code: result.country_code,
            }));
            setResults(backupResults);
            setShowResults(true);
          } else {
            setResults([]);
          }
        }
      } catch (error) {
        console.error('Search error:', error);
        // 에러 발생 시에도 백업 시도
        try {
          const backupResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(debouncedQuery)}&count=5&language=ko`
          );
          const backupData = await backupResponse.json();
          if (backupData.results) {
            setResults(backupData.results.map((r: any) => ({
              name: r.name,
              admin1: r.admin1,
              country: r.country,
              latitude: r.latitude,
              longitude: r.longitude,
              country_code: r.country_code,
            })));
            setShowResults(true);
          }
        } catch (e) {
          console.error('Backup search error:', e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSelect = (result: SearchResult) => {
    onSelect(result);
    setQuery(result.name);
    setShowResults(false);
  };

  return (
    <Box ref={searchRef} pos="relative" w="100%">
      <TextInput
        placeholder="도시 또는 국가 검색 (예: 서울, 도쿄, 파리)"
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
              </Text>
            </Box>
          ) : null}
        </Paper>
      )}
    </Box>
  );
}
