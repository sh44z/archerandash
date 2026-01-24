import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="text-sm font-medium text-gray-500 mb-6" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">
                    <Link href="/" className="hover:text-gray-900 transition-colors">
                        Home
                    </Link>
                    <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </li>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={item.href} className="flex items-center">
                            {isLast ? (
                                <span className="text-gray-900" aria-current="page">
                                    {item.label}
                                </span>
                            ) : (
                                <>
                                    <Link href={item.href} className="hover:text-gray-900 transition-colors">
                                        {item.label}
                                    </Link>
                                    <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
