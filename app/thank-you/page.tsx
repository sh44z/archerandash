'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [paramsState, setParamsState] = useState<{
    orderId: string;
    total: string;
    voucher: string;
  }>({
    orderId: '',
    total: '',
    voucher: '',
  });

  useEffect(() => {
    // Read from useSearchParams or fallback to window.location.search
    const getParam = (keys: string[]): string => {
      for (const key of keys) {
        const val = searchParams?.get(key);
        if (val) return val;
      }
      if (typeof window !== 'undefined') {
        const windowParams = new URLSearchParams(window.location.search);
        for (const key of keys) {
          const val = windowParams.get(key);
          if (val) return val;
        }
      }
      return '';
    };

    const rawOrderId = getParam(['orderId', 'SaleID', 'order_id', 'id']);
    const rawTotal = getParam(['total', 'OrderValue', 'order_value', 'amount', 'value']);
    const rawVoucher = getParam(['voucher', 'VoucherCode', 'discount', 'coupon', 'voucherCode']);

    // Clean total to ensure valid numeric string without currency symbols
    const cleanedTotal = rawTotal ? rawTotal.replace(/[^0-9.]/g, '') : '';

    setParamsState({
      orderId: rawOrderId.trim(),
      total: cleanedTotal,
      voucher: rawVoucher.trim(),
    });
  }, [searchParams]);

  const { orderId, total: orderValue, voucher: voucherCode } = paramsState;

  // Build Paid On Results Conversion URLs
  const { conversionUrl, noScriptUrl } = useMemo(() => {
    if (!orderId || !orderValue) {
      return { conversionUrl: '', noScriptUrl: '' };
    }

    const params = new URLSearchParams({
      client: 'java',
      MerchantID: '2677',
      SaleID: orderId,
      OrderValue: orderValue,
      VoucherCode: voucherCode || '',
      ExcludeVAT: 'NO',
    });

    const jsUrl = `https://portgk.com/create-sale?${params.toString()}`;
    const imgParams = new URLSearchParams(params);
    imgParams.set('client', 'img');
    const imgUrl = `https://portgk.com/create-sale?${imgParams.toString()}`;

    return { conversionUrl: jsUrl, noScriptUrl: imgUrl };
  }, [orderId, orderValue, voucherCode]);

  // Execute Paid On Results conversion tracking tag dynamically
  useEffect(() => {
    if (!conversionUrl || !orderId) return;

    const storageKey = `por_sale_tracked_${orderId}`;
    if (typeof window !== 'undefined') {
      try {
        if (sessionStorage.getItem(storageKey)) {
          // Prevent double tracking if user reloads the page
          return;
        }
        sessionStorage.setItem(storageKey, 'true');
      } catch (e) {
        // Ignore sessionStorage restrictions in private browsing
      }

      // Inject Paid On Results conversion JavaScript tag
      const script = document.createElement('script');
      script.src = conversionUrl;
      script.type = 'text/javascript';
      script.async = true;
      document.body.appendChild(script);

      // Fire fallback image beacon
      if (noScriptUrl) {
        const beacon = new Image();
        beacon.src = noScriptUrl;
      }
    }
  }, [conversionUrl, noScriptUrl, orderId]);

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

        {orderId && (
          <div className="mb-6 text-left text-sm text-gray-500 bg-gray-50 p-4 rounded-md border border-gray-100">
            <p className="mb-2 font-semibold text-gray-700">Order Summary:</p>
            <p>
              <span className="font-medium text-gray-600">Order ID:</span> {orderId}
            </p>
            {orderValue && (
              <p>
                <span className="font-medium text-gray-600">Order Value:</span> £{orderValue}
              </p>
            )}
            {voucherCode && (
              <p>
                <span className="font-medium text-gray-600">Voucher Code:</span> {voucherCode}
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
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img src="${noScriptUrl}" width="10" height="10" border="0" />`,
          }}
        />
      )}
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
