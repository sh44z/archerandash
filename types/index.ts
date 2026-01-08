export interface ProductVariant {
    size: string;
    price: number;
}

export interface Product {
    _id: string;
    title: string;
    description: string;
    price?: number; // Legacy
    variants: ProductVariant[];
    images: string[];
    category?: string; // ID
}
