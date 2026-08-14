import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCart } from '@/hooks/user/useCart';
import { useAddress } from '@/hooks/user/useAddress';
import { useCreateOrder } from '@/hooks/order/useOrders';
import { usePaymentMethods } from '@/hooks/order/usePaymentMethods';

import type { UserAddressResponse, UserAddressCreateRequest } from '@/types/user.types';

import { Spinner } from '@/components/ui';
import { PageHeader } from '@/components/common';
import { AddressForm } from '@/components/user/AddressForm';
import {
  AddressSection,
  PaymentSection,
  OrderSummary,
} from '@/components/user/CheckoutComponents';

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const navigate = useNavigate();

  // ── Data hooks ────────────────────────────────────────────────────────────

  const { cart, isLoading: cartLoading } = useCart();
  const { addresses, isLoading: addressLoading, createAddress, updateAddress, deleteAddress } = useAddress();
  const { createOrder, isLoading: orderLoading, error: orderError } = useCreateOrder();
  const { paymentMethods, isLoading: paymentMethodsLoading } = usePaymentMethods();

  // ── Local state ───────────────────────────────────────────────────────────

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddressResponse | null>(null);

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<number | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<UserAddressResponse | null>(null);
  const [receiver, setReceiver] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  // ── Derived data ──────────────────────────────────────────────────────────

  const activePaymentMethods = useMemo(
    () => paymentMethods.filter((pm) => pm.status === 1),
    [paymentMethods],
  );

  // ── Effects ───────────────────────────────────────────────────────────────

  // Pre-select the first active payment method
  useEffect(() => {
    if (activePaymentMethods.length > 0 && selectedPaymentMethodId === null) {
      setSelectedPaymentMethodId(activePaymentMethods[0].id);
    }
  }, [activePaymentMethods, selectedPaymentMethodId]);

  // Pre-select the default (or first) address
  useEffect(() => {
    if (addresses.length > 0 && selectedAddress === null) {
      const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
      handleSelectAddress(defaultAddr);
    }
  }, [addresses, selectedAddress]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function buildLocationString(addr: UserAddressResponse) {
    return [addr.homeNumber, addr.street, addr.district, addr.city]
      .filter(Boolean)
      .join(', ');
  }

  function handleSelectAddress(addr: UserAddressResponse) {
    setSelectedAddress(addr);
    setLocation(buildLocationString(addr));
  }

  function handleOpenAddressModal(addr: UserAddressResponse | null = null) {
    setEditingAddress(addr);
    setShowAddressModal(true);
  }

  function handleCloseAddressModal() {
    setShowAddressModal(false);
    setEditingAddress(null);
  }

  async function handleAddressSubmit(data: UserAddressCreateRequest) {
    const success = editingAddress
      ? await updateAddress(editingAddress.id, data)
      : await createAddress(data);

    if (success) handleCloseAddressModal();
  }

  async function handleDeleteAddress(id: number) {
    await deleteAddress(id);
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPaymentMethodId) return;

    const order = await createOrder({
      paymentMethodId: selectedPaymentMethodId,
      receiver,
      phone,
      location,
    });

    if (order) {
      navigate(`/orders/${order.id}`);
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────

  if (cartLoading || addressLoading || paymentMethodsLoading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const isSubmitDisabled = !selectedPaymentMethodId || !location.trim();

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* ── Address Form Modal ───────────────────────────────────────────── */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 shadow-xl max-w-lg w-full">
            <h2 className="text-lg font-bold mb-4">
              {editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}
            </h2>
            <AddressForm
              initialData={editingAddress}
              onSubmit={handleAddressSubmit}
              onCancel={handleCloseAddressModal}
            />
          </div>
        </div>
      )}

      {/* ── Left Column: Form ────────────────────────────────────────────── */}
      <div>
        <div className="mb-6">
          <PageHeader title="Thanh toán" showBackBtn={true} />
        </div>

        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
          <AddressSection
            addresses={addresses}
            selectedAddress={selectedAddress}
            receiver={receiver}
            phone={phone}
            location={location}
            onSelectAddress={handleSelectAddress}
            onEditAddress={handleOpenAddressModal}
            onDeleteAddress={handleDeleteAddress}
            onAddNew={() => handleOpenAddressModal(null)}
            onReceiverChange={setReceiver}
            onPhoneChange={setPhone}
            onLocationChange={setLocation}
          />

          <PaymentSection
            paymentMethods={activePaymentMethods}
            selectedId={selectedPaymentMethodId}
            onChange={setSelectedPaymentMethodId}
          />

          {orderError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {orderError}
            </div>
          )}
        </form>
      </div>

      {/* ── Right Column: Order Summary ──────────────────────────────────── */}
      <div>
        <OrderSummary
          cart={cart}
          isLoading={orderLoading}
          isDisabled={isSubmitDisabled}
        />
      </div>
    </div>
  );
}
