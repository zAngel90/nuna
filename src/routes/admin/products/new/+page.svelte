<script lang="ts">
    import { onMount } from 'svelte';
    import type { Category } from '$lib/api';
    import { getCategories } from '$lib/api';
    import { goto } from '$app/navigation';
    import { API_BASE_URL } from '$lib/config';

    let categories: Category[] = [];
    let loading = false;
    let error = '';

    let newProduct = {
        name: '',
        price: '',
        description: '',
        images: [''],
        category_id: '',
        subcategory_id: '',
        specifications: {
            material: '',
            stone: '',
            weight: '',
            size: ''
        },
        stock: ''
    };

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

    async function handleSubmit() {
        loading = true;
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...newProduct,
                    price: parseFloat(newProduct.price),
                    stock: parseInt(newProduct.stock)
                })
            });

            if (!response.ok) {
                throw new Error('Error al crear el producto');
            }

            goto('/admin/products');
        } catch (err) {
            console.error('Error:', err);
            error = 'Error al crear el producto';
        } finally {
            loading = false;
        }
    }

    function getSubcategories(categoryId: string) {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.subcategories : [];
    }
</script>

<div class="admin-page">
    <div class="admin-header">
        <h1>Crear Nuevo Producto</h1>
    </div>

    {#if error}
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {error}
        </div>
    {/if}

    <form class="product-form" on:submit|preventDefault={handleSubmit}>
        <div class="form-grid">
            <div class="form-group">
                <label for="name">Nombre del Producto</label>
                <input type="text" id="name" bind:value={newProduct.name} required>
            </div>

            <div class="form-group">
                <label for="price">Precio</label>
                <input type="number" id="price" bind:value={newProduct.price} step="0.01" required>
            </div>

            <div class="form-group">
                <label for="category">Categoría</label>
                <select id="category" bind:value={newProduct.category_id} required>
                    <option value="">Seleccionar categoría</option>
                    {#each categories as category}
                        <option value={category.id}>{category.name}</option>
                    {/each}
                </select>
            </div>

            {#if newProduct.category_id}
                <div class="form-group">
                    <label for="subcategory">Subcategoría</label>
                    <select id="subcategory" bind:value={newProduct.subcategory_id}>
                        <option value="">Seleccionar subcategoría</option>
                        {#each getSubcategories(newProduct.category_id) as subcategory}
                            <option value={subcategory.id}>{subcategory.name}</option>
                        {/each}
                    </select>
                </div>
            {/if}

            <div class="form-group">
                <label for="stock">Stock</label>
                <input type="number" id="stock" bind:value={newProduct.stock} required>
            </div>

            <div class="form-group full-width">
                <label for="description">Descripción</label>
                <textarea id="description" bind:value={newProduct.description} required></textarea>
            </div>

            <div class="form-group">
                <label for="material">Material</label>
                <input type="text" id="material" bind:value={newProduct.specifications.material}>
            </div>

            <div class="form-group">
                <label for="stone">Piedra</label>
                <input type="text" id="stone" bind:value={newProduct.specifications.stone}>
            </div>

            <div class="form-group">
                <label for="weight">Peso</label>
                <input type="text" id="weight" bind:value={newProduct.specifications.weight}>
            </div>

            <div class="form-group">
                <label for="size">Talla</label>
                <input type="text" id="size" bind:value={newProduct.specifications.size}>
            </div>

            <div class="form-group full-width">
                <label for="image">URL de la imagen</label>
                <input type="url" id="image" bind:value={newProduct.images[0]} required>
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn save-button" disabled={loading}>
                {#if loading}
                    <i class="fas fa-spinner fa-spin"></i>
                    Guardando...
                {:else}
                    Guardar Producto
                {/if}
            </button>
            <a href="/admin/products" class="btn cancel-button">Cancelar</a>
        </div>
    </form>
</div>

<style>
    .admin-page {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .admin-header {
        margin-bottom: 2rem;
    }

    .admin-header h1 {
        font-family: var(--font-heading);
        font-size: 2.5rem;
        color: var(--color-dark);
    }

    .error-message {
        background: #ffebee;
        color: #c62828;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .product-form {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-group.full-width {
        grid-column: 1 / -1;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--color-dark);
        font-weight: 500;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: var(--font-body);
        font-size: 1rem;
    }

    .form-group textarea {
        height: 120px;
        resize: vertical;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
    }

    .save-button {
        background: var(--color-gold-primary);
        color: white;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .save-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .cancel-button {
        background: #f5f5f5;
        color: #666;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    @media (max-width: 768px) {
        .admin-page {
            padding: 1rem;
        }

        .form-grid {
            grid-template-columns: 1fr;
        }
    }
</style> 