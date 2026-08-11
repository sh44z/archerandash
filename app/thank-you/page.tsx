'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const orderValue = searchParams.get('total') || '';
  const voucherCode = searchParams.get('voucher') || '';

  const conversionUrl = useMemo(() => {
    if (!orderId || !orderValue) return '';

    const params = new URLSearchParams({
      client: 'java',
      MerchantID: '2677',
      SaleID: orderId,
      OrderValue: orderValue,
      ExcludeVAT: 'NO',
    });

    if (voucherCode) {
      params.set('VoucherCode', voucherCode);
    }

    return `https://portgk.com/create-sale?${params.toString()}`;
  }, [orderId, orderValue, voucherCode]);

  const noScriptUrl = useMemo(() => {
    if (!conversionUrl) return '';
    return conversionUrl.replace('client=java', 'client=img');
  }, [conversionUrl]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h1>
          <p className="text-gray-600 mb-4">Your payment has been received successfully.</p>
          <p className="text-gray-600">We will aim to dispatch your order within 2 working days.</p>
        </div>

        {conversionUrl && (
          <div className="mb-6 text-left text-sm text-gray-500">
            <p className="mb-2">Affiliate tracking has been recorded for:</p>
            <p>
              <span className="font-medium">Order ID:</span> {orderId}
            </p>
            <p>
              <span className="font-medium">Order value:</span> £{orderValue}
            </p>
            {voucherCode && (
              <p>
                <span className="font-medium">Voucher code:</span> {voucherCode}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/shop"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>

      {conversionUrl && (
        <>
          <Script id="paidon-results-conversion" src={conversionUrl} strategy="afterInteractive" />
          <noscript dangerouslySetInnerHTML={{ __html: `<img src="${noScriptUrl}" width="10" height="10" border="0" />` }} />
        </>
      )}
    </div>
  );
}
