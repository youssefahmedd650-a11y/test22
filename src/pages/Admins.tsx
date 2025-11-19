import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import {
  UserPlus,
  UserMinus,
  Shield,
  Search,
  Send,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Admin {
  address: string;
  addedBy: string;
  addedAt: string;
  status: 'active' | 'pending' | 'removed';
}

interface ActivityLog {
  id: string;
  action: string;
  performer: string;
  target: string;
  timestamp: string;
}

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  const [addAdminAddress, setAddAdminAddress] = useState('');
  const [removeAdminAddress, setRemoveAdminAddress] = useState('');
  const [checkAdminAddress, setCheckAdminAddress] = useState('');
  const [transferCreatorAddress, setTransferCreatorAddress] = useState('');

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    action: string;
    title: string;
    description: string;
  }>({ open: false, action: '', title: '', description: '' });

  useEffect(() => {
    const mockAdmins: Admin[] = [
      {
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        addedBy: '0x0000000000000000000000000000000000000000',
        addedAt: '2024-01-15',
        status: 'active'
      },
      {
        address: '0x1111111111111111111111111111111111111111',
        addedBy: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        addedAt: '2024-02-20',
        status: 'active'
      },
      {
        address: '0x2222222222222222222222222222222222222222',
        addedBy: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        addedAt: '2024-03-10',
        status: 'active'
      }
    ];

    const mockActivity: ActivityLog[] = [
      {
        id: '1',
        action: 'Admin Added',
        performer: '0x742d...0bEb',
        target: '0x2222...2222',
        timestamp: '2024-03-10 14:30:00'
      },
      {
        id: '2',
        action: 'Admin Status Checked',
        performer: '0x1111...1111',
        target: '0x2222...2222',
        timestamp: '2024-03-09 10:15:00'
      },
      {
        id: '3',
        action: 'Admin Added',
        performer: '0x742d...0bEb',
        target: '0x1111...1111',
        timestamp: '2024-02-20 09:00:00'
      }
    ];

    setAdmins(mockAdmins);
    setActivityLog(mockActivity);
  }, []);

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const filteredAdmins = admins.filter(admin =>
    admin.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAdmin = async () => {
    if (!addAdminAddress || !/^0x[a-fA-F0-9]{40}$/.test(addAdminAddress)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    if (admins.some(admin => admin.address.toLowerCase() === addAdminAddress.toLowerCase())) {
      toast.error('Address is already an admin');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newAdmin: Admin = {
        address: addAdminAddress,
        addedBy: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        addedAt: new Date().toISOString().split('T')[0],
        status: 'active'
      };

      setAdmins(prev => [newAdmin, ...prev]);

      const newLog: ActivityLog = {
        id: Date.now().toString(),
        action: 'Admin Added',
        performer: formatAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'),
        target: formatAddress(addAdminAddress),
        timestamp: new Date().toLocaleString()
      };
      setActivityLog(prev => [newLog, ...prev]);

      toast.success('Admin added successfully!');
      setAddAdminAddress('');
      setDialogState({ open: false, action: '', title: '', description: '' });
    } catch (error) {
      toast.error('Failed to add admin');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!removeAdminAddress || !/^0x[a-fA-F0-9]{40}$/.test(removeAdminAddress)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setAdmins(prev => prev.filter(
        admin => admin.address.toLowerCase() !== removeAdminAddress.toLowerCase()
      ));

      const newLog: ActivityLog = {
        id: Date.now().toString(),
        action: 'Admin Removed',
        performer: formatAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'),
        target: formatAddress(removeAdminAddress),
        timestamp: new Date().toLocaleString()
      };
      setActivityLog(prev => [newLog, ...prev]);

      toast.success('Admin removed successfully!');
      setRemoveAdminAddress('');
      setDialogState({ open: false, action: '', title: '', description: '' });
    } catch (error) {
      toast.error('Failed to remove admin');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAdmin = async () => {
    if (!checkAdminAddress || !/^0x[a-fA-F0-9]{40}$/.test(checkAdminAddress)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const isAdmin = admins.some(
        admin => admin.address.toLowerCase() === checkAdminAddress.toLowerCase()
      );

      const newLog: ActivityLog = {
        id: Date.now().toString(),
        action: 'Admin Status Checked',
        performer: formatAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'),
        target: formatAddress(checkAdminAddress),
        timestamp: new Date().toLocaleString()
      };
      setActivityLog(prev => [newLog, ...prev]);

      if (isAdmin) {
        toast.success('Address is an admin!');
      } else {
        toast.error('Address is not an admin');
      }

      setCheckAdminAddress('');
      setDialogState({ open: false, action: '', title: '', description: '' });
    } catch (error) {
      toast.error('Failed to check admin status');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferCreator = async () => {
    if (!transferCreatorAddress || !/^0x[a-fA-F0-9]{40}$/.test(transferCreatorAddress)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newLog: ActivityLog = {
        id: Date.now().toString(),
        action: 'Creator Transferred',
        performer: formatAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'),
        target: formatAddress(transferCreatorAddress),
        timestamp: new Date().toLocaleString()
      };
      setActivityLog(prev => [newLog, ...prev]);

      toast.success('Creator transferred successfully!');
      setTransferCreatorAddress('');
      setDialogState({ open: false, action: '', title: '', description: '' });
    } catch (error) {
      toast.error('Failed to transfer creator');
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (action: string, title: string, description: string) => {
    setDialogState({ open: true, action, title, description });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Management</h1>
        <p className="mt-2 text-muted-foreground">Manage platform administrators and permissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border hover:border-primary/50 transition-all">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              Add Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => openDialog('add', 'Add New Admin', 'Enter the Ethereum address to grant admin privileges.')}
            >
              Add Admin
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-primary/50 transition-all">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <UserMinus className="h-4 w-4 text-destructive" />
              Remove Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => openDialog('remove', 'Remove Admin', 'Enter the Ethereum address to revoke admin privileges.')}
            >
              Remove Admin
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-primary/50 transition-all">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              Check Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => openDialog('check', 'Check Admin Status', 'Enter the Ethereum address to verify admin status.')}
            >
              Check Admin
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-primary/50 transition-all">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Send className="h-4 w-4 text-amber-500" />
              Transfer Creator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => openDialog('transfer', 'Transfer Creator', 'Enter the new creator address to transfer ownership.')}
            >
              Transfer Creator
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Existing Admins</CardTitle>
          <CardDescription>List of all platform administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Address</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Added By</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Added At</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.address} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{admin.address}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-muted-foreground">
                          {formatAddress(admin.addedBy)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">{admin.addedAt}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {admin.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Recent admin management actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityLog.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    log.action.includes('Added') ? 'bg-green-500/10 text-green-500' :
                    log.action.includes('Removed') ? 'bg-red-500/10 text-red-500' :
                    log.action.includes('Transferred') ? 'bg-amber-500/10 text-amber-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {log.action.includes('Added') && <UserPlus className="h-4 w-4" />}
                    {log.action.includes('Removed') && <UserMinus className="h-4 w-4" />}
                    {log.action.includes('Transferred') && <Send className="h-4 w-4" />}
                    {log.action.includes('Checked') && <Shield className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.performer} → {log.target}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={dialogState.open} onOpenChange={(open) => setDialogState({ ...dialogState, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogState.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialogState.description}</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 py-4">
            <Label htmlFor="address">Ethereum Address</Label>
            <Input
              id="address"
              placeholder="0x..."
              value={
                dialogState.action === 'add' ? addAdminAddress :
                dialogState.action === 'remove' ? removeAdminAddress :
                dialogState.action === 'check' ? checkAdminAddress :
                transferCreatorAddress
              }
              onChange={(e) => {
                if (dialogState.action === 'add') setAddAdminAddress(e.target.value);
                else if (dialogState.action === 'remove') setRemoveAdminAddress(e.target.value);
                else if (dialogState.action === 'check') setCheckAdminAddress(e.target.value);
                else setTransferCreatorAddress(e.target.value);
              }}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (dialogState.action === 'add') handleAddAdmin();
                else if (dialogState.action === 'remove') handleRemoveAdmin();
                else if (dialogState.action === 'check') handleCheckAdmin();
                else handleTransferCreator();
              }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
