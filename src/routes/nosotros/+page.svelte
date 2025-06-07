<script>
    import Navbar from '../../components/Navbar.svelte';
</script>

<div class="nosotros-container">
    <div class="hero-nosotros">
        <h1>Sobre Nosotros</h1>
        <p>Joyería artesanal de calidad</p>
    </div>

    <section class="local-info">
        <div class="content-wrapper">
            <div class="info-text">
                <h2>Nuestra Joyería</h2>
                <p>Somos una joyería especializada en piezas artesanales de alta calidad. Cada joya es creada con dedicación y atención al detalle, utilizando los mejores materiales para garantizar piezas únicas y duraderas.</p>
            </div>
            <div class="contact-info">
                <h3>Visítanos</h3>
                <div class="contact-details">
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <p>Calle Principal 123, Ciudad</p>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <p>Lunes a Viernes: 9:00 - 18:00<br>Sábado: 10:00 - 14:00</p>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <p>+56 9 1234 5678</p>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-envelope"></i>
                        <p>contacto@joyeria.com</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

<style>
    .nosotros-container {
        font-family: 'Montserrat', sans-serif;
    }

    .hero-nosotros {
        height: 40vh;
        background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
                    url('https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d') center/cover;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        text-align: center;
        padding: 2rem;
    }

    .hero-nosotros h1 {
        font-family: 'Cormorant Garamond', serif;
        font-size: 3.5rem;
        margin-bottom: 1rem;
    }

    .hero-nosotros p {
        font-size: 1.2rem;
    }

    .local-info {
        padding: 4rem 2rem;
        background: white;
    }

    .content-wrapper {
        max-width: 1000px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr;
        gap: 3rem;
    }

    .info-text h2 {
        font-family: 'Cormorant Garamond', serif;
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
        color: #333;
    }

    .info-text p {
        line-height: 1.8;
        color: #666;
        font-size: 1.1rem;
    }

    .contact-info {
        background: #f9f9f9;
        padding: 2rem;
        border-radius: 10px;
    }

    .contact-info h3 {
        font-family: 'Cormorant Garamond', serif;
        font-size: 2rem;
        margin-bottom: 1.5rem;
        color: #333;
        text-align: center;
    }

    .contact-details {
        display: grid;
        gap: 1.5rem;
    }

    .detail-item {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .detail-item i {
        font-size: 1.5rem;
        color: var(--color-gold-primary);
        width: 30px;
    }

    .detail-item p {
        margin: 0;
        color: #666;
        line-height: 1.5;
    }

    @media (max-width: 768px) {
        .hero-nosotros h1 {
            font-size: 2.5rem;
        }

        .content-wrapper {
            grid-template-columns: 1fr;
        }

        .local-info {
            padding: 3rem 1.5rem;
        }
    }
</style> 