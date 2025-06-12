<script>
    import { onMount } from 'svelte';
    import { toast } from '@zerodevx/svelte-toast';
    import { API_BASE_URL } from '$lib/config';
    import { fetchWithConfig } from '$lib/api';

    let loading = true;
    let saving = false;
    let allProducts = [];
    let homeConfig = {
        carousel: [],
        featuredCategories: [],
        featuredProducts: []
    };

    onMount(async () => {
        try {
            // Cargar productos
            const productsData = await fetchWithConfig(`${API_BASE_URL}/products`);
            allProducts = productsData.data || [];

            // Cargar configuración del home
            homeConfig = await fetchWithConfig(`${API_BASE_URL}/home`);

            // Asegurarse de que cada slide tenga las propiedades de habilitación de botones
            homeConfig.carousel = homeConfig.carousel.map(slide => ({
                ...slide,
                hasPrimaryCta: !!slide.primaryCta,
                hasSecondaryCta: !!slide.secondaryCta,
                primaryCta: slide.primaryCta || { text: '', link: '' },
                secondaryCta: slide.secondaryCta || { text: '', link: '' }
            }));
        } catch (error) {
            console.error('Error loading data:', error);
            toast.push('Error al cargar los datos', {
                theme: {
                    '--toastBackground': '#F56565',
                    '--toastBarBackground': '#C53030'
                }
            });
        } finally {
            loading = false;
        }
    });

    async function saveCarousel() {
        saving = true;
        try {
            const fetchOptions = {
                mode: 'cors',
                credentials: 'same-origin',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            };

            // Preparar los datos para enviar al backend
            const carouselData = homeConfig.carousel.map(slide => ({
                ...slide,
                primaryCta: slide.hasPrimaryCta ? slide.primaryCta : null,
                secondaryCta: slide.hasSecondaryCta ? slide.secondaryCta : null
            }));

            const response = await fetch(`${API_BASE_URL}/home/carousel`, {
                ...fetchOptions,
                body: JSON.stringify({ carousel: carouselData })
            });

            if (!response.ok) throw new Error('Error al guardar el carrusel');

            toast.push('Carrusel actualizado correctamente', {
                theme: {
                    '--toastBackground': '#48BB78',
                    '--toastBarBackground': '#2F855A'
                }
            });
        } catch (error) {
            console.error('Error saving carousel:', error);
            toast.push('Error al guardar el carrusel', {
                theme: {
                    '--toastBackground': '#F56565',
                    '--toastBarBackground': '#C53030'
                }
            });
        } finally {
            saving = false;
        }
    }

    async function saveFeaturedCategories() {
        saving = true;
        try {
            const fetchOptions = {
                mode: 'cors',
                credentials: 'same-origin',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            };

            const response = await fetch(`${API_BASE_URL}/home/featured-categories`, {
                ...fetchOptions,
                body: JSON.stringify({ featuredCategories: homeConfig.featuredCategories })
            });

            if (!response.ok) throw new Error('Error al guardar las categorías destacadas');

            toast.push('Categorías destacadas actualizadas correctamente', {
                theme: {
                    '--toastBackground': '#48BB78',
                    '--toastBarBackground': '#2F855A'
                }
            });
        } catch (error) {
            console.error('Error saving featured categories:', error);
            toast.push('Error al guardar las categorías destacadas', {
                theme: {
                    '--toastBackground': '#F56565',
                    '--toastBarBackground': '#C53030'
                }
            });
        } finally {
            saving = false;
        }
    }

    function addCarouselSlide() {
        homeConfig.carousel = [...homeConfig.carousel, {
            id: Date.now(),
            preTitle: '',
            title: '',
            description: '',
            image: '',
            hasPrimaryCta: false,
            hasSecondaryCta: false,
            primaryCta: {
                text: '',
                link: ''
            },
            secondaryCta: {
                text: '',
                link: ''
            }
        }];
    }

    function removeCarouselSlide(index) {
        homeConfig.carousel = homeConfig.carousel.filter((_, i) => i !== index);
    }

    function addFeaturedCategory() {
        homeConfig.featuredCategories = [...homeConfig.featuredCategories, {
            id: Date.now(),
            name: '',
            image: '',
            link: '',
            order: homeConfig.featuredCategories.length + 1
        }];
    }

    function removeFeaturedCategory(index) {
        homeConfig.featuredCategories = homeConfig.featuredCategories.filter((_, i) => i !== index);
    }

    function addFeaturedProduct() {
        homeConfig.featuredProducts = [...homeConfig.featuredProducts, {
            id: Date.now(),
            productId: '',
            order: homeConfig.featuredProducts.length + 1
        }];
    }

    function removeFeaturedProduct(index) {
        homeConfig.featuredProducts = homeConfig.featuredProducts.filter((_, i) => i !== index);
    }

    async function saveFeaturedProducts() {
        saving = true;
        try {
            const fetchOptions = {
                mode: 'cors',
                credentials: 'same-origin',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            };

            const response = await fetch(`${API_BASE_URL}/home/featured-products`, {
                ...fetchOptions,
                body: JSON.stringify({ featuredProducts: homeConfig.featuredProducts })
            });

            if (!response.ok) throw new Error('Error al guardar los productos destacados');

            const data = await response.json();
            homeConfig.featuredProducts = data.featuredProducts;

            toast.push('Productos destacados actualizados correctamente', {
                theme: {
                    '--toastBackground': '#48BB78',
                    '--toastBarBackground': '#2F855A'
                }
            });
        } catch (error) {
            console.error('Error saving featured products:', error);
            toast.push('Error al guardar los productos destacados', {
                theme: {
                    '--toastBackground': '#F56565',
                    '--toastBarBackground': '#C53030'
                }
            });
        } finally {
            saving = false;
        }
    }
