/* Data-Driven Expedition Interface Design
 * - Weather data display with temperature visualization
 * - OpenWeatherMap API integration
 * - Monospace fonts for numerical data
 * - Clean 1px borders and minimal styling
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Droplets, Wind, Eye, AlertCircle } from 'lucide-react';
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
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">날씨 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full border-border">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-lg font-bold">날씨 정보</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  // Temperature color based on value
  const getTempColor = (temp: number) => {
    if (temp < 10) return 'text-blue-600';
    if (temp < 20) return 'text-cyan-600';
    if (temp < 25) return 'text-green-600';
    if (temp < 30) return 'text-yellow-600';
    return 'text-orange-600';
  };

  // Weather description in Korean
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
    <Card className="h-full border-border">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-lg font-bold">날씨 정보</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Temperature Display */}
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-4xl font-mono font-bold ${getTempColor(weather.temp)}`}>
              {weather.temp.toFixed(1)}°C
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {getWeatherDescription(weather.description)}
            </div>
          </div>
          <Cloud className="w-12 h-12 text-muted-foreground" />
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">습도</div>
              <div className="font-mono font-medium">{weather.humidity.toFixed(0)}%</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">풍속</div>
              <div className="font-mono font-medium">{weather.wind_speed.toFixed(1)} m/s</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm">체감</div>
            <div className="font-mono font-medium">{weather.feels_like.toFixed(1)}°C</div>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <div className="font-mono font-medium">{(weather.visibility / 1000).toFixed(1)} km</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
