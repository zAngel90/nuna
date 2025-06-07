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
    let selectedOrder: Order | null = null;
    let showDetails = false;
    let error = '';

    const statusColors: Record<Order['status'], string> = {
        pending: '#ffd700',
        processing: '#1e88e5',
        completed: '#43a047',
        cancelled: '#e53935'
    };

    const statusLabels: Record<Order['status'], string> = {
        pending: 'Pendiente',
        processing: 'En Proceso',
        completed: 'Completado',
        cancelled: 'Cancelado'
    };

    onMount(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`);
            if (!response.ok) throw new Error('Error al cargar los pedidos');
            const { data } = await response.json();
            orders = data;
        } catch (error) {
            console.error('Error loading orders:', error);
            error = 'Error al cargar los pedidos';
        } finally {
            loading = false;
        }
    });

    async function updateOrderStatus(orderId: string, newStatus: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error('Error al actualizar el estado');
            
            const updatedOrder = await response.json();
            orders = orders.map(order => 
                order.id === orderId ? updatedOrder : order
            );
        } catch (error) {
            console.error('Error updating order status:', error);
            // Mostrar mensaje de error al usuario
        }
    }

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
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Fecha inválida';
        }
    }

    function formatCurrency(amount: number) {
        try {
            return amount.toLocaleString('es-CL', {
                style: 'currency',
                currency: 'CLP'
            });
        } catch {
            return '$0';
        }
    }
</script>

<div class="admin-orders">
    <div class="admin-header">
        <h1>Administración de Órdenes</h1>
    </div>

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
        <div class="no-orders">
            <p>No hay órdenes registradas</p>
        </div>
    {:else}
        <div class="orders-list">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {#each orders as order}
                        <tr>
                            <td>{order.id}</td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>{order.customerInfo?.name || 'Sin nombre'}</td>
                            <td>{formatCurrency(order.total)}</td>
                            <td>
                                <span class="status-tag {order.status}">
                                    {statusLabels[order.status] || 'Desconocido'}
                                </span>
                            </td>
                            <td class="actions">
                                <select 
                                    value={order.status}
                                    on:change={(e) => {
                                        const target = e.target as HTMLSelectElement;
                                        updateOrderStatus(order.id, target.value as string);
                                    }}
                                >
                                    <option value="pending">Pendiente</option>
                                    <option value="processing">En Proceso</option>
                                    <option value="completed">Completado</option>
                                    <option value="cancelled">Cancelado</option>
                                </select>
                                <button 
                                    class="view-btn" 
                                    on:click={() => showOrderDetails(order)}
                                    title="Ver detalles"
                                >
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
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
    .admin-orders {
        padding: 8rem 2rem 4rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .admin-header {
        margin-bottom: 3rem;
        text-align: center;
    }

    .admin-header h1 {
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
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .no-orders {
        text-align: center;
        padding: 2rem;
        color: #666;
        background: #f5f5f5;
        border-radius: 4px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
    }

    th {
        background: var(--color-gold-primary);
        color: white;
        font-weight: 500;
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

    .actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    select {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .view-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: var(--color-gold-primary);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: opacity 0.2s;
    }

    .view-btn:hover {
        opacity: 0.9;
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
        .admin-orders {
            padding: 6rem 1rem 2rem;
        }

        table {
            display: block;
            overflow-x: auto;
        }

        .modal-content {
            padding: 1rem;
            width: 95%;
        }
    }
</style>