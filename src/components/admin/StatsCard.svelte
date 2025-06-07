<script lang="ts">
    export let icon: string;
    export let title: string;
    export let value: number;
    export let color: string = 'var(--color-gold-primary)';
    export let isCurrency: boolean = false;

    function formatValue(val: number): string {
        if (isCurrency) {
            return val.toLocaleString('es-CL', {
                style: 'currency',
                currency: 'CLP'
            });
        }
        return val.toLocaleString();
    }
</script>

<div class="stat-card">
    <div class="icon-wrapper" style="--color: {color}">
        <i class={icon}></i>
    </div>
    <div class="stat-info">
        <h3>{title}</h3>
        <p class="stat-number">{formatValue(value)}</p>
    </div>
</div>

<style>
    .stat-card {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1.5rem;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .icon-wrapper {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: color-mix(in srgb, var(--color) 15%, white);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon-wrapper i {
        font-size: 1.8rem;
        color: var(--color);
    }

    .stat-info h3 {
        font-size: 1rem;
        color: #666;
        margin-bottom: 0.5rem;
        font-family: var(--font-body);
    }

    .stat-number {
        font-size: 1.8rem;
        font-weight: 600;
        color: var(--color-dark);
        font-family: var(--font-heading);
    }
</style> 