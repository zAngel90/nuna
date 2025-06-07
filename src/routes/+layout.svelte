<script>
    import Navbar from '../components/Navbar.svelte';
    import { page } from '$app/stores';

    $: isAdminRoute = $page.url.pathname.startsWith('/admin');
</script>

{#if !isAdminRoute}
    <Navbar />
{/if}

<main class:admin={isAdminRoute}>
    <slot />
</main>

<style>
    :global(:root) {
        --color-gold-primary: #D4AF37;
        --color-gold-light: #FFD700;
        --color-gold-dark: #B8860B;
        --color-cream: #FFF8E7;
        --color-dark: #2C1810;
        --font-heading: 'Cormorant Garamond', serif;
        --font-body: 'Montserrat', sans-serif;
    }

    :global(body) {
        margin: 0;
        padding: 0;
        font-family: var(--font-body);
        background-color: var(--color-cream);
        color: var(--color-dark);
    }

    :global(h1, h2, h3, h4, h5, h6) {
        font-family: var(--font-heading);
        font-weight: 400;
        margin: 0;
    }

    main {
        padding-top: 80px; /* Espacio para la navbar fija */
        min-height: calc(100vh - 80px);
    }

    main.admin {
        padding-top: 0; /* Sin padding para rutas admin ya que tienen su propia navbar */
        min-height: 100vh;
    }

    :global(.container) {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    :global(.btn) {
        display: inline-block;
        padding: 0.8rem 1.5rem;
        background: var(--color-gold-primary);
        color: white;
        border: none;
        border-radius: 4px;
        font-family: var(--font-body);
        font-size: 0.9rem;
        cursor: pointer;
        transition: background 0.3s, transform 0.3s;
        text-decoration: none;
        text-align: center;
    }

    :global(.btn:hover) {
        background: var(--color-gold-dark);
        transform: translateY(-2px);
    }

    :global(.section-title) {
        font-size: 2.5rem;
        text-align: center;
        margin-bottom: 2rem;
        color: var(--color-dark);
    }

    :global(.card) {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 15px rgba(0,0,0,0.1);
        transition: transform 0.3s, box-shadow 0.3s;
    }

    :global(.card:hover) {
        transform: translateY(-5px);
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
    }
</style> 