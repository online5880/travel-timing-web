/* Data-Driven Expedition Interface Design
 * - Monthly average temperature data for 2025
 * - Open-Meteo Climate API integration
 * - Temperature visualization with color coding
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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

        if (!response.ok) {
          throw new Error('기상 데이터를 불러올 수 없습니다');
        }

        const result = await response.json();
        const times = result.daily.time;
        const temps = result.daily.temperature_2m_mean;

        // Calculate monthly averages
        const monthlyAverages: { [key: number]: number[] } = {};

        times.forEach((date: string, idx: number) => {
          const month = new Date(date).getMonth() + 1;
          if (!monthlyAverages[month]) {
            monthlyAverages[month] = [];
          }
          monthlyAverages[month].push(temps[idx]);
        });

        // Convert to chart data
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
        console.error('Monthly temperature fetch error:', error);
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, [lat, lng]);

  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return '#3b82f6'; // Blue
    if (temp < 10) return '#06b6d4'; // Cyan
    if (temp < 15) return '#10b981'; // Green
    if (temp < 20) return '#eab308'; // Yellow
    if (temp < 25) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">2025년 월별 기온</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full border-border">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-lg font-bold">2025년 월별 기온</CardTitle>
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

  if (data.length === 0) {
    return (
      <Card className="h-full border-border">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-lg font-bold">2025년 월별 기온</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-center text-sm text-muted-foreground py-8">
            데이터 없음
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find best travel months (moderate temperature)
  const sortedByTemp = [...data].sort((a, b) => {
    const aDiff = Math.abs(a.temp - 20);
    const bDiff = Math.abs(b.temp - 20);
    return aDiff - bDiff;
  });

  const bestMonths = sortedByTemp.slice(0, 3).map(m => m.month).join(', ');

  return (
    <Card className="h-full border-border">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-lg font-bold">2025년 월별 기온</CardTitle>
        <div className="text-xs text-muted-foreground mt-2">
          추천 여행 시기: {bestMonths}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
                label={{ value: '°C', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                }}
                formatter={(value: any) => [`${value}°C`, '평균 기온']}
              />
              <Bar dataKey="temp" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getTemperatureColor(entry.temp)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature Legend */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-muted-foreground">&lt; 0°C</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#06b6d4' }}></div>
              <span className="text-muted-foreground">0-10°C</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-muted-foreground">10-15°C</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#eab308' }}></div>
              <span className="text-muted-foreground">15-20°C</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f97316' }}></div>
              <span className="text-muted-foreground">20-25°C</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="text-muted-foreground">&gt; 25°C</span>
            </div>
          </div>
        </div>

        {/* Data Source */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            출처: Open-Meteo Climate API (2025년 기후 데이터)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
