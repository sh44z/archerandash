import ContactForm from '@/app/components/ContactForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Archer & Ash',
    description: 'Get in touch with Archer & Ash. Submit your inquiries about products, orders, partnerships, and more.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <ContactForm />
        </div>
    );
}
