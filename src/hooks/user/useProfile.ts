import { useState, useEffect, useCallback } from 'react';
import * as userService from '@/services/user.service';
import type { UserAccountResponse, UserUpdateProfileRequest } from '@/types/user.types';

export function useProfile(fetchOnMount = true) {
  const [profile, setProfile] = useState<UserAccountResponse | null>(null);
  const [isLoading, setIsLoading] = useState(fetchOnMount);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await userService.getMyAccount();
      if (res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error('Profile API failed:', err);
      setError('Không thể tải thông tin hồ sơ.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchOnMount) {
      void fetchProfile();
    }
  }, [fetchOnMount, fetchProfile]);

  async function updateProfile(data: UserUpdateProfileRequest): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      const res = await userService.updateProfile(data);
      if (res.data) setProfile(res.data);
      return true;
    } catch (err) {
      console.error('Update profile API failed:', err);
      setError('Cập nhật hồ sơ thất bại.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { profile, isLoading, error, updateProfile, refetch: fetchProfile };
}
