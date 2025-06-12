<script lang="ts">
    import { onMount } from 'svelte';
    import { API_BASE_URL } from '$lib/config';
    import { toast } from '@zerodevx/svelte-toast';

    interface Subcategory {
        id: string;
        name: string;
        slug: string;
    }

    interface Category {
        id: string;
        name: string;
        description: string;
        image: string;
        subcategories: any[];
    }

    let categories: Category[] = [];
    let loading = true;
    let error = '';

    // Estados para el formulario de categoría
    let newCategoryName = '';
    let editingCategory: Category | null = null;

    // Estados para el formulario de subcategoría
    let selectedCategoryId = '';
    let newSubcategoryName = '';
    let editingSubcategory: { categoryId: string; subcategory: Subcategory } | null = null;

    onMount(async () => {
        try {
            const fetchOptions: RequestInit = {
                mode: 'cors',
                credentials: 'include',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await fetch(`${API_BASE_URL}/categories`, fetchOptions);
            const data = await response.json();
            categories = data.data || [];
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        } finally {
            loading = false;
        }
    });

    async function createCategory() {
        if (!newCategoryName.trim()) return;

        try {
            const response = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName })
            });

            if (!response.ok) throw new Error('Error al crear categoría');
            
            await loadCategories();
            newCategoryName = '';
        } catch (err) {
            console.error('Error:', err);
            alert('Error al crear la categoría');
        }
    }

    async function createSubcategory() {
        if (!selectedCategoryId || !newSubcategoryName.trim()) return;

        try {
            const response = await fetch(`${API_BASE_URL}/categories/${selectedCategoryId}/subcategories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newSubcategoryName })
            });

            if (!response.ok) throw new Error('Error al crear subcategoría');
            
            await loadCategories();
            newSubcategoryName = '';
        } catch (err) {
            console.error('Error:', err);
            alert('Error al crear la subcategoría');
        }
    }

    async function updateCategory(category: Category) {
        try {
            const fetchOptions: RequestInit = {
                mode: 'cors',
                credentials: 'include',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify(category)
            };

            const response = await fetch(`${API_BASE_URL}/categories/${category.id}`, fetchOptions);
            
            if (response.ok) {
                const updatedCategory = await response.json();
                categories = categories.map(cat => 
                    cat.id === category.id ? updatedCategory : cat
                );
                toast.push('Categoría actualizada correctamente', {
                    theme: {
                        '--toastBackground': '#48BB78',
                        '--toastBarBackground': '#2F855A'
                    }
                });
            } else {
                throw new Error('Error al actualizar la categoría');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.push('Error al actualizar la categoría', {
                theme: {
                    '--toastBackground': '#F56565',
                    '--toastBarBackground': '#C53030'
                }
            });
        }
    }

    async function updateSubcategory(categoryId: string, subcategory: Subcategory) {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/subcategories/${subcategory.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: subcategory.name })
            });

            if (!response.ok) throw new Error('Error al actualizar subcategoría');
            
            await loadCategories();
            editingSubcategory = null;
        } catch (err) {
            console.error('Error:', err);
            alert('Error al actualizar la subcategoría');
        }
    }

    async function deleteCategory(categoryId: string) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;

        try {
            const fetchOptions: RequestInit = {
                mode: 'cors',
                credentials: 'include',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'DELETE'
            };

            const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, fetchOptions);
            
            if (response.ok) {
                categories = categories.filter(cat => cat.id !== categoryId);
                toast.push('Categoría eliminada correctamente', {
                    theme: {
                        '--toastBackground': '#48BB78',
                        '--toastBarBackground': '#2F855A'
                    }
                });
            } else {
                throw new Error('Error al eliminar la categoría');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.push('Error al eliminar la categoría', {
                theme: {
                    '--toastBackground': '#F56565',
                    '--toastBarBackground': '#C53030'
                }
            });
        }
    }

    async function deleteSubcategory(categoryId: string, subcategoryId: string) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta subcategoría?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/subcategories/${subcategoryId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar subcategoría');
            
            await loadCategories();
        } catch (err) {
            console.error('Error:', err);
            alert('Error al eliminar la subcategoría');
        }
    }
</script>

<div class="categories-page">
    <div class="page-header">
        <h1>Gestión de Categorías</h1>
    </div>

    <div class="content-grid">
        <!-- Formulario de nueva categoría -->
        <div class="form-section">
            <h2>Nueva Categoría</h2>
            <div class="form-group">
                <input
                    type="text"
                    bind:value={newCategoryName}
                    placeholder="Nombre de la categoría"
                    class="input"
                />
                <button on:click={createCategory} class="btn primary">
                    <i class="fas fa-plus"></i>
                    Agregar Categoría
                </button>
            </div>
        </div>

        <!-- Formulario de nueva subcategoría -->
        <div class="form-section">
            <h2>Nueva Subcategoría</h2>
            <div class="form-group">
                <select bind:value={selectedCategoryId} class="input">
                    <option value="">Seleccionar categoría</option>
                    {#each categories as category}
                        <option value={category.id}>{category.name}</option>
                    {/each}
                </select>
                <input
                    type="text"
                    bind:value={newSubcategoryName}
                    placeholder="Nombre de la subcategoría"
                    class="input"
                />
                <button on:click={createSubcategory} class="btn primary">
                    <i class="fas fa-plus"></i>
                    Agregar Subcategoría
                </button>
            </div>
        </div>

        <!-- Lista de categorías -->
        <div class="categories-list">
            <h2>Categorías y Subcategorías</h2>
            
            {#if loading}
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Cargando categorías...</p>
                </div>
            {:else if error}
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>{error}</p>
                </div>
            {:else if categories.length === 0}
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>No hay categorías creadas</p>
                </div>
            {:else}
                {#each categories as category}
                    <div class="category-card">
                        <div class="category-header">
                            {#if editingCategory?.id === category.id}
                                <input
                                    type="text"
                                    bind:value={editingCategory.name}
                                    class="edit-input"
                                    on:keydown={(e) => e.key === 'Enter' && updateCategory(editingCategory)}
                                />
                                <div class="actions">
                                    <button 
                                        class="btn icon-btn success"
                                        on:click={() => updateCategory(editingCategory)}
                                    >
                                        <i class="fas fa-check"></i>
                                    </button>
                                    <button 
                                        class="btn icon-btn"
                                        on:click={() => editingCategory = null}
                                    >
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            {:else}
                                <h3>{category.name}</h3>
                                <div class="actions">
                                    <button 
                                        class="btn icon-btn"
                                        on:click={() => editingCategory = {...category}}
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button 
                                        class="btn icon-btn danger"
                                        on:click={() => deleteCategory(category.id)}
                                    >
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            {/if}
                        </div>

                        <div class="subcategories-list">
                            {#each category.subcategories as subcategory}
                                <div class="subcategory-item">
                                    {#if editingSubcategory?.categoryId === category.id && editingSubcategory?.subcategory.id === subcategory.id}
                                        <input
                                            type="text"
                                            bind:value={editingSubcategory.subcategory.name}
                                            class="edit-input"
                                            on:keydown={(e) => e.key === 'Enter' && updateSubcategory(category.id, editingSubcategory.subcategory)}
                                        />
                                        <div class="actions">
                                            <button 
                                                class="btn icon-btn success"
                                                on:click={() => updateSubcategory(category.id, editingSubcategory.subcategory)}
                                            >
                                                <i class="fas fa-check"></i>
                                            </button>
                                            <button 
                                                class="btn icon-btn"
                                                on:click={() => editingSubcategory = null}
                                            >
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    {:else}
                                        <span>{subcategory.name}</span>
                                        <div class="actions">
                                            <button 
                                                class="btn icon-btn"
                                                on:click={() => editingSubcategory = {
                                                    categoryId: category.id,
                                                    subcategory: {...subcategory}
                                                }}
                                            >
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                class="btn icon-btn danger"
                                                on:click={() => deleteSubcategory(category.id, subcategory.id)}
                                            >
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>

<style>
    .categories-page {
        padding: 2rem;
    }

    .page-header {
        margin-bottom: 2rem;
    }

    .page-header h1 {
        font-family: var(--font-heading);
        font-size: 2rem;
        color: var(--color-dark);
    }

    .content-grid {
        display: grid;
        gap: 2rem;
    }

    .form-section {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-section h2 {
        font-size: 1.2rem;
        color: var(--color-dark);
        margin-bottom: 1rem;
    }

    .form-group {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
    }

    .input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
    }

    .input:focus {
        border-color: var(--color-gold-primary);
        outline: none;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 1rem;
    }

    .btn.primary {
        background: var(--color-gold-primary);
        color: white;
    }

    .btn.primary:hover {
        background: var(--color-gold-dark);
    }

    .btn.icon-btn {
        padding: 0.5rem;
        background: #f0f0f0;
        color: #666;
    }

    .btn.icon-btn:hover {
        background: #e0e0e0;
    }

    .btn.icon-btn.success {
        background: #4caf50;
        color: white;
    }

    .btn.icon-btn.danger {
        background: #f44336;
        color: white;
    }

    .categories-list {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .categories-list h2 {
        font-size: 1.2rem;
        color: var(--color-dark);
        margin-bottom: 1.5rem;
    }

    .category-card {
        border: 1px solid #eee;
        border-radius: 6px;
        margin-bottom: 1rem;
        overflow: hidden;
    }

    .category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8f9fa;
        border-bottom: 1px solid #eee;
    }

    .category-header h3 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--color-dark);
    }

    .subcategories-list {
        padding: 1rem;
    }

    .subcategory-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        border-radius: 4px;
        margin-bottom: 0.5rem;
    }

    .subcategory-item:hover {
        background: #f8f9fa;
    }

    .actions {
        display: flex;
        gap: 0.5rem;
    }

    .edit-input {
        padding: 0.25rem 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
    }

    .loading {
        text-align: center;
        padding: 2rem;
        color: #666;
    }

    .loading i {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: var(--color-gold-primary);
    }

    .error-message {
        background: #ffebee;
        color: #c62828;
        padding: 1rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
    }

    .empty-state i {
        font-size: 2rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    @media (max-width: 768px) {
        .categories-page {
            padding: 1rem;
        }

        .form-group {
            flex-direction: column;
        }

        .btn {
            width: 100%;
            justify-content: center;
        }
    }
</style> 