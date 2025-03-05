
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, AlertCircle, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function NotificationSettings() {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [livestockAlerts, setLivestockAlerts] = useState(true);
  const [healthReminders, setHealthReminders] = useState(true);
  const [feedAlerts, setFeedAlerts] = useState(true);
  const [financialReports, setFinancialReports] = useState(false);

  const handleToggle = (setting: string, value: boolean) => {
    // In a real app, this would be persisted to the database
    switch(setting) {
      case 'email':
        setEmailNotifications(value);
        break;
      case 'app':
        setAppNotifications(value);
        break;
      case 'livestock':
        setLivestockAlerts(value);
        break;
      case 'health':
        setHealthReminders(value);
        break;
      case 'feed':
        setFeedAlerts(value);
        break;
      case 'financial':
        setFinancialReports(value);
        break;
    }

    toast({
      title: "Notification Preference Updated",
      description: `${setting.charAt(0).toUpperCase() + setting.slice(1)} notifications ${value ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Control which notifications you receive</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Methods</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email Notifications</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for important events
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={(checked) => handleToggle('email', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="app-notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>In-App Notifications</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications within the application
              </p>
            </div>
            <Switch
              id="app-notifications"
              checked={appNotifications}
              onCheckedChange={(checked) => handleToggle('app', checked)}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Categories</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="livestock-alerts" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>Livestock Alerts</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Important alerts about your livestock
              </p>
            </div>
            <Switch
              id="livestock-alerts"
              checked={livestockAlerts}
              onCheckedChange={(checked) => handleToggle('livestock', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="health-reminders" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Health Reminders</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Reminders for vaccinations and health checks
              </p>
            </div>
            <Switch
              id="health-reminders"
              checked={healthReminders}
              onCheckedChange={(checked) => handleToggle('health', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="feed-alerts" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>Feed Inventory Alerts</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Alerts when feed inventory is running low
              </p>
            </div>
            <Switch
              id="feed-alerts"
              checked={feedAlerts}
              onCheckedChange={(checked) => handleToggle('feed', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="financial-reports" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Financial Reports</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Periodic financial reports and summaries
              </p>
            </div>
            <Switch
              id="financial-reports"
              checked={financialReports}
              onCheckedChange={(checked) => handleToggle('financial', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
