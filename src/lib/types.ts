export interface BankAccount {
    bank: string;
    accountNumber: string;
    accountHolder: string;
    accountType: 'savings' | 'checking';
}

export interface PaymentConfig {
    bankAccounts: BankAccount[];
    paymentInstructions: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    category_id: string;
    subcategory_id?: string;
    specifications: {
        material?: string;
        stone?: string;
        weight?: string;
        size?: string;
    };
    stock: number;
    featured?: boolean;
    slug: string;
    createdAt: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    address?: string;
}

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    customerInfo: CustomerInfo;
    paymentProof: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
} 