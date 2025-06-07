<script lang="ts">
    import { onMount } from 'svelte';
    import StatsCard from '../../components/admin/StatsCard.svelte';
    import QuickActions from '../../components/admin/QuickActions.svelte';
    import RecentOrders from '../../components/admin/RecentOrders.svelte';
    import { API_BASE_URL } from '$lib/config';

    interface Stats {
        totalProducts: number;
        totalCategories: number;
        totalOrders: number;
        totalRevenue: number;
    }

    let stats: Stats = {
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalRevenue: 0
    };

    let loading = true;

    onMount(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/stats`);
            const data = await response.json();
            stats = data;
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            loading = false;
        }
    });
</script>

<svelte:head>
    <title>Panel de Administración - LM Joyas</title>
</svelte:head>

<div class="admin-dashboard">
    <div class="admin-header">
        <div class="header-content">
            <div>
                <h1>Panel de Administración</h1>
                <p class="welcome-message">Bienvenido al panel de administración de LM Joyas</p>
            </div>
            <div class="shopify-promo">
                <img src="https://i.postimg.cc/B6Ywh9JB/images.png" alt="Shopify Logo" />
                <p>Panel desarrollado con Shopify</p>
            </div>
        </div>
    </div>

    {#if loading}
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando estadísticas...</p>
        </div>
    {:else}
        <div class="stats-grid">
            <StatsCard 
                title="Productos"
                value={stats.totalProducts}
                icon="box"
            />
            <StatsCard 
                title="Categorías"
                value={stats.totalCategories}
                icon="tags"
            />
            <StatsCard 
                title="Órdenes"
                value={stats.totalOrders}
                icon="shopping-bag"
            />
            <StatsCard 
                title="Ingresos"
                value={stats.totalRevenue}
                icon="dollar-sign"
                isCurrency={true}
            />
        </div>

        <QuickActions />
        <RecentOrders />
    {/if}
</div>

<style>
    .admin-dashboard {
        padding: 2rem;
    }

    .admin-header {
        margin-bottom: 3rem;
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .shopify-promo {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f4f6f8;
        border-radius: 8px;
    }

    .shopify-promo img {
        height: 40px;
        width: auto;
    }

    .shopify-promo p {
        color: #42474c;
        font-size: 0.9rem;
        margin: 0;
    }

    h1 {
        font-size: 2rem;
        color: var(--color-dark);
        margin-bottom: 0.5rem;
    }

    .welcome-message {
        color: #666;
        margin: 0;
    }

    .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
        color: #666;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }

    @media (max-width: 768px) {
        .header-content {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
        }

        .shopify-promo {
            width: 100%;
            justify-content: center;
        }
    }
</style> 