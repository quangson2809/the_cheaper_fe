import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/user/useCart';
import { useAddress } from '@/hooks/user/useAddress';
import { useCreateOrder } from '@/hooks/order/useOrders';
import { usePaymentMethods } from '@/hooks/order/usePaymentMethods';
import type { UserAddressResponse, UserAddressCreateRequest } from '@/types/user.types';
import { Button, Input, Spinner } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';
import { PageHeader } from '@/components/common';
import { AddressForm } from '@/components/user/AddressForm';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, isLoading: cartLoading } = useCart();
  const { addresses, isLoading: addressLoading, createAddress, updateAddress, deleteAddress } = useAddress();
  const { createOrder, isLoading: orderLoading, error: orderError } = useCreateOrder();
  const { paymentMethods, isLoading: paymentMethodsLoading } = usePaymentMethods();
  
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddressResponse | null>(null);

  const activePaymentMethods = useMemo(() => {
    return paymentMethods.filter((pm) => pm.status === 1);
  }, [paymentMethods]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<UserAddressResponse | null>(null);
  const [receiver, setReceiver] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  // Handle address form submission
  async function handleAddressSubmit(data: UserAddressCreateRequest) {
    let success = false;
    if (editingAddress) {
      success = await updateAddress(editingAddress.id, data);
    } else {
      success = await createAddress(data);
    }
    if (success) {
      setShowForm(false);
      setEditingAddress(null);
    }
  }

  useEffect(() => {
    if (activePaymentMethods.length > 0 && selectedPaymentMethod === null) {
      setSelectedPaymentMethod(activePaymentMethods[0].id);
    }
  }, [activePaymentMethods, selectedPaymentMethod]);

  useEffect(() => {
    if (addresses.length > 0 && selectedAddress === null) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0];
      handleSelectAddress(def);
    }
  }, [addresses, selectedAddress]);

  function handleSelectAddress(addr: UserAddressResponse) {
    setSelectedAddress(addr);
    const fullLocation = [addr.homeNumber, addr.street, addr.district, addr.city]
      .filter(Boolean)
      .join(', ');
    setLocation(fullLocation);
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPaymentMethod) return;

    const res = await createOrder({
      paymentMethodId: selectedPaymentMethod,
      receiver,
      phone,
      location,
    });

    if (res) {
      navigate(`/orders/${res.id}`);
    }
  }

  if (cartLoading || addressLoading || paymentMethodsLoading) {
    return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;
  }

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Modal for AddressForm */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 shadow-xl max-w-lg w-full">
            <h2 className="text-lg font-bold mb-4">{editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}</h2>
            <AddressForm
              initialData={editingAddress}
              onSubmit={handleAddressSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <div>
        <div className="mb-6">
          <PageHeader title="Thanh toán" showBackBtn={true} />
        </div>

        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Thông tin giao hàng</h2>
              <button type="button" onClick={() => { setEditingAddress(null); setShowForm(true); }} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full" title="Thêm địa chỉ">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>

            {addresses.length > 0 && (
              <div className="space-y-2 mb-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`flex items-start gap-3 p-3 rounded-xl border ${selectedAddress?.id === addr.id ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200'} transition-colors`}>
                    <label className="flex items-start gap-3 flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="saved-address"
                        checked={selectedAddress?.id === addr.id}
                        onChange={() => handleSelectAddress(addr)}
                        className="mt-1"
                      />
                      <div className="text-sm">
                        <p className="font-semibold text-slate-800">
                          {addr.homeNumber ? `${addr.homeNumber}, ` : ''}{addr.street}
                        </p>
                        <p className="text-slate-500">{addr.district}, {addr.city}</p>
                        {addr.isDefault && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">Mặc định</span>}
                      </div>
                    </label>
                    <div className="flex flex-col gap-1">
                      <button type="button" onClick={() => { setEditingAddress(addr); setShowForm(true); }} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full" title="Sửa">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button type="button" onClick={() => { if(confirm('Xóa?')) void deleteAddress(addr.id); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full" title="Xóa">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-3 pt-2">
              <p className="text-sm font-semibold text-slate-700">Hoặc nhập thông tin mới:</p>
              <Input id="checkout-receiver" label="Người nhận" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
              <Input id="checkout-phone" label="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input id="checkout-location" label="Địa chỉ chi tiết" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
          </section>

          {/* ... (rest of the component remains same) */}


          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Phương thức thanh toán</h2>
            <div className="space-y-2">
              {activePaymentMethods.map((pm) => (
                <label key={pm.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-400 transition-colors">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={selectedPaymentMethod === pm.id}
                    onChange={() => setSelectedPaymentMethod(pm.id)}
                  />
                  <span className="text-sm font-medium text-slate-800">{pm.name}</span>
                </label>
              ))}
            </div>
          </section>

          {orderError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {orderError}
            </div>
          )}
        </form>
      </div>

      <div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sticky top-24">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Đơn hàng của bạn</h2>

          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{item.productName}</p>
                  <p className="text-slate-500 text-xs">
                    {item.optionNames?.join(' / ')} x {item.quantity}
                  </p>
                </div>
                <div className="font-semibold text-indigo-600 shrink-0">
                  {formatCurrency(item.price)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2 mb-6">
            <div className="flex justify-between text-slate-600 text-sm">
              <span>Tạm tính</span>
              <span>{formatCurrency(cart.totalPrice)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-slate-800 text-lg">
              <span>Tổng cộng</span>
              <span className="text-indigo-600">{formatCurrency(cart.totalPrice)}</span>
            </div>
          </div>

          <Button
            type="submit"
            form="checkout-form"
            size="lg"
            className="w-full"
            isLoading={orderLoading}
            disabled={!selectedPaymentMethod || !location.trim()}
          >
            Xác nhận đặt hàng
          </Button>
        </div>
      </div>
    </div>
  );
}
