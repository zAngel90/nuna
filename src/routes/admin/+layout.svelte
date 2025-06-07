<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { isAuthenticated } from '$lib/stores/auth';
    import { page } from '$app/stores';

    onMount(() => {
        if (!isAuthenticated.checkAuth() && $page.url.pathname !== '/admin/login') {
            goto('/admin/login');
        }
    });
</script>

<div class="admin-layout">
    <nav class="admin-nav">
        <div class="nav-content">
            <div class="nav-brand">
                <a href="/admin" class="brand-link">
                    <span class="brand-text">LM</span>
                    <span class="brand-subtext">Panel Admin</span>
                </a>
            </div>

            <div class="nav-links">
                <a href="/admin" class:active={$page.url.pathname === '/admin'}>
                    <i class="fas fa-home"></i>
                    <span>Dashboard</span>
                </a>
                <a href="/admin/products" class:active={$page.url.pathname.startsWith('/admin/products')}>
                    <i class="fas fa-box"></i>
                    <span>Productos</span>
                </a>
                <a href="/admin/orders" class:active={$page.url.pathname.startsWith('/admin/orders')}>
                    <i class="fas fa-shopping-bag"></i>
                    <span>Órdenes</span>
                </a>
                <a href="/admin/settings" class:active={$page.url.pathname.startsWith('/admin/settings')}>
                    <i class="fas fa-cog"></i>
                    <span>Configuración</span>
                </a>
                <a href="/admin/home" class:active={$page.url.pathname === '/admin/home'}>
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </a>
            </div>
        </div>
    </nav>

    <main class="admin-main">
        <slot />
    </main>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }

    .admin-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: #f8f9fa;
    }

    .admin-nav {
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        height: 60px;
    }

    .nav-content {
        max-width: 1400px;
        height: 100%;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .nav-brand {
        display: flex;
        align-items: center;
        height: 100%;
    }

    .brand-link {
        text-decoration: none;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .brand-text {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--color-gold-primary);
        line-height: 1;
    }

    .brand-subtext {
        font-size: 0.8rem;
        color: var(--color-dark);
        opacity: 0.7;
    }

    .nav-links {
        display: flex;
        align-items: center;
        gap: 1rem;
        height: 100%;
    }

    .nav-links a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        color: var(--color-dark);
        text-decoration: none;
        border-radius: 6px;
        transition: all 0.2s;
        height: 40px;
    }

    .nav-links a:hover {
        background: rgba(212, 175, 55, 0.1);
        color: var(--color-gold-primary);
    }

    .nav-links a.active {
        background: var(--color-gold-primary);
        color: white;
    }

    .nav-links i {
        font-size: 1.1rem;
    }

    .admin-main {
        margin-top: 60px;
        padding: 2rem;
        flex: 1;
    }

    @media (max-width: 768px) {
        .admin-nav {
            height: auto;
        }

        .nav-content {
            padding: 0.75rem 1rem;
            flex-direction: column;
            gap: 1rem;
        }

        .nav-links {
            width: 100%;
            justify-content: space-between;
            overflow-x: auto;
            padding-bottom: 0.5rem;
        }

        .nav-links a {
            padding: 0.5rem;
            flex-direction: column;
            font-size: 0.9rem;
            text-align: center;
            height: auto;
        }

        .nav-links span {
            display: none;
        }

        .admin-main {
            margin-top: 100px;
            padding: 1rem;
        }
    }
</style> 