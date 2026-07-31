import { axiosInstance } from "@/lib/axios";
import { ApiResponse, Payment } from "@/types";

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  transactionId: string;
  amount: number;
  paymentId: string;
  paymentIntentId?: string;
}

export interface ConfirmPaymentPayload {
  paymentIntentId?: string;
  transactionId?: string;
  rentalOrderId: string;
}

export const paymentService = {
  async createPaymentIntent(
    rentalOrderId: string
  ): Promise<ApiResponse<CreatePaymentIntentResponse>> {
    const response = await axiosInstance.post<
      ApiResponse<CreatePaymentIntentResponse>
    >("/payments/create", {
      rentalOrderId,
    });
    return response.data;
  },

  async confirmPayment(
    payload: ConfirmPaymentPayload
  ): Promise<ApiResponse<Payment>> {
    const response = await axiosInstance.post<ApiResponse<Payment>>(
      "/payments/confirm",
      {
        transactionId: payload.transactionId || payload.paymentIntentId,
        rentalOrderId: payload.rentalOrderId,
      }
    );
    return response.data;
  },

  async getCustomerPayments(): Promise<ApiResponse<Payment[]>> {
    const response =
      await axiosInstance.get<ApiResponse<Payment[]>>("/payments");
    return response.data;
  },
};
