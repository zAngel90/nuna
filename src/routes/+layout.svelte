<script>
    import Navbar from '../components/Navbar.svelte';
</script>

<Navbar />

<main>
    <slot />
</main>

<style>
    :global(:root) {
        --color-gold-primary: #D4AF37;
        --color-gold-light: #FFD700;
        --color-gold-dark: #B8860B;
        --color-dark: #000000;
        --color-light: #FFFFFF;
        --font-heading: 'Cormorant Garamond', serif;
        --font-body: 'Montserrat', sans-serif;
    }

    :global(body) {
        margin: 0;
        padding: 0;
        font-family: var(--font-body);
        background-color: var(--color-light);
        color: var(--color-dark);
        overflow-x: hidden; /* Prevenir scroll horizontal */
        width: 100%;
    }

    :global(html) {
        overflow-x: hidden;
        width: 100%;
    }

    :global(h1, h2, h3, h4, h5, h6) {
        font-family: var(--font-heading);
        font-weight: 400;
        margin: 0;
    }

    main {
        padding-top: 80px; /* Espacio para la navbar fija */
        min-height: calc(100vh - 80px);
        width: 100%;
        overflow-x: hidden;
    }

    :global(.container) {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    @media (max-width: 768px) {
        :global(.container) {
            padding: 0 1rem;
        }

        :global(.section-title) {
            font-size: 2rem;
            margin-bottom: 1.5rem;
        }

        main {
            padding-top: 60px;
        }
    }

    @media (max-width: 480px) {
        :global(.btn) {
            padding: 0.6rem 1.2rem;
            font-size: 0.85rem;
        }

        :global(.section-title) {
            font-size: 1.8rem;
        }
    }

    :global(.btn) {
        display: inline-block;
        padding: 0.8rem 1.5rem;
        background: var(--color-dark);
        color: var(--color-light);
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
        background: #333333;
        transform: translateY(-2px);
    }

    :global(.section-title) {
        font-size: 2.5rem;
        text-align: center;
        margin-bottom: 2rem;
        color: var(--color-dark);
    }

    :global(.card) {
        background: var(--color-light);
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