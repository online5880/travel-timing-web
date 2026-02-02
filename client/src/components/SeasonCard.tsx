/* Data-Driven Expedition Interface Design
 * - Best travel season recommendation
 * - Temperature-based color spectrum
 * - Data visualization with charts
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Sun, CloudRain, Snowflake, Leaf } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MonthData {
  month: string;
  temp: number;
  rainfall: number;
  score: number;
}

interface SeasonCardProps {
  lat: number;
  lng: number;
}

export default function SeasonCard({ lat, lng }: SeasonCardProps) {
  const [monthlyData, setMonthlyData] = useState<MonthData[]>([]);
  const [bestMonths, setBestMonths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const calculateSeasonData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Calculate seasonal patterns based on latitude
        const isNorthern = lat >= 0;
        const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        
        const data = months.map((month, idx) => {
          // Temperature pattern (sinusoidal based on hemisphere)
          const angle = isNorthern ? (idx - 6) * Math.PI / 6 : (idx) * Math.PI / 6;
          const baseTemp = 20 - Math.abs(lat) * 0.4;
          const temp = baseTemp + 15 * Math.sin(angle);
          
          // Rainfall pattern (higher in summer)
          const rainfall = 50 + 100 * Math.sin((idx - 3) * Math.PI / 6) + Math.random() * 30;
          
          // Travel score (best when temp is 15-25°C and low rainfall)
          const tempScore = Math.max(0, 100 - Math.abs(temp - 20) * 5);
          const rainScore = Math.max(0, 100 - rainfall * 0.5);
          const score = (tempScore + rainScore) / 2;
          
          return { month, temp, rainfall, score };
        });
        
        setMonthlyData(data);
        
        // Find best 3 months
        const sorted = [...data].sort((a, b) => b.score - a.score);
        setBestMonths(sorted.slice(0, 3).map(d => d.month));
        
      } catch (error) {
        console.error('Season calculation error:', error);
      } finally {
        setLoading(false);
      }
    };

    calculateSeasonData();
  }, [lat, lng]);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">최적 여행 시기</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            <div className="h-6 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeasonIcon = (month: string) => {
    const monthNum = parseInt(month);
    if (monthNum >= 3 && monthNum <= 5) return <Leaf className="w-5 h-5 text-green-600" />;
    if (monthNum >= 6 && monthNum <= 8) return <Sun className="w-5 h-5 text-yellow-600" />;
    if (monthNum >= 9 && monthNum <= 11) return <CloudRain className="w-5 h-5 text-orange-600" />;
    return <Snowflake className="w-5 h-5 text-blue-600" />;
  };

  return (
    <Card className="h-full border-border">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          최적 여행 시기
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Best Months */}
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-2">추천 여행 시기</div>
          <div className="flex gap-2">
            {bestMonths.map((month) => (
              <div
                key={month}
                className="flex-1 bg-primary/10 border border-primary/20 rounded px-3 py-2 text-center"
              >
                <div className="font-mono font-bold text-primary">{month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Temperature Chart */}
        <div className="pt-3 border-t border-border">
          <div className="text-sm font-medium text-muted-foreground mb-3">월별 평균 기온</div>
          <div className="flex items-end justify-between gap-1 h-24">
            {monthlyData.map((data, idx) => {
              const height = Math.max(10, (data.temp + 10) * 2);
              const color = data.temp < 10 ? 'bg-blue-500' : 
                           data.temp < 20 ? 'bg-cyan-500' :
                           data.temp < 25 ? 'bg-green-500' :
                           data.temp < 30 ? 'bg-yellow-500' : 'bg-orange-500';
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full ${color} rounded-sm transition-all hover:opacity-80`}
                    style={{ height: `${height}%` }}
                    title={`${data.month}: ${data.temp.toFixed(1)}°C`}
                  />
                  <div className="text-[10px] font-mono text-muted-foreground">
                    {data.month.replace('월', '')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Season Info */}
        <div className="pt-3 border-t border-border">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-600" />
              <span className="text-muted-foreground">여름: 6-8월</span>
            </div>
            <div className="flex items-center gap-2">
              <Snowflake className="w-4 h-4 text-blue-600" />
              <span className="text-muted-foreground">겨울: 12-2월</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-muted-foreground">봄: 3-5월</span>
            </div>
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-orange-600" />
              <span className="text-muted-foreground">가을: 9-11월</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
