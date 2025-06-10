<script lang="ts">
    import { isAuthenticated } from '$lib/stores/auth';
    import { goto } from '$app/navigation';
    import { slide } from 'svelte/transition';
    import { getCategories } from '$lib/api';
    import type { Category } from '$lib/api';
    import { onMount } from 'svelte';
    import { cart } from '$lib/stores/cart';
    import Cart from './Cart.svelte';

    let categories: Category[] = [];
    let error = '';
    let isMenuOpen = false;
    let activeCategory: string | null = null;
    let showCart = false;

    onMount(async () => {
        try {
            const response = await getCategories();
            if (response.error) {
                error = response.error;
            } else {
                categories = response.data || [];
            }
        } catch (err) {
            error = 'Error al cargar las categorías';
            console.error(err);
        }
    });

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function toggleCategory(categoryId: string) {
        activeCategory = activeCategory === categoryId ? null : categoryId;
    }

    function closeMenu() {
        isMenuOpen = false;
        activeCategory = null;
    }

    function handleLogout() {
        isAuthenticated.logout();
        goto('/admin/login');
    }
</script>

<nav class="navbar">
    <div class="container">
        <div class="navbar-content">
            <a href="/" class="logo">
                <span class="logo-text">LM</span>
                <span class="logo-subtext">JOYAS</span>
            </a>

            <button class="menu-toggle" on:click={toggleMenu}>
                <i class="fas fa-bars"></i>
            </button>

            <div class="nav-links" class:open={isMenuOpen}>
                <a href="/" class="nav-link">Inicio</a>
                
                <div class="categories-menu">
                    <a href="/catalogo" class="nav-link">
                        Catálogo
                        <i class="fas fa-chevron-down"></i>
                    </a>
                    <div class="categories-dropdown">
                        {#each categories as category}
                            <div class="category-item">
                                <div 
                                    class="category-header"
                                    on:click={() => toggleCategory(category.id)}
                                    on:keydown={(e) => e.key === 'Enter' && toggleCategory(category.id)}
                                    role="button"
                                    tabindex="0"
                                >
                                    <a href="/catalogo?category={category.slug}">{category.name}</a>
                                    {#if category.subcategories?.length}
                                        <i class="fas fa-chevron-right"></i>
                                    {/if}
                                </div>
                                
                                {#if category.subcategories?.length && activeCategory === category.id}
                                    <div class="subcategories">
                                        {#each category.subcategories as subcategory}
                                            <a 
                                                href="/catalogo?category={category.slug}&subcategory={subcategory.slug}"
                                                class="subcategory-item"
                                            >
                                                {subcategory.name}
                                            </a>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>

                <a href="/nosotros" class="nav-link">Nosotros</a>
            </div>

            <div class="nav-actions">
                <button class="cart-btn" on:click={() => showCart = true}>
                    <i class="fas fa-shopping-cart"></i>
                    {#if $cart.length > 0}
                        <span class="cart-count">{$cart.length}</span>
                    {/if}
                </button>
            </div>
        </div>
    </div>
</nav>

<Cart bind:isOpen={showCart} />

<style>
    :root {
        --color-gold-primary: #D4AF37;
        --color-gold-light: #FFD700;
        --color-gold-dark: #B8860B;
        --color-cream: #FFF8E7;
        --color-dark: #2C1810;
    }

    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
    }

    .navbar-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 80px;
        padding: 0 1rem;
    }

    .logo {
        text-decoration: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.5rem;
        transition: transform 0.3s ease;
    }

    .logo:hover {
        transform: scale(1.05);
    }

    .logo-text {
        font-family: 'Cormorant Garamond', serif;
        font-size: 2.8rem;
        color: var(--color-gold-primary);
        font-weight: 300;
        letter-spacing: 4px;
        line-height: 1;
        margin: 0;
        padding: 0;
        position: relative;
        display: inline-block;
    }

    .logo-text::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(
            to right,
            transparent,
            var(--color-gold-primary),
            transparent
        );
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    .logo:hover .logo-text::after {
        transform: scaleX(1);
    }

    .logo-subtext {
        font-family: 'Montserrat', sans-serif;
        font-size: 0.7rem;
        color: var(--color-dark);
        letter-spacing: 6px;
        margin-top: -5px;
        font-weight: 400;
        opacity: 0.8;
        transform: translateY(0);
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .logo:hover .logo-subtext {
        opacity: 1;
        transform: translateY(2px);
    }

    .menu-toggle {
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--color-dark);
        cursor: pointer;
    }

    .nav-links {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .nav-link {
        color: var(--color-dark);
        text-decoration: none;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: color 0.3s;
    }

    .nav-link:hover {
        color: var(--color-gold-primary);
    }

    .categories-menu {
        position: relative;
    }

    .categories-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        min-width: 200px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(10px);
        transition: all 0.3s;
    }

    .categories-menu:hover .categories-dropdown {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .category-item {
        position: relative;
    }

    .category-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .category-header:hover {
        background-color: rgba(212, 175, 55, 0.1);
    }

    .category-header a {
        color: var(--color-dark);
        text-decoration: none;
        font-weight: 500;
    }

    .subcategories {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        position: absolute;
        left: 100%;
        top: 0;
        min-width: 200px;
        padding: 0.5rem 0;
    }

    .subcategory-item {
        display: block;
        padding: 0.8rem 1rem;
        color: var(--color-dark);
        text-decoration: none;
        transition: background-color 0.3s;
    }

    .subcategory-item:hover {
        background-color: rgba(212, 175, 55, 0.1);
        color: var(--color-gold-primary);
    }

    .nav-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .search-btn,
    .cart-btn {
        background: none;
        border: none;
        font-size: 1.2rem;
        color: var(--color-dark);
        cursor: pointer;
        position: relative;
        padding: 0.5rem;
        transition: color 0.3s;
    }

    .search-btn:hover,
    .cart-btn:hover {
        color: var(--color-gold-primary);
    }

    .cart-count {
        position: absolute;
        top: -5px;
        right: -5px;
        background: var(--color-gold-primary);
        color: white;
        font-size: 0.8rem;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    @media (max-width: 768px) {
        .menu-toggle {
            display: block;
            order: 1;
            margin-right: 0.5rem;
        }

        .nav-links {
            position: fixed;
            top: 60px;
            left: 0;
            width: 100%;
            height: calc(100vh - 60px);
            background: white;
            flex-direction: column;
            padding: 2rem;
            transition: transform 0.3s ease;
            transform: translateX(-100%);
            margin: 0;
            z-index: 999;
        }

        .nav-links.open {
            transform: translateX(0);
        }

        .categories-dropdown {
            position: static;
            box-shadow: none;
            opacity: 1;
            visibility: visible;
            transform: none;
            margin-top: 1rem;
        }

        .subcategories {
            position: static;
            box-shadow: none;
            margin-left: 1rem;
        }

        .category-header {
            padding: 0.8rem;
        }

        .logo-text {
            font-size: 2rem;
        }

        .navbar-content {
            justify-content: space-between;
            padding: 0 1rem;
            height: 60px;
        }

        .nav-actions {
            order: 2;
            margin-left: 0.5rem;
        }

        .logo {
            order: 0;
            flex: 1;
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        .navbar-content {
            padding: 0 0.5rem;
        }

        .menu-toggle {
            margin-right: 0.25rem;
        }

        .nav-actions {
            margin-left: 0.25rem;
        }

        .logo-text {
            font-size: 1.8rem;
        }

        .nav-links {
            padding: 1rem;
        }
    }
</style> 