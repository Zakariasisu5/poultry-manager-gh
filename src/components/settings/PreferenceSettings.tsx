
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Layout, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function PreferenceSettings() {
  const { toast } = useToast();
  const [compactMode, setCompactMode] = useState(false);
  const [defaultView, setDefaultView] = useState('dashboard');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  // In a real app, these would be persisted to local storage or a user's preferences in the database
  const handleSwitchChange = (checked: boolean) => {
    setCompactMode(checked);
    toast({
      title: "Preferences Updated",
      description: `Compact mode is now ${checked ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Customize your application experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-mode" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                <span>Compact Mode</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Reduce padding and margins throughout the interface
              </p>
            </div>
            <Switch
              id="compact-mode"
              checked={compactMode}
              onCheckedChange={handleSwitchChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="default-view" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Default View</span>
            </Label>
            <Select value={defaultView} onValueChange={setDefaultView}>
              <SelectTrigger id="default-view">
                <SelectValue placeholder="Select default view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="livestock">Livestock</SelectItem>
                <SelectItem value="feed">Feed Management</SelectItem>
                <SelectItem value="health">Health Records</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose which page to show when you first log in
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date-format" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Date Format</span>
            </Label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger id="date-format">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose how dates are displayed throughout the application
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
