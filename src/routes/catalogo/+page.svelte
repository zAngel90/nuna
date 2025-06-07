<script lang="ts">
    import { onMount } from 'svelte';
    import { cart } from '$lib/stores/cart';
    import type { Product, Category } from '$lib/api';
    import { getProducts, getCategories } from '$lib/api';
    import Cart from '../../components/Cart.svelte';

    let products: Product[] = [];
    let categories: Category[] = [];
    let loading = true;
    let error = '';
    let showCart = false;

    // Filtros y paginación
    let selectedCategory = '';
    let searchQuery = '';
    let currentPage = 1;
    let itemsPerPage = 12;
    let sortBy = 'newest';

    let filteredProducts: Product[] = [];
    $: {
        filteredProducts = products.filter(product => {
            const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
            const matchesSearch = !searchQuery || 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        // Ordenar productos
        filteredProducts.sort((a, b) => {
            switch(sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                default: // newest
                    return 0;
            }
        });
    }

    $: totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    $: paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    onMount(async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                getProducts(),
                getCategories()
            ]);

            if (productsRes.error) {
                error = productsRes.error;
            } else if (categoriesRes.error) {
                error = categoriesRes.error;
            } else {
                products = productsRes.data || [];
                categories = categoriesRes.data || [];
                console.log('Categorías cargadas:', categories); // Para debug
            }
        } catch (err) {
            error = 'Error al cargar los datos';
            console.error('Error en onMount:', err);
        } finally {
            loading = false;
        }
    });

    function handlePageChange(page: number) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function addToCart(product: Product) {
        cart.addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images
        });
        showCart = true;
    }

    function formatCurrency(amount: number) {
        return amount.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP'
        });
    }
</script>

<svelte:head>
    <title>Catálogo - Joyería</title>
</svelte:head>

<div class="catalog-hero">
    <div class="container">
        <h1 class="section-title">Nuestro Catálogo</h1>
        <p class="hero-description">Descubre nuestra exclusiva colección de joyas artesanales</p>
    </div>
</div>

