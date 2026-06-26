import { useState, useEffect } from 'react';
import * as addressService from '@/services/address.service';
import type { UserAddressResponse, UserAddressCreateRequest } from '@/types/user.types';

export function useAddress() {
  const [addresses, setAddresses] = useState<UserAddressResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchAddresses();
  }, []);

  async function fetchAddresses() {
    setIsLoading(true);
    try {
      const res = await addressService.getAddresses();
      if (res.data) {
        setAddresses(res.data);
      }
    } catch (err) {
      console.error("Address API failed:", err);
      setError('Không thể tải danh sách địa chỉ.');
    } finally {
      setIsLoading(false);
    }
  }

  async function createAddress(data: UserAddressCreateRequest): Promise<boolean> {
    try {
      await addressService.createAddress(data);
      await fetchAddresses();
      return true;
    } catch (err) {
      console.error("Create address API failed:", err);
      setError('Thêm địa chỉ thất bại.');
      return false;
    }
  }

  async function updateAddress(id: number, data: UserAddressCreateRequest): Promise<boolean> {
    try {
      await addressService.updateAddress(id, data);
      await fetchAddresses();
      return true;
    } catch (err) {
      console.error("Update address API failed:", err);
      setError('Cập nhật địa chỉ thất bại.');
      return false;
    }
  }

  async function deleteAddress(id: number): Promise<boolean> {
    try {
      await addressService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err) {
      console.error("Delete address API failed:", err);
      setError('Xóa địa chỉ thất bại.');
      return false;
    }
  }

  async function setDefault(id: number): Promise<void> {
    try {
      await addressService.setDefaultAddress(id);
      await fetchAddresses();
    } catch (err) {
      console.error("Set default address API failed:", err);
    }
  }

  return { addresses, isLoading, error, createAddress, updateAddress, deleteAddress, setDefault };
}
