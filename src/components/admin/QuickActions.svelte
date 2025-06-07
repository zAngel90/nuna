<script lang="ts">
    import ActionCard from './ActionCard.svelte';

    const quickActions = [
        {
            href: '/admin/products/new',
            icon: 'fas fa-plus',
            title: 'Nuevo Producto',
            description: 'Agregar un nuevo producto al catálogo'
        },
        {
            href: '/admin/categories/new',
            icon: 'fas fa-folder-plus',
            title: 'Nueva Categoría',
            description: 'Crear una nueva categoría de productos'
        },
        {
            href: '/admin/home',
            icon: 'fas fa-home',
            title: 'Gestionar Home',
            description: 'Configurar carrusel, categorías y productos destacados'
        },
        {
            href: '/admin/payment-config',
            icon: 'fas fa-money-check-alt',
            title: 'Configurar Pagos',
            description: 'Configurar cuentas bancarias e instrucciones de pago'
        },
        {
            href: '/admin/orders',
            icon: 'fas fa-shipping-fast',
            title: 'Gestionar Pedidos',
            description: 'Ver y actualizar el estado de los pedidos'
        },
        {
            href: '/admin/settings',
            icon: 'fas fa-cog',
            title: 'Configuración',
            description: 'Ajustar la configuración de la tienda'
        }
    ];
</script>

<div class="quick-actions">
    <h2>Acciones Rápidas</h2>
    <div class="actions-grid">
        {#each quickActions as action}
            <ActionCard {...action} />
        {/each}
    </div>
</div>

<style>
    .quick-actions {
        margin-bottom: 3rem;
    }

    h2 {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        color: var(--color-dark);
        margin-bottom: 1.5rem;
    }

    .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    @media (max-width: 768px) {
        .actions-grid {
            grid-template-columns: 1fr;
        }
    }
</style> 