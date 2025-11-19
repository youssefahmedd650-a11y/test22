import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, DollarSign } from 'lucide-react';

interface CampaignStats {
  address: string;
  name: string;
  raised: number;
  growth: number;
  contributors: number;
  hourlyRate: number;
}

const ActiveCampaignsWidget = () => {
  const [topCampaigns, setTopCampaigns] = useState<CampaignStats[]>([]);
  const [platformStats, setPlatformStats] = useState({
    hourlyTotal: 0,
    minuteTotal: 0,
    todayTotal: 0
  });

  useEffect(() => {
    const mockCampaigns: CampaignStats[] = [
      {
        address: '0x1234567890123456789012345678901234567890',
        name: 'Konklux Innovation',
        raised: 45000,
        growth: 23.5,
        contributors: 127,
        hourlyRate: 850
      },
      {
        address: '0x2234567890123456789012345678901234567890',
        name: 'Blockchain Education',
        raised: 32000,
        growth: 18.2,
        contributors: 94,
        hourlyRate: 620
      },
      {
        address: '0x3234567890123456789012345678901234567890',
        name: 'DeFi Protocol',
        raised: 28000,
        growth: 15.8,
        contributors: 78,
        hourlyRate: 520
      },
      {
        address: '0x4234567890123456789012345678901234567890',
        name: 'NFT Marketplace',
        raised: 21000,
        growth: 12.4,
        contributors: 56,
        hourlyRate: 380
      },
      {
        address: '0x5234567890123456789012345678901234567890',
        name: 'Web3 Gaming',
        raised: 18000,
        growth: 10.1,
        contributors: 42,
        hourlyRate: 290
      }
    ];

    setTopCampaigns(mockCampaigns);
    setPlatformStats({
      hourlyTotal: 2660,
      minuteTotal: 44.3,
      todayTotal: 52450
    });

    const interval = setInterval(() => {
      setPlatformStats(prev => ({
        hourlyTotal: prev.hourlyTotal + Math.random() * 100,
        minuteTotal: Math.random() * 50 + 20,
        todayTotal: prev.todayTotal + Math.random() * 500
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Platform Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Per Hour</p>
              <p className="text-2xl font-bold text-foreground">
                ${platformStats.hourlyTotal.toFixed(0)}
              </p>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Per Minute</p>
              <p className="text-2xl font-bold text-foreground">
                ${platformStats.minuteTotal.toFixed(1)}
              </p>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Today Total</p>
              <p className="text-2xl font-bold text-primary">
                ${platformStats.todayTotal.toFixed(0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Top 5 Campaigns by Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCampaigns.map((campaign, index) => (
              <div
                key={campaign.address}
                className="p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-semibold text-sm">{campaign.name}</span>
                  </div>
                  <Badge variant="default" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {campaign.growth}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted-foreground">
                    {formatAddress(campaign.address)}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      ${campaign.raised.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      ${campaign.hourlyRate}/hr
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveCampaignsWidget;
