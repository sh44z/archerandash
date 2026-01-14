export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Returns & Refunds</h1>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Returns Policy</h2>
              <p className="text-gray-600 mb-4">
                We want you to be completely satisfied with your purchase. If you&apos;re not happy with your order, you can return any faulty products within 14 days of receiving them for a full refund.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Eligibility for Returns</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Products must be returned within 14 days of delivery</li>
                <li>• Items must be in their original condition and packaging</li>
                <li>• Products must be unused and unwashed</li>
                <li>• Returns are only accepted for faulty or damaged products</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Return an Item</h3>
              <ol className="space-y-2 text-gray-600 list-decimal list-inside">
                <li>Contact our customer service team with your order details</li>
                <li>Package the item securely in its original packaging</li>
                <li>Include a copy of your order confirmation or receipt</li>
                <li>Ship the item back to us using a tracked delivery service</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Refund Process</h3>
              <p className="text-gray-600 mb-4">
                Once we receive and inspect your returned item, we will process your refund within 5-7 working days. Refunds will be issued to the original payment method.
              </p>
              <p className="text-gray-600">
                Please note that return shipping costs are the responsibility of the customer unless the item is faulty or damaged.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
              <p className="text-gray-600">
                If you have any questions about returns or need assistance, please contact our customer service team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}