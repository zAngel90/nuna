import { writable, get } from 'svelte/store';

export interface CartProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
}

export interface CartItem {
    product: CartProduct;
    quantity: number;
}

// Definir la configuración de envío directamente aquí para evitar problemas de inicialización
const SHIPPING_CONFIG = {
    baseShippingCost: 5000,
    freeShippingThreshold: 50000
};

function createCartStore() {
    const { subscribe, set, update } = writable<CartItem[]>([]);

    function calculateSubtotal(items: CartItem[]) {
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    return {
        subscribe,
        addItem: (product: CartProduct) => {
            update(items => {
                const existingItem = items.find(item => item.product.id === product.id);
                if (existingItem) {
                    return items.map(item =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                return [...items, { product, quantity: 1 }];
            });
        },
        removeItem: (productId: string) => {
            update(items => items.filter(item => item.product.id !== productId));
        },
        updateQuantity: (productId: string, quantity: number) => {
            update(items => {
                if (quantity <= 0) {
                    return items.filter(item => item.product.id !== productId);
                }
                return items.map(item =>
                    item.product.id === productId
                        ? { ...item, quantity }
                        : item
                );
            });
        },
        clearCart: () => {
            set([]);
        },
        getSubtotal: () => {
            const items = get({ subscribe });
            return calculateSubtotal(items);
        },
        getShippingCost: () => {
            const items = get({ subscribe });
            const subtotal = calculateSubtotal(items);
            return subtotal >= SHIPPING_CONFIG.freeShippingThreshold ? 0 : SHIPPING_CONFIG.baseShippingCost;
        },
        getTotal: () => {
            const items = get({ subscribe });
            const subtotal = calculateSubtotal(items);
            return subtotal >= SHIPPING_CONFIG.freeShippingThreshold ? 
                subtotal : 
                subtotal + SHIPPING_CONFIG.baseShippingCost;
        }
    };
}

export const cart = createCartStore(); 