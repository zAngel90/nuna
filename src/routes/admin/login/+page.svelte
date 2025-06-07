<script lang="ts">
    import { goto } from '$app/navigation';
    import { isAuthenticated } from '$lib/stores/auth';
    import { onMount } from 'svelte';

    let username = '';
    let password = '';
    let error = '';

    onMount(() => {
        if (isAuthenticated.checkAuth()) {
            goto('/admin');
        }
    });

    function handleSubmit() {
        if (isAuthenticated.login(username, password)) {
            goto('/admin');
        } else {
            error = 'Credenciales inválidas';
        }
    }
</script>

<div class="login-container">
    <div class="login-card">
        <h1>Acceso Administrativo</h1>
        
        <form on:submit|preventDefault={handleSubmit}>
            {#if error}
                <div class="error-message">
                    {error}
                </div>
            {/if}
            
            <div class="form-group">
                <label for="username">Usuario</label>
                <input 
                    type="text" 
                    id="username" 
                    bind:value={username} 
                    required
                    autocomplete="username"
                >
            </div>

            <div class="form-group">
                <label for="password">Contraseña</label>
                <input 
                    type="password" 
                    id="password" 
                    bind:value={password} 
                    required
                    autocomplete="current-password"
                >
            </div>

            <button type="submit">Iniciar Sesión</button>
        </form>
    </div>
</div>

<style>
    .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
                    url('https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0')
                    center/cover no-repeat;
    }

    .login-card {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        width: 100%;
        max-width: 400px;
    }

    h1 {
        font-family: 'Cormorant Garamond', serif;
        font-size: 2rem;
        color: var(--color-dark);
        margin-bottom: 2rem;
        text-align: center;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: #666;
    }

    input {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-family: 'Montserrat', sans-serif;
    }

    button {
        width: 100%;
        padding: 1rem;
        background: var(--color-gold);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: 'Montserrat', sans-serif;
        transition: all 0.3s ease;
    }

    button:hover {
        background: #b69565;
    }

    .error-message {
        background: #fce8e6;
        color: #c62828;
        padding: 1rem;
        border-radius: 5px;
        margin-bottom: 1.5rem;
        text-align: center;
    }
</style> 