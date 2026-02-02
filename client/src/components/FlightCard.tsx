/* Data-Driven Expedition Interface Design
 * - Flight information and external links
 * - Clean button design with external link icons
 * - Minimal styling with clear call-to-actions
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, ExternalLink, Calendar } from 'lucide-react';

interface FlightCardProps {
  locationName: string;
  lat: number;
  lng: number;
}

export default function FlightCard({ locationName, lat, lng }: FlightCardProps) {
  const handleGoogleFlights = () => {
    // Google Flights search URL
    const url = `https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(locationName)}`;
    window.open(url, '_blank');
  };

  const handleSkyscanner = () => {
    // Skyscanner search URL
    const url = `https://www.skyscanner.co.kr/transport/flights/?adults=1&adultsv2=1&cabinclass=economy&children=0&childrenv2=&destinationentityid=&inboundaltsenabled=false&infants=0&originentityid=&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1`;
    window.open(url, '_blank');
  };

  const handleKayak = () => {
    // Kayak search URL
    const url = `https://www.kayak.co.kr/flights`;
    window.open(url, '_blank');
  };

  return (
    <Card className="h-full border-border">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Plane className="w-5 h-5" />
          항공권 검색
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {locationName}행 항공권을 검색해보세요
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {/* Flight Search Services */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-between border-border hover:bg-accent"
            onClick={handleGoogleFlights}
          >
            <span className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Google Flights
            </span>
            <ExternalLink className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-between border-border hover:bg-accent"
            onClick={handleSkyscanner}
          >
            <span className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Skyscanner
            </span>
            <ExternalLink className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-between border-border hover:bg-accent"
            onClick={handleKayak}
          >
            <span className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Kayak
            </span>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Travel Tips */}
        <div className="pt-3 border-t border-border">
          <div className="text-sm font-medium mb-2">항공권 예약 팁</div>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <Calendar className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>출발 2-3개월 전 예약 시 가장 저렴한 가격</span>
            </li>
            <li className="flex items-start gap-2">
              <Calendar className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>화요일과 수요일 출발편이 일반적으로 저렴</span>
            </li>
            <li className="flex items-start gap-2">
              <Calendar className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>비수기 여행 시 최대 40% 절약 가능</span>
            </li>
          </ul>
        </div>

        {/* Location Info */}
        <div className="pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground font-mono">
            좌표: {lat.toFixed(4)}, {lng.toFixed(4)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
