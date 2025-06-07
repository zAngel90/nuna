<script lang="ts">
    import { cart, type CartItem } from '$lib/stores/cart';
    import { goto } from '$app/navigation';
    
    export let isOpen = false;

    function handleCheckout() {
        isOpen = false;
        goto('/checkout/payment');
    }

    function formatCurrency(amount: number) {
        return amount.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP'
        });
    }

    $: cartItems = $cart;
    $: subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    $: shippingCost = cart.getShippingCost();
    $: total = subtotal + shippingCost;

    function getImageUrl(imageUrl: string | undefined) {
        if (!imageUrl) return '/placeholder.png';
        if (imageUrl.startsWith('http')) return imageUrl;
        return `${import.meta.env.VITE_API_URL || 'https://rep-nvjm.onrender.com'}${imageUrl}`;
    }
</script>

<div class="cart-overlay" class:open={isOpen} on:click={() => isOpen = false}>
    <div class="cart-container" on:click|stopPropagation>
        <div class="cart-header">
            <h2>
                <i class="fas fa-shopping-cart"></i>
                Mi Carrito
            </h2>
            <button class="close-btn" on:click={() => isOpen = false}>
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        {#if $cart.length === 0}
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Tu carrito está vacío</p>
                <button class="btn-shop" on:click={() => {
                    isOpen = false;
                    goto('/catalogo');
                }}>
                    Ir al Catálogo
                </button>
            </div>
        {:else}
            <div class="cart-items">
                {#each cartItems as item}
                    <div class="cart-item">
                        <div class="item-image">
                            <img src={getImageUrl(item.product.images[0])} alt={item.product.name} />
                        </div>
                        <div class="item-details">
                            <h3>{item.product.name}</h3>
                            <p class="price">{formatCurrency(item.product.price)}</p>
                            <div class="quantity-controls">
                                <button on:click={() => cart.updateQuantity(item.product.id, item.quantity - 1)}>
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span>{item.quantity}</span>
                                <button on:click={() => cart.updateQuantity(item.product.id, item.quantity + 1)}>
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <button class="remove-btn" on:click={() => cart.removeItem(item.product.id)}>
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                {/each}
            </div>
            
            <div class="cart-footer">
                <div class="subtotal">
                    <span>Subtotal:</span>
                    <span class="amount">{formatCurrency(subtotal)}</span>
                </div>
                <div class="shipping">
                    <span>Costo de envío:</span>
                    <span class="amount">{formatCurrency(shippingCost)}</span>
                </div>
                <div class="total">
                    <span>Total:</span>
                    <span class="amount">{formatCurrency(total)}</span>
                </div>
                <button class="checkout-btn" on:click={handleCheckout}>
                    <i class="fas fa-credit-card"></i>
                    Proceder al Pago
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    .cart-overlay {
        position: fixed;
        top: 0;
        right: -100%;
        width: 100%;
        max-width: 450px;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        transition: right 0.3s ease;
        z-index: 1000;
    }

    .cart-overlay.open {
        right: 0;
    }

    .cart-container {
        position: absolute;
        right: 0;
        width: 100%;
        max-width: 450px;
        height: 100%;
        background: white;
        display: flex;
        flex-direction: column;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    }

    .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        background: var(--color-dark);
        color: white;
    }

    .cart-header h2 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.5rem;
        margin: 0;
    }

    .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        transition: transform 0.2s;
    }

    .close-btn:hover {
        transform: scale(1.1);
    }

    .empty-cart {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: #666;
    }

    .empty-cart i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: var(--color-gold-primary);
    }

    .btn-shop {
        margin-top: 1rem;
        padding: 0.8rem 1.5rem;
        background: var(--color-gold-primary);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
    }

    .btn-shop:hover {
        background: var(--color-gold-dark);
    }

    .cart-items {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
    }

    .cart-item {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        margin-bottom: 1rem;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        transition: transform 0.2s;
    }

    .cart-item:hover {
        transform: translateY(-2px);
    }

    .item-image {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        overflow: hidden;
    }

    .item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .item-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .item-details h3 {
        font-size: 1rem;
        margin: 0;
        color: var(--color-dark);
    }

    .item-price {
        font-weight: bold;
        color: var(--color-gold-dark);
        margin: 0;
    }

    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .qty-btn {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: none;
        background: #f0f0f0;
        color: var(--color-dark);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .qty-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .qty-btn:not(:disabled):hover {
        background: var(--color-gold-primary);
        color: white;
    }

    .quantity {
        font-weight: bold;
        min-width: 24px;
        text-align: center;
    }

    .remove-btn {
        background: none;
        border: none;
        color: #ff4444;
        cursor: pointer;
        padding: 0.5rem;
        transition: transform 0.2s;
        align-self: center;
    }

    .remove-btn:hover {
        transform: scale(1.1);
    }

    .cart-footer {
        padding: 1.5rem;
        background: #f8f9fa;
        border-top: 1px solid #eee;
    }

    .subtotal, .shipping, .total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .subtotal, .shipping {
        font-size: 1rem;
    }

    .total {
        font-size: 1.2rem;
        font-weight: bold;
        border-top: 1px solid #eee;
        padding-top: 1rem;
    }

    .amount {
        color: var(--color-gold-dark);
    }

    .checkout-btn {
        width: 100%;
        padding: 1rem;
        background: var(--color-gold-primary);
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1.1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: background 0.2s;
    }

    .checkout-btn:hover {
        background: var(--color-gold-dark);
    }

    @media (max-width: 480px) {
        .cart-container {
            max-width: 100%;
        }

        .cart-item {
            grid-template-columns: 60px 1fr auto;
        }

        .item-image {
            width: 60px;
            height: 60px;
        }
    }
</style> 