</script>

<div class="container">
    <h1>Configuración del Home</h1>

    {#if loading}
        <div class="loading">Cargando...</div>
    {:else}
        <section class="section">
            <h2>Carrusel Principal</h2>
            <div class="carousel-editor">
                {#each homeConfig.carousel as slide, index}
                    <div class="slide-editor">
                        <h3>Slide {index + 1}</h3>
                        <button class="delete-button" on:click={() => removeCarouselSlide(index)}>
                            <i class="fas fa-trash"></i>
                        </button>
                        <div class="form-group">
                            <label for="preTitle{index}">Pre-título</label>
                            <input
                                type="text"
                                id="preTitle{index}"
                                bind:value={slide.preTitle}
                                placeholder="Pre-título del slide"
                            />
                        </div>
                        <div class="form-group">
                            <label for="title{index}">Título</label>
                            <input
                                type="text"
                                id="title{index}"
                                bind:value={slide.title}
                                placeholder="Título principal"
                            />
                        </div>
                        <div class="form-group">
                            <label for="description{index}">Descripción</label>
                            <textarea
                                id="description{index}"
                                bind:value={slide.description}
                                placeholder="Descripción del slide"
                            ></textarea>
                        </div>
                        <div class="form-group">
                            <label for="image{index}">URL de la imagen</label>
                            <input
                                type="text"
                                id="image{index}"
                                bind:value={slide.image}
                                placeholder="URL de la imagen"
                            />
                        </div>

                        <!-- Botón Primario -->
                        <div class="cta-section">
                            <div class="cta-header">
                                <label class="checkbox-label">
                                    <input
                                        type="checkbox"
                                        bind:checked={slide.hasPrimaryCta}
                                    />
                                    <span>Botón Principal</span>
                                </label>
                            </div>
                            {#if slide.hasPrimaryCta}
                                <div class="cta-editor">
                                    <div class="form-group">
                                        <label for="primaryText{index}">Texto</label>
                                        <input
                                            type="text"
                                            id="primaryText{index}"
                                            bind:value={slide.primaryCta.text}
                                            placeholder="Texto del botón"
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label for="primaryLink{index}">Enlace</label>
                                        <input
                                            type="text"
                                            id="primaryLink{index}"
                                            bind:value={slide.primaryCta.link}
                                            placeholder="URL del enlace"
                                        />
                                    </div>
                                </div>
                            {/if}
                        </div>

                        <!-- Botón Secundario -->
                        <div class="cta-section">
                            <div class="cta-header">
                                <label class="checkbox-label">
                                    <input
                                        type="checkbox"
                                        bind:checked={slide.hasSecondaryCta}
                                    />
                                    <span>Botón Secundario</span>
                                </label>
                            </div>
                            {#if slide.hasSecondaryCta}
                                <div class="cta-editor">
                                    <div class="form-group">
                                        <label for="secondaryText{index}">Texto</label>
                                        <input
                                            type="text"
                                            id="secondaryText{index}"
                                            bind:value={slide.secondaryCta.text}
                                            placeholder="Texto del botón"
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label for="secondaryLink{index}">Enlace</label>
                                        <input
                                            type="text"
                                            id="secondaryLink{index}"
                                            bind:value={slide.secondaryCta.link}
                                            placeholder="URL del enlace"
                                        />
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
                <button class="add-button" on:click={addCarouselSlide}>
                    <i class="fas fa-plus"></i> Agregar Slide
                </button>
                <button class="save-button" on:click={saveCarousel} disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar Carrusel'}
                </button>
            </div>
        </section>

        <section class="section">
            <h2>Categorías Destacadas</h2>
            <div class="categories-editor">
                {#each homeConfig.featuredCategories as category, index}
                    <div class="category-editor">
                        <h3>Categoría {index + 1}</h3>
                        <button class="delete-button" on:click={() => removeFeaturedCategory(index)}>
                            <i class="fas fa-trash"></i>
                        </button>
                        <div class="form-group">
                            <label for="categoryName{index}">Nombre</label>
                            <input
                                type="text"
                                id="categoryName{index}"
                                bind:value={category.name}
                                placeholder="Nombre de la categoría"
                            />
                        </div>
                        <div class="form-group">
                            <label for="categoryImage{index}">URL de la imagen</label>
                            <input
                                type="text"
                                id="categoryImage{index}"
                                bind:value={category.image}
                                placeholder="URL de la imagen"
                            />
                        </div>
                        <div class="form-group">
                            <label for="categoryLink{index}">Enlace</label>
                            <input
                                type="text"
                                id="categoryLink{index}"
                                bind:value={category.link}
                                placeholder="URL del enlace"
                            />
                        </div>
                        <div class="form-group">
                            <label for="categoryOrder{index}">Orden</label>
                            <input
                                type="number"
                                id="categoryOrder{index}"
                                bind:value={category.order}
                                min="1"
                            />
                        </div>
                    </div>
                {/each}
                <button class="add-button" on:click={addFeaturedCategory}>
                    <i class="fas fa-plus"></i> Agregar Categoría
                </button>
                <button class="save-button" on:click={saveFeaturedCategories} disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar Categorías'}
                </button>
            </div>
        </section>

        <section class="section">
            <h2>Productos Destacados</h2>
            <div class="featured-products-editor">
                {#each homeConfig.featuredProducts as featured, index}
                    <div class="featured-product-editor">
                        <h3>Producto {index + 1}</h3>
                        <button class="delete-button" on:click={() => removeFeaturedProduct(index)}>
                            <i class="fas fa-trash"></i>
                        </button>
                        <div class="form-group">
                            <label for="productId{index}">Producto</label>
                            <select
                                id="productId{index}"
                                bind:value={featured.productId}
                            >
                                <option value="">Seleccionar producto</option>
                                {#each allProducts as product}
                                    <option value={product.id}>{product.name}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="productOrder{index}">Orden</label>
                            <input
                                type="number"
                                id="productOrder{index}"
                                bind:value={featured.order}
                                min="1"
                            />
                        </div>
                    </div>
                {/each}
                <button class="add-button" on:click={addFeaturedProduct}>
                    <i class="fas fa-plus"></i> Agregar Producto Destacado
                </button>
                <button class="save-button" on:click={saveFeaturedProducts} disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar Productos Destacados'}
                </button>
            </div>
        </section>
    {/if}
</div>

<style>
    .container {
        padding: 2rem;
        max-width: 1200px;
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

    .slide-editor, .category-editor {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        position: relative;
    }

    h3 {
        font-size: 1.2rem;
        margin-bottom: 1rem;
        color: var(--color-dark);
    }

    h4 {
        font-size: 1rem;
        margin: 1rem 0;
        color: var(--color-dark);
    }

    .form-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--color-dark);
    }

    input, textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
    }

    textarea {
        height: 100px;
        resize: vertical;
    }

    .cta-section {
        margin-top: 1.5rem;
        background: #f8f9fa;
        border-radius: 8px;
        padding: 1rem;
    }

    .cta-header {
        margin-bottom: 1rem;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
        width: 1.2rem;
        height: 1.2rem;
        cursor: pointer;
    }

    .checkbox-label span {
        font-weight: 600;
        color: var(--color-dark);
    }

    .cta-editor {
        padding: 1rem;
        background: white;
        border-radius: 4px;
        margin-top: 0.5rem;
    }

    .delete-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .delete-button:hover {
        background: #c82333;
    }

    .add-button {
        background: var(--color-gold-primary);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        cursor: pointer;
        margin-bottom: 1rem;
        transition: background-color 0.3s;
    }

    .add-button:hover {
        background: var(--color-gold-dark);
    }

    .save-button {
        background: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .save-button:hover {
        background: #218838;
    }

    .save-button:disabled {
        background: #6c757d;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        .container {
            padding: 1rem;
        }

        .section {
            padding: 1rem;
        }

        .slide-editor, .category-editor {
            padding: 1rem;
        }
    }

    .featured-products-editor {
        margin-top: 2rem;
    }

    .featured-product-editor {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        position: relative;
    }

    select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        background: white;
    }

    select:focus {
        outline: none;
        border-color: var(--color-gold-primary);
    }
</style> 