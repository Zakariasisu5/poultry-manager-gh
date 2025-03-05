
import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSettings } from '@/components/settings/UserSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { PreferenceSettings } from '@/components/settings/PreferenceSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <PageContainer title="Settings" description="Manage your account and application settings">
      <div className="container mx-auto py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="p-4 border rounded-lg bg-card">
            <UserSettings />
          </TabsContent>
          
          <TabsContent value="appearance" className="p-4 border rounded-lg bg-card">
            <AppearanceSettings />
          </TabsContent>
          
          <TabsContent value="preferences" className="p-4 border rounded-lg bg-card">
            <PreferenceSettings />
          </TabsContent>
          
          <TabsContent value="notifications" className="p-4 border rounded-lg bg-card">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="security" className="p-4 border rounded-lg bg-card">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Settings;
