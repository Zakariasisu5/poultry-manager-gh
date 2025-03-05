
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserProfileModal } from '@/components/user/UserProfileModal';
import { useAuth } from '@/contexts/AuthContext';

export function UserSettings() {
  const { profile, refreshProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Loading profile information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Map profile data to the format expected by UserProfileModal
  const profileData = {
    name: profile.full_name || profile.username || '',
    email: profile.email || '',
    role: profile.role || 'user',
    avatarUrl: profile.avatar_url || ''
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Manage your personal information and profile settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <Avatar className="h-24 w-24 border border-primary/10">
            <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
              {getInitials(profileData.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-semibold">{profileData.name}</h3>
            <p className="text-muted-foreground">{profileData.email}</p>
            <p className="text-sm bg-secondary inline-block px-2 py-1 rounded-full">{profileData.role}</p>
          </div>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          Edit Profile
        </Button>
      </CardContent>

      <UserProfileModal
        profile={profileData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (updatedProfile) => {
          // The UserProfile component handles the update logic
          // when the modal is used from there
          const { supabase } = await import('@/integrations/supabase/client');
          
          try {
            const { error } = await supabase
              .from('profiles')
              .update({
                username: updatedProfile.name,
                full_name: updatedProfile.name,
                avatar_url: updatedProfile.avatarUrl,
                role: updatedProfile.role,
                updated_at: new Date().toISOString()
              })
              .eq('id', profile.id);

            if (error) {
              throw error;
            }

            await refreshProfile();
            setIsModalOpen(false);
          } catch (error: any) {
            console.error("Error updating profile:", error.message);
          }
        }}
      />
    </Card>
  );
}
