export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shipping Information</h1>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Free Shipping Across the UK</h2>
              <p className="text-gray-600 mb-4">
                We offer free standard shipping on all orders within the United Kingdom. Your order will be dispatched within 2 working days of payment confirmation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Shipping Times</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Standard Delivery: 3-5 working days</li>
                <li>• Express Delivery: 1-2 working days (additional charges may apply)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">International Shipping</h3>
              <p className="text-gray-600 mb-4">
                Currently, we only ship within the United Kingdom. We hope to expand our shipping options in the future.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Order Tracking</h3>
              <p className="text-gray-600">
                Once your order is dispatched, you will receive a tracking number via email to monitor your package&apos;s journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}