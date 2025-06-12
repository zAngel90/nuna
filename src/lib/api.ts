import { API_BASE_URL } from './config';

const API_URL = API_BASE_URL;

// Opciones por defecto para fetch
const defaultFetchOptions = {
    headers: {
        'Content-Type': 'application/json'
    },
    mode: 'cors' as RequestMode,
    credentials: 'include' as RequestCredentials,
    cache: 'no-store' as RequestCache
};

interface ApiResponse<T> {
    data?: T;
    error?: string;
    pagination?: {
        total: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

// Productos
export async function getProducts(): Promise<ApiResponse<Product[]>> {
    try {
        const response = await fetch(`${API_URL}/products`, defaultFetchOptions);
        const result = await response.json();
        return {
            data: result.data,
            pagination: result.pagination
        };
    } catch (error) {
        return { error: 'Error al obtener los productos' };
    }
}

export async function getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    try {
        const response = await fetch(`${API_URL}/products/featured`, defaultFetchOptions);
        const result = await response.json();
        return { data: result.data };
    } catch (error) {
        return { error: 'Error al obtener los productos destacados' };
    }
}

export async function getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, defaultFetchOptions);
        const result = await response.json();
        return { data: result.data };
    } catch (error) {
        return { error: 'Error al obtener el producto' };
    }
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    try {
        const response = await fetch(`${API_URL}/products`, {
            ...defaultFetchOptions,
            method: 'POST',
            body: JSON.stringify(product)
        });
        const result = await response.json();
        return { data: result.data };
    } catch (error) {
        return { error: 'Error al crear el producto' };
    }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            ...defaultFetchOptions,
            method: 'PUT',
            body: JSON.stringify(product)
        });
        const result = await response.json();
        return { data: result.data };
    } catch (error) {
        return { error: 'Error al actualizar el producto' };
    }
}

export async function deleteProduct(id: string): Promise<ApiResponse<void>> {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            ...defaultFetchOptions,
            method: 'DELETE'
        });
        const result = await response.json();
        return { data: result.data };
    } catch (error) {
        return { error: 'Error al eliminar el producto' };
    }
}

// Categorías
export async function getCategories(): Promise<ApiResponse<Category[]>> {
    try {
        const response = await fetch(`${API_URL}/categories`, defaultFetchOptions);
        const result = await response.json();
        return { data: result.data };
    } catch (error) {
        return { error: 'Error al obtener las categorías' };
    }
}

export async function getCategoryById(id: string): Promise<ApiResponse<Category>> {
    try {
        const response = await fetch(`${API_URL}/categories/${id}`, defaultFetchOptions);
        const result = await response.json();
        return { data: result.data };
    } catch (error) {
        return { error: 'Error al obtener la categoría' };
    }
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<ApiResponse<Category>> {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            ...defaultFetchOptions,
            method: 'POST',
            body: JSON.stringify(category)
        });
        const result = await response.json();
        return { data: result.data };
    } catch (error) {
        return { error: 'Error al crear la categoría' };
    }
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<ApiResponse<Category>> {
    try {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            ...defaultFetchOptions,
            method: 'PUT',
            body: JSON.stringify(category)
        });
        const result = await response.json();
        return { data: result.data };
    } catch (error) {
        return { error: 'Error al actualizar la categoría' };
    }
}

export async function deleteCategory(id: string): Promise<ApiResponse<void>> {
    try {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            ...defaultFetchOptions,
            method: 'DELETE'
        });
        const result = await response.json();
        return { data: result.data };
    } catch (error) {
        return { error: 'Error al eliminar la categoría' };
    }
}

export async function addSubcategory(categoryId: string, subcategory: Omit<Subcategory, 'id'>): Promise<ApiResponse<Subcategory>> {
    try {
        const response = await fetch(`${API_URL}/categories/${categoryId}/subcategories`, {
            ...defaultFetchOptions,
            method: 'POST',
            body: JSON.stringify(subcategory)
        });
        const result = await response.json();
        return { data: result.data };
    } catch (error) {
        return { error: 'Error al añadir la subcategoría' };
    }
}

// Interfaces
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category_id: string;
    subcategory_id?: string;
    images: string[];
    slug: string;
    stock: number;
    specifications: {
        material?: string;
        stone?: string;
        weight?: string;
        size?: string;
    };
    featured?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    subcategories: Subcategory[];
}

export interface Subcategory {
    id: string;
    name: string;
    slug: string;
    description: string;
} 