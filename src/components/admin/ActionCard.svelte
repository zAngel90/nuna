<script lang="ts">
    export let href: string;
    export let icon: string;
    export let title: string;
    export let description: string;
</script>

<a {href} class="action-card">
    <div class="action-icon">
        <i class={icon}></i>
    </div>
    <div class="action-info">
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
</a>

<style>
    .action-card {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 2rem;
        text-decoration: none;
        color: inherit;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .action-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .action-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: color-mix(in srgb, var(--color-gold-primary) 15%, white);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .action-icon i {
        font-size: 1.8rem;
        color: var(--color-gold-primary);
    }

    .action-info h3 {
        font-size: 1.2rem;
        color: var(--color-dark);
        margin-bottom: 0.5rem;
        font-family: var(--font-heading);
    }

    .action-info p {
        font-size: 0.9rem;
        color: #666;
        line-height: 1.4;
    }
</style> 