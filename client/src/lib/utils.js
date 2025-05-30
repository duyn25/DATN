import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const translateOrderStatus = (status) => {
  switch (status) {
    case "pending": return "Chờ xác nhận";
    case "confirmed": return "Đã xác nhận";
    case "processing": return "Đang xử lý";
    case "shipped": return "Đang vận chuyển";
    case "delivered": return "Đã giao";
    case "cancelled": return "Đã huỷ";
    case "returned": return "Đã hoàn trả";
    default: return status;
  }
};

export const translatePaymentStatus = (status) => {
  switch (status) {
    case "pending": return "Chờ thanh toán";
    case "unpaid": return "Chưa thanh toán";
    case "paid": return "Đã thanh toán";
    case "failed": return "Thanh toán thất bại";
    case "refunded": return "Đã hoàn tiền";
    case "cancelled": return "Đã huỷ";
    default: return status;
  }
};
