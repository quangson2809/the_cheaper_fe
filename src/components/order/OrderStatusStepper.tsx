import type { OrderStatus } from '@/types/order.types';
import { ORDER_STATUS_LABEL } from '@/constants/orderStatus';

const FLOW_STEPS: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPING', 'DELIVERED'];

interface OrderStatusStepperProps {
  status: OrderStatus;
}

export function OrderStatusStepper({ status }: OrderStatusStepperProps) {
  if (status === 'CANCELED' || status === 'REFUNDED') {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4 text-sm">
        <p className="font-semibold text-slate-800">{ORDER_STATUS_LABEL[status]}</p>
        <p className="text-slate-500 mt-1">
          {status === 'CANCELED'
            ? 'Đơn hàng đã được hủy và sẽ không được giao.'
            : 'Đơn hàng đã được hoàn tiền.'}
        </p>
      </div>
    );
  }

  const currentIndex = FLOW_STEPS.indexOf(status);

  return (
    <ol className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
      {FLOW_STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === FLOW_STEPS.length - 1;

        return (
          <li key={step} className="flex sm:flex-1 items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-3 sm:flex-col sm:gap-2 sm:flex-1">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors duration-200 ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? '✓' : index + 1}
              </span>
              <span
                className={`text-sm font-medium sm:text-center sm:px-2 ${
                  isCurrent ? 'text-indigo-600' : isDone ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {ORDER_STATUS_LABEL[step]}
              </span>
            </div>
            {!isLast && (
              <div
                className={`hidden sm:block flex-1 h-0.5 mx-2 rounded-full ${
                  index < currentIndex ? 'bg-emerald-400' : 'bg-slate-200'
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
