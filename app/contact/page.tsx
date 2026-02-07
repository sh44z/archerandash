import ContactForm from '@/app/components/ContactForm';
import { Metadata } from 'next';
import { FaEnvelope } from 'react-icons/fa';

export const metadata: Metadata = {
    title: 'Contact Us | Archer & Ash',
    description: 'Get in touch with Archer & Ash. Submit your inquiries about products, orders, partnerships, and more.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="bg-indigo-50 py-12 px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Contact Us</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We'd love to hear from you. For any inquiries, please fill out the form below or reach out to us directly via email.
                </p>
                <div className="mt-6 flex justify-center items-center space-x-2 text-indigo-700 font-medium">
                    <FaEnvelope className="h-5 w-5" />
                    <a href="mailto:customers@archerandash.com" className="hover:underline">customers@archerandash.com</a>
                </div>
            </div>

            <div className="py-12">
                <ContactForm />
            </div>
        </div>
    );
}

