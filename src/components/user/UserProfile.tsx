
import { useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserProfileModal } from '@/components/user/UserProfileModal';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function UserProfile() {
  const { profile, refreshProfile } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleProfileUpdate = async (updatedProfile: any) => {
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
        .eq('id', profile?.id);

      if (error) {
        throw error;
      }

      await refreshProfile();
      setIsModalOpen(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!profile) {
    return null;
  }

  // Map profile data to the format expected by UserProfileModal
  const profileData = {
    name: profile.full_name || profile.username || '',
    email: profile.email || '',
    role: profile.role || 'user',
    avatarUrl: profile.avatar_url || ''
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4"
      >
        Edit Profile
      </Button>

      <UserProfileModal
        profile={profileData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleProfileUpdate}
      />
    </>
  );
}
