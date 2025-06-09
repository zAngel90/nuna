<script lang="ts">
    import { goto } from '$app/navigation';
    import { API_BASE_URL } from '$lib/config';

    interface Subcategory {
        name: string;
        description: string;
        slug?: string;
    }

    interface Category {
        name: string;
        description: string;
        image: string;
        subcategories: Subcategory[];
    }

    let loading = false;
    let error = '';

    let newCategory: Category = {
        name: '',
        description: '',
        image: '',
        subcategories: []
    };

    let newSubcategory: Subcategory = {
        name: '',
        description: ''
    };

    async function handleSubmit() {
        loading = true;
        try {
            const response = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCategory)
            });

            if (!response.ok) {
                throw new Error('Error al crear la categoría');
            }

            goto('/admin/categories');
        } catch (err) {
            console.error('Error:', err);
            error = 'Error al crear la categoría';
        } finally {
            loading = false;
        }
    }

    function addSubcategory() {
        if (newSubcategory.name.trim()) {
            newCategory.subcategories = [
                ...newCategory.subcategories,
                {
                    ...newSubcategory,
                    slug: newSubcategory.name.toLowerCase().replace(/\s+/g, '-')
                }
            ];
            newSubcategory = {
                name: '',
                description: ''
            };
        }
    }

    function removeSubcategory(index: number) {
        newCategory.subcategories = newCategory.subcategories.filter((_, i) => i !== index);
    }
</script>

<div class="admin-page">
    <div class="admin-header">
        <h1>Crear Nueva Categoría</h1>
    </div>

    {#if error}
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {error}
        </div>
    {/if}

    <form class="category-form" on:submit|preventDefault={handleSubmit}>
        <div class="form-grid">
            <div class="form-group">
                <label for="name">Nombre de la Categoría</label>
                <input type="text" id="name" bind:value={newCategory.name} required>
            </div>

            <div class="form-group full-width">
                <label for="description">Descripción</label>
                <textarea id="description" bind:value={newCategory.description} required></textarea>
            </div>

            <div class="form-group full-width">
                <label for="image">URL de la imagen</label>
                <input type="url" id="image" bind:value={newCategory.image} required>
            </div>

            <div class="form-group full-width">
                <h3>Subcategorías</h3>
                <div class="subcategory-form">
                    <input 
                        type="text" 
                        placeholder="Nombre de la subcategoría"
                        bind:value={newSubcategory.name}
                    >
                    <input 
                        type="text" 
                        placeholder="Descripción"
                        bind:value={newSubcategory.description}
                    >
                    <button type="button" class="btn add-subcategory" on:click={addSubcategory}>
                        <i class="fas fa-plus"></i>
                        Añadir
                    </button>
                </div>

                <div class="subcategories-list">
                    {#each newCategory.subcategories as subcategory, index}
                        <div class="subcategory-item">
                            <div class="subcategory-info">
                                <strong>{subcategory.name}</strong>
                                {#if subcategory.description}
                                    <p>{subcategory.description}</p>
                                {/if}
                            </div>
                            <button 
                                type="button" 
                                class="btn remove-subcategory"
                                on:click={() => removeSubcategory(index)}
                            >
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn save-button" disabled={loading}>
                {#if loading}
                    <i class="fas fa-spinner fa-spin"></i>
                    Guardando...
                {:else}
                    Guardar Categoría
                {/if}
            </button>
            <a href="/admin/categories" class="btn cancel-button">Cancelar</a>
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

    .category-form {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

    .form-group h3 {
        font-family: var(--font-heading);
        font-size: 1.2rem;
        color: var(--color-dark);
        margin-bottom: 1rem;
    }

    .subcategory-form {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .subcategories-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .subcategory-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 4px;
    }

    .subcategory-info {
        flex: 1;
    }

    .subcategory-info p {
        margin: 0.25rem 0 0;
        font-size: 0.9rem;
        color: #666;
    }

    .add-subcategory {
        background: var(--color-gold-primary);
        color: white;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .remove-subcategory {
        background: none;
        color: #dc3545;
        padding: 0.5rem;
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

        .subcategory-form {
            grid-template-columns: 1fr;
        }
    }
</style> 