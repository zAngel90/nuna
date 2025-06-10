{#if loading}
    <div class="loading">Loading...</div>
{:else}
<main>
    <section class="hero">
        <div class="hero-slider" style="--slide: {currentSlide}">
            {#each homeConfig.carousel as slide, index}
                <div class="slide" style="--index: {index}">
                    <div class="slide-image" style="background-image: url({slide.image})"></div>
                    <div class="slide-content">
                        <div class="content-wrapper">
                            <span class="pre-title">{slide.preTitle}</span>
                            <h1>{slide.title}</h1>
                            <p>{slide.description}</p>
                            {#if slide.primaryCta || slide.secondaryCta}
                                <div class="cta-group">
                                    {#if slide.primaryCta}
                                        <a href={slide.primaryCta.link} class="cta-button primary">
                                            <span>{slide.primaryCta.text}</span>
                                            <i class="fas fa-arrow-right"></i>
                                        </a>
                                    {/if}
                                    {#if slide.secondaryCta}
                                        <a href={slide.secondaryCta.link} class="cta-button secondary">
                                            {slide.secondaryCta.text}
                                        </a>
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
        <div class="slider-controls">
            <button 
                class="slider-arrow prev"
                on:click={() => {
                    currentSlide = (currentSlide - 1 + homeConfig.carousel.length) % homeConfig.carousel.length;
                }}
                aria-label="Previous slide"
            >
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="slider-dots">
                {#each homeConfig.carousel as _, index}
                    <button 
                        class="slider-dot" 
                        class:active={currentSlide === index}
                        on:click={() => currentSlide = index}
                        aria-label="Go to slide {index + 1}"
                    ></button>
                {/each}
            </div>
            <button 
                class="slider-arrow next"
                on:click={() => {
                    currentSlide = (currentSlide + 1) % homeConfig.carousel.length;
                }}
                aria-label="Next slide"
            >
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </section>

    <section class="featured">
        <div class="container">
            <h2 class="section-title">Piezas Destacadas</h2>
            <div class="featured-grid">
                {#each homeConfig.featuredProducts as product}
                    <div class="featured-card">
                        <div class="card-image">
                            <img src={product.images[0]} alt={product.name} loading="lazy" />
                            <div class="card-overlay">
                                <button class="add-to-cart" on:click={() => addToCart(product)} aria-label="Agregar al carrito">
                                    <i class="fas fa-shopping-cart"></i>
                                </button>
                                <a href="/catalogo/{product.slug}" class="view-details">Ver Detalles</a>
                            </div>
                        </div>
                        <div class="card-content">
                            <h3>{product.name}</h3>
                            <p class="price">${product.price.toFixed(2)}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <section class="categories">
        <div class="container">
            <h2 class="section-title">Nuestras Categorías</h2>
            <div class="categories-grid">
                {#each homeConfig.featuredCategories.sort((a, b) => a.order - b.order) as category}
                    <a href={category.link} class="category-card">
                    <div class="category-image">
                            <img src={category.image} alt={category.name} />
                    </div>
                        <h3>{category.name}</h3>
                </a>
                {/each}
            </div>
        </div>
    </section>
</main>
{/if}

<script lang="ts">
    import { onMount } from 'svelte';
    import { getFeaturedProducts } from '$lib/api';
    import type { Product } from '$lib/types';
    import { cart } from '$lib/stores/cart';
    import { API_BASE_URL } from '$lib/config';

    let currentSlide = 0;
    let loading = true;
    let error = '';
    let showCart = false;
    let homeConfig: {
        carousel: {
            image: string;
            preTitle: string;
            title: string;
            description: string;
            primaryCta?: {
                text: string;
                link: string;
            };
            secondaryCta?: {
                text: string;
                link: string;
            };
        }[];
        hero: {
            image: string;
            preTitle: string;
            title: string;
            description: string;
            primaryCta: {
                text: string;
                link: string;
            };
            secondaryCta: {
                text: string;
                link: string;
            };
        };
        featuredProducts: Product[];
        featuredCategories: {
            name: string;
            image: string;
            link: string;
            order: number;
        }[];
    } = {
        carousel: [],
        hero: {
            image: '',
            preTitle: '',
            title: '',
            description: '',
            primaryCta: {
                text: '',
                link: ''
            },
            secondaryCta: {
                text: '',
                link: ''
            }
        },
        featuredProducts: [],
        featuredCategories: []
    };

    onMount(async () => {
        try {
            // Cargar configuración del home
            const homeResponse = await fetch(`${API_BASE_URL}/home`, {
                credentials: 'include'
            });
            homeConfig = await homeResponse.json();
        } catch (error) {
            console.error('Error loading home data:', error);
        } finally {
            loading = false;
            startSlideshow();
        }
    });

    function startSlideshow() {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % homeConfig.carousel.length;
        }, 5000);
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
</script>

<svelte:head>
    <title>LM Joyas - Joyería Artesanal de Lujo</title>
</svelte:head>

<style>
    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        font-size: 1.5rem;
        color: var(--color-gold-primary);
    }

    :root {
        --color-gold-primary: #D4AF37;
        --color-gold-light: #FFD700;
        --color-gold-dark: #B8860B;
        --color-cream: #FFF8E7;
        --color-dark: #2C1810;
        --section-spacing: 6rem;
        --card-border-radius: 12px;
    }

    main {
        background-color: transparent;
    }

    .hero {
        height: calc(100vh - 80px);
        position: relative;
        overflow: hidden;
        margin-bottom: var(--section-spacing);
        width: 100vw;
        margin-left: calc(-50vw + 50%);
        margin-right: calc(-50vw + 50%);
    }

    .hero-slider {
        height: 100%;
        width: 300%;
        display: flex;
        transition: transform 1s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform: translateX(calc(var(--slide) * -33.333%));
    }

    .slide {
        height: 100%;
        width: 33.333%;
        position: relative;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .slide-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    .slide-image::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.3) 0%,
            rgba(0,0,0,0.6) 100%
        );
    }

    .slide-content {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 10%;
        z-index: 2;
    }

    .content-wrapper {
        max-width: 800px;
        color: white;
    }

    .pre-title {
        font-family: var(--font-body);
        font-size: 1.2rem;
        text-transform: uppercase;
        letter-spacing: 4px;
        color: var(--color-gold-primary);
        margin-bottom: 1rem;
        display: block;
    }

    .slide-content h1 {
        font-size: 5rem;
        font-family: var(--font-heading);
        margin-bottom: 1.5rem;
        line-height: 1.1;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }

    .slide-content p {
        font-size: 1.5rem;
        margin-bottom: 2rem;
        max-width: 600px;
        line-height: 1.6;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    }

    .cta-group {
        display: flex;
        gap: 1rem;
    }

    .cta-button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
        font-size: 1.1rem;
        text-decoration: none;
        border-radius: 50px;
        transition: all 0.3s ease;
        font-family: var(--font-body);
    }

    .cta-button.primary {
        background: var(--color-dark);
        color: var(--color-light);
        border: 2px solid var(--color-dark);
    }

    .cta-button.primary:hover {
        background: #333333;
        border-color: #333333;
        transform: translateY(-2px);
    }

    .cta-button.secondary {
        background: transparent;
        color: white;
        border: 2px solid white;
    }

    .cta-button.secondary:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }

    .slider-controls {
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 1rem;
        z-index: 10;
    }

    .slider-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        background: transparent;
        cursor: pointer;
        padding: 0;
        transition: all 0.3s ease;
    }

    .slider-dot.active {
        background: var(--color-gold-primary);
        border-color: var(--color-gold-primary);
        transform: scale(1.2);
    }

    .slider-arrow {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .slider-arrow:hover {
        background: var(--color-gold-primary);
    }

    @media (max-width: 768px) {
        .hero {
            height: 80vh;
            margin-left: -1rem;
            margin-right: -1rem;
            width: calc(100% + 2rem);
        }

        .slide-content {
            padding: 0 1.5rem;
            text-align: center;
            align-items: center;
            justify-content: center;
        }

        .content-wrapper {
            width: 100%;
            padding: 0 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .slide-content h1 {
            font-size: 2.5rem;
            margin-bottom: 0.8rem;
        }

        .slide-content p {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
            max-width: 100%;
        }

        .pre-title {
            font-size: 1rem;
            letter-spacing: 2px;
            margin-bottom: 0.8rem;
        }

        .cta-group {
            width: 100%;
            max-width: 300px;
        }
    }

    @media (max-width: 480px) {
        .hero {
            height: 70vh;
            margin-left: -0.5rem;
            margin-right: -0.5rem;
            width: calc(100% + 1rem);
        }

        .slide-content {
            padding: 0 1rem;
        }

        .content-wrapper {
            padding: 0 0.5rem;
        }

        .slide-content h1 {
            font-size: 2rem;
            margin-bottom: 0.6rem;
        }

        .pre-title {
            font-size: 0.9rem;
            letter-spacing: 1px;
            margin-bottom: 0.6rem;
        }

        .slide-content p {
            font-size: 1rem;
            margin-bottom: 1.2rem;
            line-height: 1.4;
        }

        .cta-button {
            padding: 0.8rem 1.5rem;
            font-size: 0.9rem;
        }

        .cta-group {
            gap: 0.6rem;
            max-width: 250px;
        }
    }

    .featured {
        padding: var(--section-spacing) 0;
        background: linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.1));
        position: relative;
    }

    .featured::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(to right, transparent, var(--color-gold-primary), transparent);
    }

    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    .section-title {
        font-family: var(--font-heading);
        font-size: 2.5rem;
        color: var(--color-dark);
        text-align: center;
        margin-bottom: 3rem;
        position: relative;
    }

    .section-title::after {
        content: '';
        display: block;
        width: 80px;
        height: 3px;
        background: var(--color-gold-primary);
        margin: 1rem auto 0;
    }

    .featured-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2.5rem;
        padding: 1rem;
    }

    .featured-card {
        background: white;
        border-radius: var(--card-border-radius);
        overflow: hidden;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .featured-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }

    .card-image {
        position: relative;
        padding-top: 100%;
        overflow: hidden;
    }

    .card-image img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .featured-card:hover .card-image img {
        transform: scale(1.1);
    }

    .card-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(44, 24, 16, 0.4);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(3px);
    }

    .featured-card:hover .card-overlay {
        opacity: 1;
    }

    .add-to-cart {
        background: var(--color-gold-primary);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .add-to-cart:hover {
        background: var(--color-gold-dark);
        transform: scale(1.1);
    }

    .view-details {
        color: white;
        text-decoration: none;
        font-weight: 600;
        padding: 0.8rem 1.5rem;
        border-radius: 25px;
        border: 2px solid white;
        transition: all 0.3s ease;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .view-details:hover {
        background: white;
        color: var(--color-dark);
    }

    .card-content {
        padding: 1.5rem;
        text-align: center;
        background: white;
    }

    .card-content h3 {
        margin: 0;
        color: var(--color-dark);
        font-size: 1.2rem;
        font-weight: 600;
    }

    .price {
        color: var(--color-gold-primary);
        font-weight: 600;
        margin: 0.5rem 0 0;
        font-size: 1.1rem;
    }

    .categories {
        padding: var(--section-spacing) 0;
        background: white;
        position: relative;
        z-index: 1;
    }

    .categories::before {
        content: '';
        position: absolute;
        top: -50px;
        left: 0;
        right: 0;
        height: 50px;
        background: linear-gradient(to bottom right, transparent 49.9%, white 50%);
    }

    .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2.5rem;
        padding: 1rem;
    }

    .category-card {
        text-decoration: none;
        color: var(--color-dark);
        text-align: center;
        transition: transform 0.3s ease;
        position: relative;
        padding: 1rem;
        border-radius: var(--card-border-radius);
        background: white;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    }

    .category-card:hover {
        transform: translateY(-10px);
    }

    .category-image {
        position: relative;
        padding-top: 100%;
        border-radius: var(--card-border-radius);
        overflow: hidden;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .category-image img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .category-card:hover .category-image img {
        transform: scale(1.1);
    }

    .category-card h3 {
        margin: 1.5rem 0 0;
        font-size: 1.3rem;
        color: var(--color-dark);
        font-weight: 600;
        position: relative;
        padding-bottom: 1rem;
    }

    .category-card h3::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 2px;
        background: var(--color-gold-primary);
    }
</style>