<div class="container">
    <div class="filters-section">
        <div class="search-box">
            <div class="search-wrapper">
                <i class="fas fa-search search-icon"></i>
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="¿Qué joya estás buscando?"
                    class="search-input"
                />
                {#if searchQuery}
                    <button class="clear-search" on:click={() => searchQuery = ''}>
                        <i class="fas fa-times"></i>
                    </button>
                {/if}
            </div>
        </div>
        
        <div class="filter-controls">
            <div class="select-wrapper">
                <i class="fas fa-tags category-icon"></i>
                <select bind:value={selectedCategory} class="filter-select">
                    <option value="">Todas las categorías</option>
                    {#each categories as category}
                        <option value={category.id}>{category.name}</option>
                    {/each}
                </select>
            </div>

            <div class="select-wrapper">
                <i class="fas fa-sort-amount-down sort-icon"></i>
                <select bind:value={sortBy} class="filter-select">
                    <option value="newest">Más recientes</option>
                    <option value="price-low">Precio: Menor a Mayor</option>
                    <option value="price-high">Precio: Mayor a Menor</option>
                    <option value="name">Nombre</option>
                </select>
            </div>
        </div>
    </div>

    {#if loading}
        <div class="loading">
            <div class="loader"></div>
            <p>Cargando productos...</p>
        </div>
    {:else if error}
        <div class="error">
            <i class="fas fa-exclamation-circle"></i>
            <p>{error}</p>
        </div>
    {:else}
        <div class="products-grid">
            {#each paginatedProducts as product}
                <div class="product-card card">
                    <div class="product-image">
                        <img src={product.images[0]} alt={product.name} loading="lazy" />
                        <div class="product-overlay">
                            <button class="btn add-to-cart" on:click={() => addToCart(product)}>
                                <i class="fas fa-shopping-cart"></i>
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>{product.name}</h3>
                        <p class="price">{formatCurrency(product.price)}</p>
                        <p class="description">{product.description}</p>
                        <div class="product-specs">
                            {#if product.specifications.material}
                                <span class="spec">
                                    <i class="fas fa-gem"></i>
                                    {product.specifications.material}
                                </span>
                            {/if}
                            {#if product.specifications.stone}
                                <span class="spec">
                                    <i class="fas fa-certificate"></i>
                                    {product.specifications.stone}
                                </span>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        {#if totalPages > 1}
            <div class="pagination">
                <button 
                    class="btn page-btn"
                    disabled={currentPage === 1}
                    on:click={() => handlePageChange(currentPage - 1)}
                >
                    <i class="fas fa-chevron-left"></i>
                    Anterior
                </button>
                
                <div class="page-numbers">
                    {#each Array(totalPages) as _, i}
                        <button 
                            class="btn page-btn" 
                            class:active={currentPage === i + 1}
                            on:click={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
                    {/each}
                </div>
                
                <button 
                    class="btn page-btn"
                    disabled={currentPage === totalPages}
                    on:click={() => handlePageChange(currentPage + 1)}
                >
                    Siguiente
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        {/if}
    {/if}
</div>

<Cart bind:isOpen={showCart} />

<style>
    .catalog-hero {
        background: linear-gradient(rgba(44, 24, 16, 0.4), rgba(44, 24, 16, 0.4)),
                    url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338')
                    center/cover no-repeat;
        padding: 4rem 0;
        color: white;
        text-align: center;
        margin-bottom: 3rem;
    }

    .hero-description {
        font-size: 1.2rem;
        margin-top: 1rem;
        opacity: 0.9;
    }

    .filters-section {
        margin-bottom: 3rem;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
    }

    .search-box {
        flex: 1;
        min-width: 300px;
        margin-bottom: 1rem;
    }

    .search-wrapper {
        position: relative;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
    }

    .search-input {
        width: 100%;
        padding: 1.2rem 3rem;
        border: 2px solid rgba(212, 175, 55, 0.2);
        border-radius: 50px;
        font-size: 1.1rem;
        background-color: white;
        transition: all 0.3s ease;
        color: var(--color-dark);
    }

    .search-input::placeholder {
        color: #999;
        font-style: italic;
    }

    .search-input:focus {
        border-color: var(--color-gold-primary);
        box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
        outline: none;
    }

    .search-icon {
        position: absolute;
        left: 1.2rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-gold-primary);
        font-size: 1.2rem;
    }

    .clear-search {
        position: absolute;
        right: 1.2rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.3s ease;
    }

    .clear-search:hover {
        color: var(--color-gold-dark);
    }

    .filter-controls {
        display: flex;
        gap: 1.5rem;
        width: 100%;
        justify-content: center;
        margin-top: 1rem;
    }

    .select-wrapper {
        position: relative;
        min-width: 250px;
    }

    .category-icon,
    .sort-icon {
        position: absolute;
        left: 1.2rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-gold-primary);
        font-size: 1rem;
        z-index: 1;
        pointer-events: none;
    }

    .filter-select {
        width: 100%;
        padding: 1.2rem 3rem;
        border: 2px solid rgba(212, 175, 55, 0.2);
        border-radius: 50px;
        font-size: 1rem;
        background-color: white;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        color: var(--color-dark);
        transition: all 0.3s ease;
    }

    .filter-select:focus {
        border-color: var(--color-gold-primary);
        box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
        outline: none;
    }

    .select-wrapper::after {
        content: '\f107';
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        position: absolute;
        right: 1.2rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-gold-primary);
        pointer-events: none;
    }

    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .product-image {
        position: relative;
        padding-top: 100%;
    }

    .product-image img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .product-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .product-card:hover .product-overlay {
        opacity: 1;
    }

    .product-info {
        padding: 1.5rem;
    }

    .product-info h3 {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
        font-family: var(--font-heading);
    }

    .price {
        color: var(--color-gold-dark);
        font-weight: bold;
        font-size: 1.3rem;
        margin: 0.5rem 0;
    }

    .description {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 1rem;
        line-height: 1.5;
    }

    .product-specs {
        display: flex;
        gap: 1rem;
        font-size: 0.9rem;
        color: #666;
    }

    .spec {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .loading {
        text-align: center;
        padding: 4rem 0;
    }

    .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid var(--color-gold-primary);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .error {
        text-align: center;
        color: #ff4444;
        padding: 2rem;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 15px rgba(0,0,0,0.1);
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 3rem;
        margin-bottom: 3rem;
    }

    .page-numbers {
        display: flex;
        gap: 0.5rem;
    }

    .page-btn {
        min-width: 40px;
        height: 40px;
        padding: 0 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .page-btn.active {
        background: var(--color-gold-dark);
    }

    .page-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        .filters-section {
            flex-direction: column;
        }

        .search-box {
            width: 100%;
        }

        .filter-controls {
            flex-direction: column;
            gap: 1rem;
        }

        .select-wrapper {
            width: 100%;
            min-width: 0;
        }

        .search-wrapper {
            margin-bottom: 1rem;
        }

        .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
    }
</style> 