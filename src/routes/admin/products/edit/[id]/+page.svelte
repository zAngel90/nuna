<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import type { Product, Category } from '$lib/api';
    import { API_BASE_URL } from '$lib/config';

    const productId = $page.params.id;
    let loading = true;
    let saving = false;
    let error = '';
    let categories: Category[] = [];
    let product: any = null;

    onMount(async () => {
        try {
            const [productRes, categoriesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/products/${productId}`),
                fetch(`${API_BASE_URL}/categories`)
            ]);

            if (!productRes.ok || !categoriesRes.ok) {
                throw new Error('Error al cargar los datos');
            }

            const productData = await productRes.json();
            const categoriesData = await categoriesRes.json();

            if (!productData.data) {
                throw new Error('Producto no encontrado');
            }

            categories = categoriesData.data || [];
            
            // Asignar los datos del producto
            product = {
                name: productData.data.name || '',
                price: productData.data.price?.toString() || '',
                description: productData.data.description || '',
                images: productData.data.images || [''],
                category_id: productData.data.category_id || '',
                subcategory_id: productData.data.subcategory_id || '',
                specifications: {
                    material: productData.data.specifications?.material || '',
                    stone: productData.data.specifications?.stone || '',
                    weight: productData.data.specifications?.weight || '',
                    size: productData.data.specifications?.size || ''
                },
                stock: productData.data.stock?.toString() || ''
            };
        } catch (err) {
            console.error('Error:', err);
            error = err instanceof Error ? err.message : 'Error al cargar el producto';
        } finally {
            loading = false;
        }
    });

    function getSubcategories(categoryId: string) {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.subcategories : [];
    }

    async function handleSubmit() {
        saving = true;
        error = '';

        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...product,
                    price: parseFloat(product.price),
                    stock: parseInt(product.stock)
                })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el producto');
            }

            goto('/admin/products');
        } catch (err) {
            console.error('Error:', err);
            error = err instanceof Error ? err.message : 'Error al actualizar el producto';
        } finally {
            saving = false;
        }
    }
</script>

<div class="admin-page">
    <div class="admin-header">
        <h1>Editar Producto</h1>
    </div>

    {#if error}
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {error}
        </div>
    {/if}

    {#if loading}
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando producto...</p>
        </div>
    {:else if !product}
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>No se pudo cargar el producto</p>
        </div>
    {:else}
        <form class="product-form" on:submit|preventDefault={handleSubmit}>
            <div class="form-grid">
                <div class="form-group">
                    <label for="name">Nombre del Producto</label>
                    <input type="text" id="name" bind:value={product.name} required>
                </div>

                <div class="form-group">
                    <label for="price">Precio</label>
                    <input type="number" id="price" bind:value={product.price} step="0.01" required>
                </div>

                <div class="form-group">
                    <label for="category">Categoría</label>
                    <select id="category" bind:value={product.category_id} required>
                        <option value="">Seleccionar categoría</option>
                        {#each categories as category}
                            <option value={category.id}>{category.name}</option>
                        {/each}
                    </select>
                </div>

                {#if product.category_id}
                    <div class="form-group">
                        <label for="subcategory">Subcategoría</label>
                        <select id="subcategory" bind:value={product.subcategory_id}>
                            <option value="">Seleccionar subcategoría</option>
                            {#each getSubcategories(product.category_id) as subcategory}
                                <option value={subcategory.id}>{subcategory.name}</option>
                            {/each}
                        </select>
                    </div>
                {/if}

                <div class="form-group">
                    <label for="stock">Stock</label>
                    <input type="number" id="stock" bind:value={product.stock} required>
                </div>

                <div class="form-group full-width">
                    <label for="description">Descripción</label>
                    <textarea id="description" bind:value={product.description} required></textarea>
                </div>

                <div class="form-group">
                    <label for="material">Material</label>
                    <input type="text" id="material" bind:value={product.specifications.material}>
                </div>

                <div class="form-group">
                    <label for="stone">Piedra</label>
                    <input type="text" id="stone" bind:value={product.specifications.stone}>
                </div>

                <div class="form-group">
                    <label for="weight">Peso</label>
                    <input type="text" id="weight" bind:value={product.specifications.weight}>
                </div>

                <div class="form-group">
                    <label for="size">Talla</label>
                    <input type="text" id="size" bind:value={product.specifications.size}>
                </div>

                <div class="form-group full-width">
                    <label for="image">URL de la imagen</label>
                    <input type="url" id="image" bind:value={product.images[0]} required>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn save-button" disabled={saving}>
                    {#if saving}
                        <i class="fas fa-spinner fa-spin"></i>
                        Guardando...
                    {:else}
                        Guardar Cambios
                    {/if}
                </button>
                <a href="/admin/products" class="btn cancel-button">Cancelar</a>
            </div>
        </form>
    {/if}
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

    .loading {
        text-align: center;
        padding: 4rem;
    }

    .loading i {
        font-size: 2rem;
        color: var(--color-gold-primary);
        margin-bottom: 1rem;
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

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--color-dark);
        font-weight: 500;
    }

    input, select, textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        background: white;
    }

    textarea {
        height: 150px;
        resize: vertical;
    }

    input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: var(--color-gold-primary);
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        transition: opacity 0.2s;
    }

    .save-button {
        background: var(--color-gold-primary);
        color: white;
    }

    .cancel-button {
        background: #6c757d;
        color: white;
    }

    .btn:hover {
        opacity: 0.9;
    }

    .btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        .admin-page {
            padding: 1rem;
        }

        .form-actions {
            flex-direction: column;
        }

        .btn {
            width: 100%;
            justify-content: center;
        }
    }
</style> 