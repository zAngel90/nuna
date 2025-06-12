<script lang="ts">
    import { onMount } from 'svelte';
    import { toast } from '@zerodevx/svelte-toast';
    import Navbar from '../../../components/Navbar.svelte';
    import { API_BASE_URL } from '$lib/config';

    interface StoreSettings {
        storeName: string;
        storeDescription: string;
        contactEmail: string;
        phoneNumber: string;
        address: string;
        socialMedia: {
            facebook: string;
            instagram: string;
            whatsapp: string;
        };
        shippingInfo: {
            freeShippingThreshold: number;
            baseShippingCost: number;
        };
    }

    let settings: StoreSettings = {
        storeName: 'Laura Mery Joyas',
        storeDescription: 'Joyería fina y elegante para cada ocasión',
        contactEmail: '',
        phoneNumber: '',
        address: '',
        socialMedia: {
            facebook: '',
            instagram: '',
            whatsapp: ''
        },
        shippingInfo: {
            freeShippingThreshold: 0,
            baseShippingCost: 0
        }
    };

    let loading = true;
    let saving = false;
    let message = '';

    onMount(async () => {
        try {
            const fetchOptions = {
                mode: 'cors',
                credentials: 'include',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await fetch(`${API_BASE_URL}/config`, fetchOptions);
            settings = await response.json();
        } catch (error) {
            console.error('Error loading configuration:', error);
            toast.push('Error al cargar la configuración', {
                theme: {
                    '--toastBackground': '#F56565',
                    '--toastBarBackground': '#C53030'
                }
            });
        } finally {
            loading = false;
        }
    });

    async function handleSubmit() {
        saving = true;
        message = '';

        try {
            const fetchOptions = {
                mode: 'cors',
                credentials: 'include',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            };

            const response = await fetch(`${API_BASE_URL}/config`, {
                ...fetchOptions,
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                toast.push('Configuración actualizada correctamente', {
                    theme: {
                        '--toastBackground': '#48BB78',
                        '--toastBarBackground': '#2F855A'
                    }
                });
            } else {
                message = 'Error al guardar la configuración';
            }
        } catch (error) {
            console.error('Error saving configuration:', error);
            toast.push('Error al guardar la configuración', {
                theme: {
                    '--toastBackground': '#F56565',
                    '--toastBarBackground': '#C53030'
                }
            });
            message = 'Error al guardar la configuración';
        } finally {
            saving = false;
        }
    }
</script>

<Navbar />

<div class="container">
    <h1>Configuración General</h1>

    {#if loading}
        <div class="loading">Cargando...</div>
    {:else}
        <section class="section">
            <h2>Configuración de Envíos</h2>
            <div class="shipping-config-editor">
                <div class="form-group">
                    <label for="baseShippingCost">Costo Base de Envío (CLP)</label>
                    <input
                        type="number"
                        id="baseShippingCost"
                        bind:value={settings.shippingInfo.baseShippingCost}
                        min="0"
                        placeholder="Ingrese el costo base de envío"
                    />
                </div>
                <div class="form-group">
                    <label for="freeShippingThreshold">Monto Mínimo para Envío Gratis (CLP)</label>
                    <input
                        type="number"
                        id="freeShippingThreshold"
                        bind:value={settings.shippingInfo.freeShippingThreshold}
                        min="0"
                        placeholder="Ingrese el monto mínimo para envío gratis"
                    />
                    <small class="help-text">Los pedidos que superen este monto tendrán envío gratis</small>
                </div>
                <div class="button-container">
                    <button class="save-button" on:click={handleSubmit} disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                </div>
            </div>
        </section>
    {/if}
</div>

<style>
    .container {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }

    h1 {
        font-size: 2rem;
        margin-bottom: 2rem;
        color: var(--color-dark);
    }

    .section {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        color: var(--color-dark);
    }

    .loading {
        text-align: center;
        padding: 2rem;
        font-size: 1.2rem;
        color: var(--color-dark);
    }

    .shipping-config-editor {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 1.5rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--color-dark);
        font-weight: 500;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.2s;
    }

    input:focus {
        outline: none;
        border-color: var(--color-gold-primary);
    }

    .help-text {
        display: block;
        margin-top: 0.5rem;
        color: #666;
        font-size: 0.875rem;
    }

    .button-container {
        margin-top: 2rem;
    }

    .save-button {
        background: var(--color-gold-primary);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.2s;
        width: 100%;
    }

    .save-button:hover:not(:disabled) {
        background: var(--color-gold-secondary);
    }

    .save-button:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
</style> 