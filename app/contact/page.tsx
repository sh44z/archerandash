import ContactForm from '@/app/components/ContactForm';
import { Metadata } from 'next';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export const metadata: Metadata = {
    title: 'Contact Us | Archer & Ash',
    description: 'Get in touch with Archer & Ash. Submit your inquiries about products, orders, partnerships, and more. Registered Office: 216-220 Blackfriars Road, London SE1 0XL.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <div
                className="bg-indigo-50 py-12 px-4 sm:px-6 lg:px-8 text-center"
                itemScope
                itemType="https://schema.org/Organization"
            >
                <meta itemProp="name" content="Archer And Ash UK" />
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Contact Us</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We'd love to hear from you. For any inquiries, please fill out the form below or reach out to us directly via email.
                </p>
                <div className="mt-6 flex justify-center items-center space-x-2 text-indigo-700 font-medium">
                    <FaEnvelope className="h-5 w-5" />
                    <a href="mailto:customers@archerandash.com" className="hover:underline" itemProp="email">customers@archerandash.com</a>
                </div>
                <div
                    className="mt-4 flex justify-center items-start space-x-2 text-gray-500 text-sm"
                    itemProp="address"
                    itemScope
                    itemType="https://schema.org/PostalAddress"
                >
                    <FaMapMarkerAlt className="h-4 w-4 mt-0.5 flex-shrink-0 text-indigo-400" />
                    <address className="not-italic">
                        <span className="font-medium text-gray-600">Registered Office: </span>
                        <span itemProp="streetAddress">216-220 Blackfriars Road</span>,{' '}
                        <span itemProp="addressLocality">London</span>{' '}
                        <span itemProp="postalCode">SE1 0XL</span>,{' '}
                        <span itemProp="addressCountry">UK</span>
                    </address>
                </div>
            </div>

            <div className="py-12">
                <ContactForm />
            </div>
        </div>
    );
}

