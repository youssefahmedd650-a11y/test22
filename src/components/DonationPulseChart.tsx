import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts';

interface Donation {
  id: string;
  campaign: string;
  amount: number;
  currency: 'ETH' | 'WBTC';
  timestamp: number;
  usdValue: number;
}

interface DonationPulseChartProps {
  campaignAddress?: string;
}

const DonationPulseChart = ({ campaignAddress }: DonationPulseChartProps) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [chartData, setChartData] = useState<Array<{ time: string; total: number }>>([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [lastDonation, setLastDonation] = useState<Donation | null>(null);
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);

  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      total: 10000 + Math.random() * 5000 + i * 500
    }));
    setChartData(initialData);
    setTotalRaised(initialData[initialData.length - 1].total);

    const interval = setInterval(() => {
      const newDonation: Donation = {
        id: Date.now().toString(),
        campaign: campaignAddress || '0x' + Math.random().toString(16).substr(2, 40),
        amount: Math.random() * 2 + 0.1,
        currency: Math.random() > 0.7 ? 'WBTC' : 'ETH',
        timestamp: Date.now(),
        usdValue: Math.random() * 5000 + 500
      };

      setDonations(prev => [newDonation, ...prev.slice(0, 9)]);
      setLastDonation(newDonation);

      setChartData(prev => {
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          total: prev[prev.length - 1].total + newDonation.usdValue
        }];
        return newData;
      });

      setTotalRaised(prev => prev + newDonation.usdValue);
      setPulseIndex(chartData.length - 1);

      setTimeout(() => setPulseIndex(null), 1000);
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [campaignAddress, chartData.length]);

  const CustomDot = (props: any) => {
    const { cx, cy, index } = props;
    const isPulse = index === pulseIndex;

    if (isPulse) {
      return (
        <>
          <circle cx={cx} cy={cy} r={8} fill="hsl(var(--primary))" opacity={0.3}>
            <animate attributeName="r" from="4" to="12" dur="0.6s" />
            <animate attributeName="opacity" from="0.8" to="0" dur="0.6s" />
          </circle>
          <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />
        </>
      );
    }

    return null;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Donation Pulse</span>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total Raised</p>
              <p className="text-2xl font-bold text-primary animate-fade-in">
                ${totalRaised.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lastDonation && (
            <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg animate-scale-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">
                    New Donation: {lastDonation.amount.toFixed(4)} {lastDonation.currency}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${lastDonation.usdValue.toFixed(2)} USD
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {new Date(lastDonation.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total Raised']}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-semibold mb-3">Recent Donations</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg text-sm"
                >
                  <div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {donation.campaign.slice(0, 6)}...{donation.campaign.slice(-4)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {donation.amount.toFixed(4)} {donation.currency}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (${donation.usdValue.toFixed(2)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationPulseChart;
