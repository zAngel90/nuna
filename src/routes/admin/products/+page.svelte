<script lang="ts">
    import { onMount } from 'svelte';
    import type { Product, Category } from '$lib/api';
    import { getProducts, getCategories } from '$lib/api';
    import { API_BASE_URL } from '$lib/config';
    import { goto } from '$app/navigation';

    let products: Product[] = [];
    let categories: Category[] = [];
    let loading = true;
    let error = '';
    let editingProduct: Product | null = null;
    let showForm = false;
    let showDetailsModal = false;
    let selectedProduct: Product | null = null;

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
            }
        } catch (err) {
            error = 'Error al cargar los datos';
            console.error('Error en onMount:', err);
        } finally {
            loading = false;
        }
    });

    async function handleSubmit() {
        try {
            const url = editingProduct 
                ? `${API_BASE_URL}/products/${editingProduct.id}`
                : `${API_BASE_URL}/products`;
            
            const method = editingProduct ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            if (!response.ok) {
                throw new Error('Error al guardar el producto');
            }

            const result = await response.json();
            
            if (editingProduct) {
                products = products.map(p => p.id === result.data.id ? result.data : p);
            } else {
                products = [...products, result.data];
            }
            
            resetForm();
        } catch (err) {
            console.error('Error:', err);
            error = 'Error al guardar el producto';
        }
    }

    async function deleteProduct(id: string) {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }

            products = products.filter(p => p.id !== id);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el producto');
        }
    }

    function editProduct(product: Product) {
        goto(`/admin/products/edit/${product.id}`);
    }

    function resetForm() {
        editingProduct = null;
        newProduct = {
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
        showForm = false;
    }

    function getSubcategories(categoryId: string) {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.subcategories : [];
    }

    function viewProduct(product: Product) {
        selectedProduct = product;
        showDetailsModal = true;
    }
</script>

{#if loading}
    <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Cargando productos...</p>
    </div>
{:else}
    <div class="admin-products">
        <div class="admin-header">
            <h1>Gestión de Productos</h1>
            <a href="/admin/products/new" class="btn create-button">
                <i class="fas fa-plus"></i>
                Crear Nuevo Producto
            </a>
        </div>

        {#if error}
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                {error}
            </div>
        {/if}

        {#if products.length === 0}
            <div class="no-products">
                <p>No hay productos registrados</p>
                <a href="/admin/products/new" class="btn create-button">Crear el primer producto</a>
            </div>
        {:else}
            <div class="products-table">
                <table>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each products as product}
                            <tr>
                                <td class="product-image">
                                    <img src={product.images[0]} alt={product.name} loading="lazy">
                                </td>
                                <td>{product.name}</td>
                                <td>${product.price.toLocaleString()}</td>
                                <td>{product.stock}</td>
                                <td>
                                    {categories.find(c => c.id === product.category_id)?.name || 'Sin categoría'}
                                </td>
                                <td class="actions">
                                    <button 
                                        class="btn view-btn" 
                                        on:click={() => viewProduct(product)}
                                        title="Ver detalles"
                                    >
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button 
                                        class="btn edit-btn" 
                                        on:click={() => editProduct(product)}
                                        title="Editar"
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button 
                                        class="btn delete-btn" 
                                        on:click={() => deleteProduct(product.id)}
                                        title="Eliminar"
                                    >
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
{/if}

{#if showDetailsModal && selectedProduct}
    <div class="modal-overlay" on:click={() => showDetailsModal = false}>
        <div class="modal-content" on:click|stopPropagation>
            <button class="close-btn" on:click={() => showDetailsModal = false}>
                <i class="fas fa-times"></i>
            </button>
            
            <h2>{selectedProduct.name}</h2>
            
            <div class="product-details">
                <div class="product-images">
                    {#each selectedProduct.images as image}
                        <img src={image} alt={selectedProduct.name} />
                    {/each}
                </div>
                
                <div class="detail-section">
                    <h3>Información General</h3>
                    <p><strong>Precio:</strong> ${selectedProduct.price.toLocaleString()}</p>
                    <p><strong>Stock:</strong> {selectedProduct.stock} unidades</p>
                    <p><strong>Categoría:</strong> {categories.find(c => c.id === selectedProduct.category_id)?.name || 'Sin categoría'}</p>
                    {#if selectedProduct.subcategory_id}
                        <p><strong>Subcategoría:</strong> {getSubcategories(selectedProduct.category_id).find(s => s.id === selectedProduct.subcategory_id)?.name || 'Sin subcategoría'}</p>
                    {/if}
                </div>
                
                <div class="detail-section">
                    <h3>Descripción</h3>
                    <p>{selectedProduct.description}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Especificaciones</h3>
                    <p><strong>Material:</strong> {selectedProduct.specifications.material || 'No especificado'}</p>
                    <p><strong>Piedra:</strong> {selectedProduct.specifications.stone || 'No especificado'}</p>
                    <p><strong>Peso:</strong> {selectedProduct.specifications.weight || 'No especificado'}</p>
                    <p><strong>Talla:</strong> {selectedProduct.specifications.size || 'No especificado'}</p>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .admin-products {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .admin-header h1 {
        font-family: var(--font-heading);
        font-size: 2.5rem;
        color: var(--color-dark);
    }

    .create-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--color-gold-primary);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        text-decoration: none;
        transition: opacity 0.2s;
    }

    .create-button:hover {
        opacity: 0.9;
    }

    .products-table {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
    }

    th {
        background: var(--color-gold-primary);
        color: white;
        font-weight: 500;
    }

    .product-image {
        width: 80px;
    }

    .product-image img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
    }

    .actions {
        display: flex;
        gap: 0.5rem;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: opacity 0.2s;
    }

    .view-btn {
        background: var(--color-gold-primary);
        color: white;
    }

    .edit-btn {
        background: #2196f3;
        color: white;
    }

    .delete-btn {
        background: #f44336;
        color: white;
    }

    .btn:hover {
        opacity: 0.9;
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

    .no-products {
        text-align: center;
        padding: 4rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .no-products p {
        margin-bottom: 1.5rem;
        color: #666;
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

    @media (max-width: 768px) {
        .admin-products {
            padding: 1rem;
        }

        .admin-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }

        table {
            display: block;
            overflow-x: auto;
        }
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    }

    .close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #666;
        cursor: pointer;
    }

    .product-details {
        margin-top: 2rem;
    }

    .product-images {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        overflow-x: auto;
        padding-bottom: 1rem;
    }

    .product-images img {
        width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: 8px;
    }

    .detail-section {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
    }

    .detail-section:last-child {
        border-bottom: none;
    }

    .detail-section h3 {
        color: var(--color-dark);
        margin-bottom: 1rem;
    }

    .detail-section p {
        margin: 0.5rem 0;
        color: #666;
    }

    .detail-section strong {
        color: var(--color-dark);
    }
</style> 