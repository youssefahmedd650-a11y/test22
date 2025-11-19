import { useState, useEffect } from 'react';
import { Plus, Eye, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/StatsCard';
import RevenueChart from '@/components/RevenueChart';
import CalendarWidget from '@/components/CalendarWidget';
import CampaignModal from '@/components/CampaignModal';
import DonationPulseChart from '@/components/DonationPulseChart';
import ActiveCampaignsWidget from '@/components/ActiveCampaignsWidget';

interface Campaign {
  id: number;
  address: string;
  name: string;
  progress: number;
  status: 'Active' | 'Pause' | 'Cancel';
  goal: number;
  started: string;
  creator?: string;
  admin?: string;
  expiryDate?: string;
}

interface DashboardProps {
  factoryAddress: string;
}

function Dashboard({ factoryAddress }: DashboardProps) {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: 35,
        address: '0x1234567890123456789012345678901234567890',
        name: 'Konklux',
        progress: 23,
        status: 'Active',
        goal: 61,
        started: '2021-09-12',
        creator: '0x1111111111111111111111111111111111111111',
        admin: '0x2222222222222222222222222222222222222222',
        expiryDate: '2024-12-31T23:59:59Z'
      },
      {
        id: 34,
        address: '0x2234567890123456789012345678901234567890',
        name: 'Tres-Zap',
        progress: 5,
        status: 'Pause',
        goal: 47,
        started: '2021-05-11',
        creator: '0x3333333333333333333333333333333333333333',
        admin: '0x4444444444444444444444444444444444444444',
        expiryDate: '2024-11-30T23:59:59Z'
      },
      {
        id: 33,
        address: '0x3234567890123456789012345678901234567890',
        name: 'Keylex',
        progress: 44,
        status: 'Active',
        goal: 44,
        started: '2021-09-19',
        creator: '0x5555555555555555555555555555555555555555',
        admin: '0x6666666666666666666666666666666666666666',
        expiryDate: '2025-01-15T23:59:59Z'
      },
      {
        id: 32,
        address: '0x4234567890123456789012345678901234567890',
        name: 'Latlux',
        progress: 69,
        status: 'Cancel',
        goal: 37,
        started: '2021-05-16',
        creator: '0x7777777777777777777777777777777777777777',
        admin: '0x8888888888888888888888888888888888888888',
        expiryDate: '2024-10-20T23:59:59Z'
      },
    ];

    setCampaigns(mockCampaigns);
  }, []);

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
  const totalRaised = campaigns.reduce((sum, c) => sum + (c.goal * c.progress / 100), 0);
  const avgProgress = campaigns.length > 0 
    ? campaigns.reduce((sum, c) => sum + c.progress, 0) / campaigns.length 
    : 0;

  const chartData = [
    { month: 'Jan', revenue: 2000, donations: 1500 },
    { month: 'Feb', revenue: 3000, donations: 2000 },
    { month: 'Mar', revenue: 2500, donations: 1800 },
    { month: 'Apr', revenue: 4000, donations: 3000 },
    { month: 'May', revenue: 3500, donations: 2500 },
    { month: 'Jun', revenue: 6700, donations: 5000 },
    { month: 'Jul', revenue: 5000, donations: 4000 },
    { month: 'Aug', revenue: 6000, donations: 4500 },
    { month: 'Sep', revenue: 5500, donations: 4200 },
    { month: 'Oct', revenue: 7000, donations: 5500 },
    { month: 'Nov', revenue: 6500, donations: 5000 },
    { month: 'Dec', revenue: 8000, donations: 6000 },
  ];

  const events = [
    { time: '16:00', title: 'Summer Campaign ended!' },
    { time: '14:00', title: '2 plus 1 promotions ended!' },
    { time: '13:00', title: 'Winter Campaign ended!' },
    { time: '09:00', title: 'Summer Campaign ended!' },
  ];

  const formatAddress = (address?: string): string => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleViewDetails = (campaignAddress: string) => {
    navigate(`/campaign/${campaignAddress}`);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
      'Active': { label: 'Complete', variant: 'default' },
      'Pause': { label: 'Pending', variant: 'secondary' },
      'Cancel': { label: 'Failed', variant: 'destructive' },
    };
    return statusMap[status] || { label: status, variant: 'secondary' };
  };

  return (
    <div className="bg-background p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Users}
          title="Total Campaigns"
          value={totalCampaigns.toString()}
          change="10.0"
          changeType="positive"
          period="Month"
          iconColor="#667eea"
        />
        <StatsCard
          icon={TrendingUp}
          title="Active Campaigns"
          value={activeCampaigns.toString()}
          change="10.0"
          changeType="positive"
          period="Month"
          iconColor="#10b981"
        />
        <StatsCard
          icon={DollarSign}
          title="Total Raised"
          value={`$${totalRaised.toFixed(0)}`}
          period="Month"
          iconColor="#3b82f6"
        />
        <StatsCard
          icon={Calendar}
          title="Avg Progress"
          value={`${avgProgress.toFixed(1)}%`}
          period="Month"
          iconColor="#f59e0b"
        />
      </div>

      {/* Active Campaigns & Donation Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ActiveCampaignsWidget />
        </div>
        <div className="lg:col-span-2">
          <DonationPulseChart />
        </div>
      </div>

      {/* Chart and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={chartData} />
        </div>
        <div>
          <CalendarWidget events={events} />
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recent Campaigns</h2>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus size={18} />
            Create Campaign
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Campaign ID
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Progress
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Creator
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Goal
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.slice(0, 5).map((campaign) => {
                const statusBadge = getStatusBadge(campaign.status);
                return (
                  <tr 
                    key={campaign.id} 
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-primary font-semibold">
                        #{campaign.id}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-foreground">{campaign.name}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
                            style={{ width: `${campaign.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-foreground min-w-[45px]">
                          {campaign.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-muted-foreground">
                        {formatAddress(campaign.creator)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-foreground">${campaign.goal}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewDetails(campaign.address)}
                        className="h-8 w-8"
                      >
                        <Eye size={16} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <CampaignModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        factoryAddress={factoryAddress} 
      />
    </div>
  );
}

export default Dashboard;
