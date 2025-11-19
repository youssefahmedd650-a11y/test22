import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  factoryAddress: string;
}

const CampaignModal = ({ isOpen, onClose, factoryAddress }: CampaignModalProps) => {
  const [loading, setLoading] = useState(false);
  const [tokenEnabled, setTokenEnabled] = useState(true);
  const [formData, setFormData] = useState({
    creatorAddress: '',
    campaignLabel: '',
    goalAmount: '',
    metadataHash: '',
    deadline: '',
    wbtcAddress: '',
    ethUsdFeed: '',
    wbtcUsdFeed: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.creatorAddress || !formData.campaignLabel || !formData.goalAmount || !formData.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const campaignData = {
        factory: factoryAddress,
        creator: formData.creatorAddress,
        label: formData.campaignLabel,
        goal: parseFloat(formData.goalAmount),
        metadataHash: formData.metadataHash || '0x0000000000000000000000000000000000000000000000000000000000000000',
        deadline: new Date(formData.deadline).getTime(),
        tokenEnabled,
        ...(tokenEnabled && {
          wbtcAddress: formData.wbtcAddress,
          ethUsdFeed: formData.ethUsdFeed,
          wbtcUsdFeed: formData.wbtcUsdFeed
        })
      };

      console.log('Creating campaign:', campaignData);

      toast.success('Campaign created successfully!');
      onClose();
      setFormData({
        creatorAddress: '',
        campaignLabel: '',
        goalAmount: '',
        metadataHash: '',
        deadline: '',
        wbtcAddress: '',
        ethUsdFeed: '',
        wbtcUsdFeed: ''
      });
    } catch (error) {
      toast.error('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Campaign</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="factory">Factory Address</Label>
            <Input
              id="factory"
              value={factoryAddress}
              disabled
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creator">Creator Address *</Label>
            <Input
              id="creator"
              placeholder="0x..."
              value={formData.creatorAddress}
              onChange={(e) => setFormData({ ...formData, creatorAddress: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Campaign Label *</Label>
            <Input
              id="label"
              placeholder="My Campaign"
              value={formData.campaignLabel}
              onChange={(e) => setFormData({ ...formData, campaignLabel: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Goal Amount (USD) *</Label>
            <Input
              id="goal"
              type="number"
              placeholder="100000"
              value={formData.goalAmount}
              onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline *</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metadata">Metadata Hash (Optional)</Label>
            <Input
              id="metadata"
              placeholder="0x..."
              value={formData.metadataHash}
              onChange={(e) => setFormData({ ...formData, metadataHash: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="tokenEnabled"
              checked={tokenEnabled}
              onCheckedChange={(checked) => setTokenEnabled(checked as boolean)}
            />
            <Label htmlFor="tokenEnabled" className="cursor-pointer">
              Enable Token Contributions (WBTC)
            </Label>
          </div>

          {tokenEnabled && (
            <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="wbtc">WBTC Token Address *</Label>
                <Input
                  id="wbtc"
                  placeholder="0x..."
                  value={formData.wbtcAddress}
                  onChange={(e) => setFormData({ ...formData, wbtcAddress: e.target.value })}
                  required={tokenEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ethFeed">ETH/USD Price Feed *</Label>
                <Input
                  id="ethFeed"
                  placeholder="0x..."
                  value={formData.ethUsdFeed}
                  onChange={(e) => setFormData({ ...formData, ethUsdFeed: e.target.value })}
                  required={tokenEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wbtcFeed">WBTC/USD Price Feed *</Label>
                <Input
                  id="wbtcFeed"
                  placeholder="0x..."
                  value={formData.wbtcUsdFeed}
                  onChange={(e) => setFormData({ ...formData, wbtcUsdFeed: e.target.value })}
                  required={tokenEnabled}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignModal;
