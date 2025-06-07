<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    interface CustomerInfo {
        name: string;
        email: string;
        phone: string;
        address?: string;
    }

    interface Order {
        id: string;
        total: number;
        status: string;
        createdAt: string;
        customerInfo: CustomerInfo;
    }

    let loading = true;
    let error = '';
    let order: Order;

    function formatCurrency(amount: number) {
        return amount.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP'
        });
    }

    onMount(async () => {
        try {
            const orderId = $page.params.orderId;
            const response = await fetch(`/api/orders/${orderId}`);
            if (!response.ok) throw new Error('Error al cargar el pedido');
            order = await response.json();
        } catch (err) {
            error = 'Error al cargar la información del pedido';
            console.error(err);
        } finally {
            loading = false;
        }
    });
</script>

<div class="confirmation-page">
    <div class="confirmation-header">
        <h1>Confirmación del Pedido</h1>
    </div>

    {#if loading}
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando información del pedido...</p>
        </div>
    {:else if error}
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {error}
        </div>
    {:else if order}
        <div class="confirmation-content">
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h2>¡Pedido Recibido!</h2>
                <p>Tu pedido ha sido registrado exitosamente. Hemos recibido tu comprobante de pago y lo estamos verificando.</p>
            </div>

            <div class="order-details">
                <h3>Detalles del Pedido</h3>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="label">Número de Pedido:</span>
                        <span class="value">{order.id}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Estado:</span>
                        <span class="value status-tag">{order.status}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Fecha:</span>
                        <span class="value">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Total:</span>
                        <span class="value">{formatCurrency(order.total)}</span>
                    </div>
                </div>
            </div>

            <div class="customer-info">
                <h3>Información de Contacto</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Nombre:</span>
                        <span class="value">{order.customerInfo.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Email:</span>
                        <span class="value">{order.customerInfo.email}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Teléfono:</span>
                        <span class="value">{order.customerInfo.phone}</span>
                    </div>
                    {#if order.customerInfo.address}
                        <div class="info-item full-width">
                            <span class="label">Dirección:</span>
                            <span class="value">{order.customerInfo.address}</span>
                        </div>
                    {/if}
                </div>
            </div>

            <div class="next-steps">
                <p class="contact-message">Nos pondremos en contacto contigo pronto para coordinar la entrega de tu pedido.</p>
            </div>

            <div class="actions">
                <a href="/" class="btn continue-shopping">
                    <i class="fas fa-arrow-left"></i>
                    Volver a la Tienda
                </a>
            </div>
        </div>
    {/if}
</div>

<style>
    .confirmation-page {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .confirmation-header {
        margin-bottom: 2rem;
    }

    .confirmation-header h1 {
        font-family: var(--font-heading);
        font-size: 2.5rem;
        color: var(--color-dark);
    }

    .loading {
        text-align: center;
        padding: 2rem;
        color: #666;
    }

    .loading i {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: var(--color-gold-primary);
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

    .confirmation-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .success-message {
        text-align: center;
        margin-bottom: 2rem;
        padding: 2rem;
        background: #e8f5e9;
        border-radius: 8px;
        color: #2e7d32;
    }

    .success-message i {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .success-message h2 {
        margin: 1rem 0;
        color: #2e7d32;
    }

    .success-message p {
        color: #1b5e20;
    }

    .order-details,
    .customer-info,
    .next-steps {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid #eee;
    }

    h3 {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        color: var(--color-dark);
        margin-bottom: 1rem;
    }

    .details-grid,
    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .detail-item,
    .info-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .full-width {
        grid-column: 1 / -1;
    }

    .label {
        color: #666;
        font-size: 0.9rem;
    }

    .value {
        font-weight: 500;
        color: var(--color-dark);
    }

    .status-tag {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        background: #fff3e0;
        color: #e65100;
        border-radius: 4px;
        font-size: 0.9rem;
    }

    .contact-message {
        text-align: center;
        color: var(--color-dark);
        font-size: 1.1rem;
        padding: 1rem;
        background: #fff3e0;
        border-radius: 4px;
        margin: 2rem 0;
    }

    .actions {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
    }

    .continue-shopping {
        background: var(--color-gold-primary);
        color: white;
        text-decoration: none;
        padding: 1rem 2rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s;
    }

    .continue-shopping:hover {
        opacity: 0.9;
    }

    @media (max-width: 768px) {
        .confirmation-page {
            padding: 1rem;
        }

        .details-grid,
        .info-grid {
            grid-template-columns: 1fr;
        }
    }
</style> 