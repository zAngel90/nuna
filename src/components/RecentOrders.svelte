<script lang="ts">
    import { onMount } from 'svelte';
    import { API_BASE_URL } from '$lib/config';

    interface OrderItem {
        id: string;
        name: string;
        price: number;
        quantity: number;
    }

    interface Order {
        id: string;
        customerInfo: {
            name: string;
            email: string;
            phone: string;
            address?: string;
        };
        items: OrderItem[];
        total: number;
        status: 'pending' | 'processing' | 'completed' | 'cancelled';
        createdAt: string;
        paymentProofUrl: string | null;
    }

    let orders: Order[] = [];
    let loading = true;
    let error = '';
    let selectedOrder: Order | null = null;
    let showDetails = false;

    const statusLabels: Record<Order['status'], string> = {
        pending: 'Pendiente',
        processing: 'En Proceso',
        completed: 'Completado',
        cancelled: 'Cancelado'
    };

    onMount(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/recent`);
            if (!response.ok) throw new Error('Error al obtener los pedidos');
            const { data } = await response.json();
            orders = data;
        } catch (err) {
            error = 'Error al cargar órdenes recientes';
            console.error(err);
        } finally {
            loading = false;
        }
    });

    function showOrderDetails(order: Order) {
        selectedOrder = order;
        showDetails = true;
    }

    function closeDetails() {
        showDetails = false;
        selectedOrder = null;
    }

    function formatDate(dateString: string) {
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'Fecha inválida';
        }
    }

    function formatCurrency(amount: number) {
        return amount.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP'
        });
    }
</script>

<div class="recent-orders">
    <h2>Órdenes Recientes</h2>

    {#if loading}
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando órdenes...</p>
        </div>
    {:else if error}
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {error}
        </div>
    {:else if orders.length === 0}
        <p class="no-orders">No hay órdenes recientes</p>
    {:else}
        <div class="orders-list">
            {#each orders as order}
                <div class="order-card" on:click={() => showOrderDetails(order)}>
                    <div class="order-header">
                        <span class="order-id">#{order.id}</span>
                        <span class="status-tag {order.status}">
                            {statusLabels[order.status]}
                        </span>
                    </div>
                    <div class="order-info">
                        <p class="customer-name">{order.customerInfo?.name || 'Sin nombre'}</p>
                        <p class="order-date">{formatDate(order.createdAt)}</p>
                        <p class="order-total">{formatCurrency(order.total)}</p>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

{#if showDetails && selectedOrder}
    <div class="modal-overlay" on:click={closeDetails}>
        <div class="modal-content" on:click|stopPropagation>
            <button class="close-btn" on:click={closeDetails}>
                <i class="fas fa-times"></i>
            </button>
            
            <h2>Detalles del Pedido #{selectedOrder.id}</h2>
            
            <div class="order-details">
                <div class="detail-section">
                    <h3>Información del Cliente</h3>
                    <p><strong>Nombre:</strong> {selectedOrder.customerInfo?.name || 'Sin nombre'}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerInfo?.email || 'Sin email'}</p>
                    <p><strong>Teléfono:</strong> {selectedOrder.customerInfo?.phone || 'Sin teléfono'}</p>
                    {#if selectedOrder.customerInfo?.address}
                        <p><strong>Dirección:</strong> {selectedOrder.customerInfo.address}</p>
                    {/if}
                </div>

                <div class="detail-section">
                    <h3>Productos</h3>
                    <div class="items-list">
                        {#each selectedOrder.items || [] as item}
                            <div class="item">
                                <span class="item-name">{item.name}</span>
                                <span class="item-quantity">x{item.quantity}</span>
                                <span class="item-price">{formatCurrency(item.price)}</span>
                            </div>
                        {/each}
                    </div>
                    <p class="total"><strong>Total:</strong> {formatCurrency(selectedOrder.total)}</p>
                </div>

                <div class="detail-section">
                    <h3>Comprobante de Pago</h3>
                    {#if selectedOrder.paymentProofUrl}
                        <div class="payment-proof">
                            <img src={selectedOrder.paymentProofUrl} alt="Comprobante de pago" />
                            <a href={selectedOrder.paymentProofUrl} target="_blank" class="download-btn">
                                <i class="fas fa-download"></i>
                                Ver Comprobante
                            </a>
                        </div>
                    {:else}
                        <p class="no-proof">No se ha subido comprobante</p>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .recent-orders {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        color: var(--color-dark);
        margin-bottom: 1.5rem;
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
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .no-orders {
        text-align: center;
        color: #666;
        padding: 2rem;
    }

    .orders-list {
        display: grid;
        gap: 1rem;
    }

    .order-card {
        padding: 1rem;
        border: 1px solid #eee;
        border-radius: 4px;
        transition: all 0.2s;
        cursor: pointer;
    }

    .order-card:hover {
        border-color: var(--color-gold-primary);
        transform: translateY(-2px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .order-id {
        font-weight: 500;
        color: var(--color-dark);
    }

    .status-tag {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.9rem;
    }

    .status-tag.pending {
        background: #fff3e0;
        color: #e65100;
    }

    .status-tag.processing {
        background: #e3f2fd;
        color: #1565c0;
    }

    .status-tag.completed {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .status-tag.cancelled {
        background: #ffebee;
        color: #c62828;
    }

    .order-info {
        display: grid;
        gap: 0.25rem;
    }

    .customer-name {
        font-weight: 500;
    }

    .order-date {
        font-size: 0.9rem;
        color: #666;
    }

    .order-total {
        font-weight: 500;
        color: var(--color-gold-primary);
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    }

    .close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #666;
        cursor: pointer;
    }

    .detail-section {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
    }

    .detail-section h3 {
        color: var(--color-dark);
        margin-bottom: 1rem;
    }

    .detail-section p {
        margin: 0.5rem 0;
    }

    .items-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        background: #f5f5f5;
        border-radius: 4px;
    }

    .total {
        margin-top: 1rem;
        font-size: 1.2rem;
        color: var(--color-dark);
    }

    .payment-proof {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .payment-proof img {
        max-width: 100%;
        max-height: 400px;
        object-fit: contain;
        border-radius: 4px;
    }

    .download-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--color-gold-primary);
        color: white;
        text-decoration: none;
        border-radius: 4px;
        transition: opacity 0.2s;
    }

    .download-btn:hover {
        opacity: 0.9;
    }

    .no-proof {
        color: #666;
        text-align: center;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 4px;
    }

    @media (max-width: 768px) {
        .modal-content {
            padding: 1rem;
            width: 95%;
        }
    }
</style> 