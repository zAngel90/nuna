<script lang="ts">
    import { onMount } from 'svelte';
    import { cart, type CartItem } from '$lib/stores/cart';
    import { goto } from '$app/navigation';
    import type { PaymentConfig } from '$lib/types';
    import { API_BASE_URL } from '$lib/config';

    let loading = false;
    let error = '';
    let paymentConfig: PaymentConfig | null = null;
    let selectedFile: File | null = null;
    let imagePreview = '';
    let cartItems: CartItem[] = [];
    let cartTotal = 0;

    function formatCurrency(amount: number) {
        return amount.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP'
        });
    }

    let customerInfo = {
        name: '',
        email: '',
        phone: '',
        address: ''
    };

    onMount(() => {
        let unsubscribe: () => void;

        const loadData = async () => {
            try {
                // Cargar configuración de pago
                const response = await fetch(`${API_BASE_URL}/payment-config`);
                if (!response.ok) throw new Error('Error al cargar la configuración de pago');
                paymentConfig = await response.json();

                // Suscribirse a los cambios del carrito
                unsubscribe = cart.subscribe(items => {
                    cartItems = items;
                    cartTotal = cart.getTotal();
                });
            } catch (err) {
                error = 'Error al cargar la información de pago';
                console.error(err);
            }
        };

        loadData();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    });

    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            selectedFile = input.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview = e.target?.result as string;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    async function handleSubmit() {
        if (!selectedFile || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
            error = 'Por favor complete todos los campos requeridos y suba el comprobante';
            return;
        }

        loading = true;
        error = '';

        try {
            // Convertir la imagen a base64
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            
            reader.onload = async () => {
                const paymentProof = reader.result;
                
                                const orderData = {
                    items: cartItems.map(item => ({
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        quantity: item.quantity,
                        images: item.product.images
                    })),
                    total: cartTotal,
                    customerInfo,
                    paymentProof
                };

                const response = await fetch(`${API_BASE_URL}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });

                if (!response.ok) throw new Error('Error al procesar el pedido');

                const order = await response.json();
                cart.clearCart();
                goto(`/checkout/confirmation/${order.id}`);
            };
        } catch (err) {
            error = 'Error al procesar el pedido';
            console.error(err);
        } finally {
            loading = false;
        }
    }
</script>

<div class="checkout-page">
    <div class="checkout-header">
        <h1>Información de Pago</h1>
    </div>

    {#if error}
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {error}
        </div>
    {/if}

    <div class="checkout-content">
        {#if !paymentConfig}
            <div class="loading-message">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Cargando información de pago...</p>
            </div>
        {:else}
            <section class="payment-info">
                <h2>Información de Contacto</h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="name">Nombre Completo *</label>
                        <input 
                            type="text" 
                            id="name" 
                            bind:value={customerInfo.name}
                            required
                        >
                    </div>
                    <div class="form-group">
                        <label for="email">Correo Electrónico *</label>
                        <input 
                            type="email" 
                            id="email" 
                            bind:value={customerInfo.email}
                            required
                        >
                    </div>
                    <div class="form-group">
                        <label for="phone">Teléfono *</label>
                        <input 
                            type="tel" 
                            id="phone" 
                            bind:value={customerInfo.phone}
                            required
                        >
                    </div>
                    <div class="form-group full-width">
                        <label for="address">Dirección de Envío</label>
                        <textarea 
                            id="address" 
                            bind:value={customerInfo.address}
                            rows="3"
                        ></textarea>
                    </div>
                </div>
            </section>

            <section class="bank-accounts">
                <h2>Cuentas Bancarias para Depósito</h2>
                <div class="accounts-grid">
                    {#each paymentConfig.bankAccounts as account}
                        <div class="account-card">
                            <h3>{account.bank}</h3>
                            <p><strong>Cuenta:</strong> {account.accountNumber}</p>
                            <p><strong>Titular:</strong> {account.accountHolder}</p>
                            <p><strong>Tipo:</strong> {account.accountType === 'savings' ? 'Ahorro' : 'Corriente'}</p>
                        </div>
                    {/each}
                </div>

                {#if paymentConfig.paymentInstructions}
                    <div class="payment-instructions">
                        <h3>Instrucciones de Pago</h3>
                        <p>{paymentConfig.paymentInstructions}</p>
                    </div>
                {/if}
            </section>

            <section class="proof-upload">
                <h2>Comprobante de Pago</h2>
                <div class="upload-area">
                    <input 
                        type="file" 
                        id="paymentProof" 
                        accept="image/*"
                        on:change={handleFileSelect}
                        class="file-input"
                    >
                    <label for="paymentProof" class="upload-label">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <span>Seleccionar comprobante de pago</span>
                    </label>
                    {#if imagePreview}
                        <div class="image-preview">
                            <img src={imagePreview} alt="Vista previa del comprobante">
                        </div>
                    {/if}
                </div>
            </section>

            <div class="order-summary">
                <h2>Resumen del Pedido</h2>
                <div class="summary-details">
                    <p><strong>Total de productos:</strong> {cartItems.length}</p>
                    <p><strong>Subtotal:</strong> {formatCurrency(cart.getSubtotal())}</p>
                    <p><strong>Costo de envío:</strong> {formatCurrency(cart.getShippingCost())}</p>
                    <p class="total"><strong>Total a pagar:</strong> {formatCurrency(cartTotal)}</p>
                </div>
            </div>

            <div class="form-actions">
                <button class="btn submit-button" on:click={handleSubmit} disabled={loading}>
                    {#if loading}
                        <i class="fas fa-spinner fa-spin"></i>
                        Procesando...
                    {:else}
                        Confirmar Pedido
                    {/if}
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    .checkout-page {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .checkout-header {
        margin-bottom: 2rem;
    }

    .checkout-header h1 {
        font-family: var(--font-heading);
        font-size: 2.5rem;
        color: var(--color-dark);
    }

    .error-message {
        background: #ffebee;
        color: #c62828;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .checkout-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    section {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid #eee;
    }

    h2 {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        color: var(--color-dark);
        margin-bottom: 1rem;
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-group.full-width {
        grid-column: 1 / -1;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--color-dark);
        font-weight: 500;
    }

    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: var(--font-body);
        font-size: 1rem;
    }

    .form-group textarea {
        resize: vertical;
    }

    .accounts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .account-card {
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 4px;
    }

    .account-card h3 {
        margin: 0 0 0.5rem;
        color: var(--color-dark);
    }

    .account-card p {
        margin: 0.25rem 0;
        color: #666;
    }

    .payment-instructions {
        margin-top: 1rem;
        padding: 1rem;
        background: #fff3e0;
        border-radius: 4px;
    }

    .payment-instructions h3 {
        color: var(--color-dark);
        margin-bottom: 0.5rem;
    }

    .upload-area {
        border: 2px dashed #ddd;
        padding: 2rem;
        text-align: center;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .file-input {
        display: none;
    }

    .upload-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        color: #666;
    }

    .upload-label i {
        font-size: 2rem;
        color: var(--color-gold-primary);
    }

    .image-preview {
        margin-top: 1rem;
        max-width: 300px;
        margin-inline: auto;
    }

    .image-preview img {
        width: 100%;
        height: auto;
        border-radius: 4px;
    }

    .order-summary {
        background: #f5f5f5;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 2rem;
    }

    .summary-details {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        margin-top: 1rem;
    }

    .summary-details p {
        margin: 0.5rem 0;
        display: flex;
        justify-content: space-between;
    }

    .total {
        font-size: 1.2rem;
        color: var(--color-gold-dark);
        border-top: 1px solid #ddd;
        padding-top: 1rem;
        margin-top: 1rem;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
    }

    .submit-button {
        background: var(--color-gold-primary);
        color: white;
        padding: 1rem 2rem;
        border: none;
        border-radius: 4px;
        font-family: var(--font-body);
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .submit-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        .checkout-page {
            padding: 1rem;
        }

        .form-grid,
        .accounts-grid {
            grid-template-columns: 1fr;
        }

        .summary-details {
            flex-direction: column;
            gap: 0.5rem;
        }
    }

    .loading-message {
        text-align: center;
        padding: 2rem;
        color: var(--color-dark);
    }

    .loading-message i {
        font-size: 2rem;
        color: var(--color-gold-primary);
        margin-bottom: 1rem;
    }
</style> 