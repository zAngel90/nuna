<script lang="ts">
    import { onMount } from 'svelte';
    import { API_BASE_URL } from '$lib/config';

    interface Order {
        id: string;
        customerName: string;
        total: number;
        status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
        createdAt: string;
    }

    let recentOrders: Order[] = [];
    let loading = true;
    let selectedOrder: Order | null = null;
    let showDetails = false;

    const statusColors = {
        pending: '#ffd700',
        processing: '#1e88e5',
        shipped: '#43a047',
        delivered: '#4caf50',
        cancelled: '#e53935'
    };

    const statusLabels = {
        pending: 'Pendiente',
        processing: 'En Proceso',
        shipped: 'Enviado',
        delivered: 'Entregado',
        cancelled: 'Cancelado'
    };

    onMount(async () => {
        try {
            const fetchOptions: RequestInit = {
                mode: 'cors',
                credentials: 'include',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await fetch(`${API_BASE_URL}/orders/recent`, fetchOptions);
            if (!response.ok) throw new Error('Error al cargar las órdenes recientes');
            const data = await response.json();
            recentOrders = data.orders || [];
        } catch (error) {
            console.error('Error loading recent orders:', error);
        } finally {
            loading = false;
        }
    });

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
    }

    function formatCurrency(amount: number) {
        return amount.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'COP'
        });
    }

    function showOrderDetails(order: Order) {
        selectedOrder = order;
        showDetails = true;
    }

    function closeDetails() {
        showDetails = false;
        selectedOrder = null;
    }
</script>

<div class="recent-orders">
    <h2>Pedidos Recientes</h2>
    
    {#if loading}
        <div class="loading">Cargando...</div>
    {:else if recentOrders.length === 0}
        <div class="empty-state">
            <i class="fas fa-inbox"></i>
            <p>No hay pedidos recientes</p>
        </div>
    {:else}
        <div class="orders-list">
            {#each recentOrders as order}
                <div class="order-item" on:click={() => showOrderDetails(order)}>
                    <div class="order-info">
                        <span class="order-id">#{order.id}</span>
                        <span class="customer-name">{order.customerName}</span>
                    </div>
                    <div class="order-details">
                        <span class="order-total">{formatCurrency(order.total)}</span>
                        <span 
                            class="order-status"
                            style="--status-color: {statusColors[order.status]}"
                        >
                            {statusLabels[order.status]}
                        </span>
                        <span class="order-date">{formatDate(order.createdAt)}</span>
                    </div>
                </div>
            {/each}
        </div>
        <a href="/admin/orders" class="view-all">
            Ver todos los pedidos
            <i class="fas fa-arrow-right"></i>
        </a>
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
                    <p><strong>Cliente:</strong> {selectedOrder.customerName}</p>
                    <p><strong>Estado:</strong> {statusLabels[selectedOrder.status]}</p>
                    <p><strong>Fecha:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    <p><strong>Total:</strong> {formatCurrency(selectedOrder.total)}</p>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .recent-orders {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

    .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
    }

    .empty-state i {
        font-size: 2rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .orders-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .order-item {
        padding: 1rem;
        border: 1px solid #eee;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .order-item:hover {
        border-color: var(--color-gold-primary);
        transform: translateY(-2px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .order-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.5rem;
    }

    .order-id {
        font-weight: 500;
        color: var(--color-dark);
    }

    .customer-name {
        color: #666;
    }

    .order-details {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .order-total {
        font-weight: 500;
        color: var(--color-gold-primary);
    }

    .order-status {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.9rem;
        background: var(--status-color);
        color: white;
    }

    .order-date {
        font-size: 0.9rem;
        color: #666;
    }

    .view-all {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1.5rem;
        padding: 0.75rem;
        color: var(--color-gold-primary);
        text-decoration: none;
        border-top: 1px solid #eee;
        transition: color 0.2s;
    }

    .view-all:hover {
        color: var(--color-gold-dark);
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
        max-width: 600px;
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
        margin-bottom: 1.5rem;
    }

    .detail-section h3 {
        color: var(--color-dark);
        margin-bottom: 1rem;
    }

    .detail-section p {
        margin: 0.5rem 0;
    }

    @media (max-width: 768px) {
        .order-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }

        .modal-content {
            width: 95%;
            padding: 1rem;
        }
    }
</style> 