import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export const stripeCheckoutApiClient = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export interface CreateCheckoutSessionRequest {
  bookingId: string;
  vendorUserId: string;
  amountEur: number;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  serviceName?: string;
  participantsAdults?: number;
  participantsEnfants?: number;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  sessionUrl: string;
}

export interface TransactionStatus {
  _id: string;
  bookingId: string;
  vendorUserId: string;
  stripeAccountId: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'expired';
  customerEmail?: string;
  cardLast4?: string;
  cardholderName?: string;
  participantsAdults: number;
  participantsEnfants: number;
  serviceName?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create a Stripe Checkout Session for a booking
 * Returns { sessionId, sessionUrl } — redirect the user to sessionUrl
 */
export async function createCheckoutSession(
  data: CreateCheckoutSessionRequest,
): Promise<CheckoutSessionResponse> {
  const response = await stripeCheckoutApiClient.post('/stripe-checkout/session', data);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to create checkout session');
  }
  return response.data.data as CheckoutSessionResponse;
}

/**
 * Get a transaction/session status by Stripe session ID
 * Used on the success page to confirm payment went through
 */
export async function getSessionStatus(sessionId: string): Promise<TransactionStatus | null> {
  const response = await stripeCheckoutApiClient.get(`/stripe-checkout/session/${sessionId}`);
  if (!response.data.success) return null;
  return response.data.data as TransactionStatus;
}

/**
 * Get all transactions for the authenticated vendor (uses cookie auth)
 */
export async function getVendorTransactions(): Promise<TransactionStatus[]> {
  const response = await stripeCheckoutApiClient.get('/stripe-checkout/transactions');
  if (!response.data.success) return [];
  return response.data.data as TransactionStatus[];
}
