/**
 * Razorpay Checkout Integration
 * Handles payment flow for paid event tickets
 */

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    animation?: boolean;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, handler: () => void) => void;
}

export interface FeeBreakdown {
  ticketPrice: number;
  platformFee: number;
  gatewayFee: number;
  totalCharge: number;
  organizerPayout: number;
}

export interface PaymentOrder {
  order: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  };
  feeBreakdown: FeeBreakdown;
}

/**
 * Load Razorpay script dynamically
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay checkout modal
 */
export async function openRazorpayCheckout(
  options: Omit<RazorpayOptions, 'key' | 'handler'>,
): Promise<RazorpayResponse> {
  const scriptLoaded = await loadRazorpayScript();
  
  if (!scriptLoaded) {
    throw new Error('Failed to load Razorpay SDK');
  }

  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!key) {
    throw new Error('Razorpay key not configured');
  }

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      key,
      ...options,
      handler: (response) => {
        resolve(response);
      },
      modal: {
        ...options.modal,
        ondismiss: () => {
          reject(new Error('Payment cancelled by user'));
        },
      },
    });

    razorpay.open();
  });
}

/**
 * Format amount from paise to rupees display
 */
export function formatAmount(paise: number): string {
  if (paise === 0) return 'Free';
  return `₹${(paise / 100).toFixed(2)}`;
}

/**
 * Format amount for display (no decimals for whole numbers)
 */
export function formatAmountShort(paise: number): string {
  if (paise === 0) return 'Free';
  const rupees = paise / 100;
  return rupees % 1 === 0 ? `₹${rupees}` : `₹${rupees.toFixed(2)}`;
}
