import type { UserAddressResponse } from '@/types/user.types';

// ─── Icons ────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

// ─── AddressCard ──────────────────────────────────────────────────────────────

interface AddressCardProps {
  addr: UserAddressResponse;
  isSelected: boolean;
  onSelect: (addr: UserAddressResponse) => void;
  onEdit: (addr: UserAddressResponse) => void;
  onDelete: (id: number) => void;
}

export function AddressCard({ addr, isSelected, onSelect, onEdit, onDelete }: AddressCardProps) {
  function handleDelete() {
    if (confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      onDelete(addr.id);
    }
  }

  const borderClass = isSelected
    ? 'border-indigo-400 bg-indigo-50/30'
    : 'border-slate-200';

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${borderClass}`}>
      {/* Radio + address info */}
      <label className="flex items-start gap-3 flex-1 cursor-pointer">
        <input
          type="radio"
          name="saved-address"
          checked={isSelected}
          onChange={() => onSelect(addr)}
          className="mt-1"
        />
        <div className="text-sm">
          <p className="font-semibold text-slate-800">
            {addr.homeNumber ? `${addr.homeNumber}, ` : ''}
            {addr.street}
          </p>
          <p className="text-slate-500">
            {addr.district}, {addr.city}
          </p>
          {addr.isDefault && (
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
              Mặc định
            </span>
          )}
        </div>
      </label>

      {/* Action buttons */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => onEdit(addr)}
          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
          title="Sửa"
        >
          <EditIcon />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
          title="Xóa"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

// ─── AddressSection ───────────────────────────────────────────────────────────

interface AddressSectionProps {
  addresses: UserAddressResponse[];
  selectedAddress: UserAddressResponse | null;
  receiver: string;
  phone: string;
  location: string;
  onSelectAddress: (addr: UserAddressResponse) => void;
  onEditAddress: (addr: UserAddressResponse) => void;
  onDeleteAddress: (id: number) => void;
  onAddNew: () => void;
  onReceiverChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

import { Input } from '@/components/ui';

export function AddressSection({
  addresses,
  selectedAddress,
  receiver,
  phone,
  location,
  onSelectAddress,
  onEditAddress,
  onDeleteAddress,
  onAddNew,
  onReceiverChange,
  onPhoneChange,
  onLocationChange,
}: AddressSectionProps) {
  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Thông tin giao hàng</h2>
        <button
          type="button"
          onClick={onAddNew}
          className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full"
          title="Thêm địa chỉ"
        >
          <PlusIcon />
        </button>
      </div>

      {/* Saved address list */}
      {addresses.length > 0 && (
        <div className="space-y-2">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              addr={addr}
              isSelected={selectedAddress?.id === addr.id}
              onSelect={onSelectAddress}
              onEdit={onEditAddress}
              onDelete={onDeleteAddress}
            />
          ))}
        </div>
      )}

      {/* Manual input */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold text-slate-700">Hoặc nhập thông tin mới:</p>
        <Input
          id="checkout-receiver"
          label="Người nhận"
          value={receiver}
          onChange={(e) => onReceiverChange(e.target.value)}
        />
        <Input
          id="checkout-phone"
          label="Số điện thoại"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
        <Input
          id="checkout-location"
          label="Địa chỉ chi tiết"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          required
        />
      </div>
    </section>
  );
}

// ─── PaymentSection ───────────────────────────────────────────────────────────

interface PaymentMethod {
  id: number;
  name: string;
  status: number;
}

interface PaymentSectionProps {
  paymentMethods: PaymentMethod[];
  selectedId: number | null;
  onChange: (id: number) => void;
}

export function PaymentSection({ paymentMethods, selectedId, onChange }: PaymentSectionProps) {
  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Phương thức thanh toán</h2>
      <div className="space-y-2">
        {paymentMethods.map((pm) => (
          <label
            key={pm.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-400 transition-colors"
          >
            <input
              type="radio"
              name="payment-method"
              checked={selectedId === pm.id}
              onChange={() => onChange(pm.id)}
            />
            <span className="text-sm font-medium text-slate-800">{pm.name}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

// ─── OrderSummary ─────────────────────────────────────────────────────────────

import { formatCurrency } from '@/utils/formatCurrency';
import { Button } from '@/components/ui';
import type { UserCartResponse } from '@/types/cart.types';

interface OrderSummaryProps {
  cart: UserCartResponse;
  isLoading: boolean;
  isDisabled: boolean;
}

export function OrderSummary({ cart, isLoading, isDisabled }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sticky top-24">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Đơn hàng của bạn</h2>

      {/* Item list */}
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

      {/* Totals */}
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

      {/* Submit */}
      <Button
        type="submit"
        form="checkout-form"
        size="lg"
        className="w-full"
        isLoading={isLoading}
        disabled={isDisabled}
      >
        Xác nhận đặt hàng
      </Button>
    </div>
  );
}
