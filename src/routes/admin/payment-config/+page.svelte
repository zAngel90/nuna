<script lang="ts">
    import { onMount } from 'svelte';
    import { API_BASE_URL } from '$lib/config';
    import { toast } from '@zerodevx/svelte-toast';

    interface BankAccount {
        bank: string;
        accountNumber: string;
        accountHolder: string;
        accountType: string;
    }

    interface PaymentConfig {
        bankAccounts: BankAccount[];
        paymentInstructions?: string;
    }

    let loading = false;
    let saving = false;
    let error = '';
    let config: PaymentConfig = {
        bankAccounts: [],
        paymentInstructions: ''
    };

    let newAccount = {
        bank: '',
        accountNumber: '',
        accountHolder: '',
        accountType: ''
    };

    onMount(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payment-config`);
            if (!response.ok) throw new Error('Error al cargar la configuración');
            const data = await response.json();
            config = data;
        } catch (err) {
            error = 'Error al cargar la configuración';
            console.error(err);
        }
    });

    async function handleSubmit() {
        saving = true;
        error = '';
        try {
            const response = await fetch(`${API_BASE_URL}/api/payment-config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });

            if (!response.ok) throw new Error('Error al guardar la configuración');
            
            toast.push('Configuración guardada exitosamente', {
                theme: {
                    '--toastBackground': '#48BB78',
                    '--toastColor': 'white',
                }
            });
        } catch (err) {
            console.error('Error:', err);
            error = 'Error al guardar la configuración';
            toast.push(error, {
                theme: {
                    '--toastBackground': '#F56565',
                    '--toastColor': 'white',
                }
            });
        } finally {
            saving = false;
        }
    }

    function addBankAccount() {
        if (newAccount.bank && newAccount.accountNumber && newAccount.accountHolder) {
            config.bankAccounts = [...config.bankAccounts, { ...newAccount }];
            newAccount = {
                bank: '',
                accountNumber: '',
                accountHolder: '',
                accountType: ''
            };
        }
    }

    function removeBankAccount(index: number) {
        config.bankAccounts = config.bankAccounts.filter((_, i) => i !== index);
    }
</script>

<div class="admin-page">
    <div class="admin-header">
        <h1>Configuración de Pagos</h1>
    </div>

    {#if error}
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {error}
        </div>
    {/if}

    <div class="config-form">
        <section class="bank-accounts">
            <h2>Cuentas Bancarias</h2>
            
            <div class="add-account-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="bank">Banco</label>
                        <input type="text" id="bank" bind:value={newAccount.bank}>
                    </div>
                    <div class="form-group">
                        <label for="accountNumber">Número de Cuenta</label>
                        <input type="text" id="accountNumber" bind:value={newAccount.accountNumber}>
                    </div>
                    <div class="form-group">
                        <label for="accountHolder">Titular</label>
                        <input type="text" id="accountHolder" bind:value={newAccount.accountHolder}>
                    </div>
                    <div class="form-group">
                        <label for="accountType">Tipo de Cuenta</label>
                        <select id="accountType" bind:value={newAccount.accountType}>
                            <option value="">Seleccionar...</option>
                            <option value="savings">Ahorro</option>
                            <option value="checking">Corriente</option>
                        </select>
                    </div>
                </div>
                <button class="btn add-button" on:click={addBankAccount}>
                    <i class="fas fa-plus"></i>
                    Agregar Cuenta
                </button>
            </div>

            <div class="accounts-list">
                {#each config.bankAccounts as account, index}
                    <div class="account-item">
                        <div class="account-info">
                            <h3>{account.bank}</h3>
                            <p>Cuenta: {account.accountNumber}</p>
                            <p>Titular: {account.accountHolder}</p>
                            <p>Tipo: {account.accountType === 'savings' ? 'Ahorro' : 'Corriente'}</p>
                        </div>
                        <button class="btn remove-button" on:click={() => removeBankAccount(index)}>
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                {/each}
            </div>
        </section>

        <section class="payment-instructions">
            <h2>Instrucciones de Pago</h2>
            <div class="form-group">
                <textarea 
                    bind:value={config.paymentInstructions}
                    placeholder="Ingrese las instrucciones de pago que verán los clientes..."
                    rows="6"
                ></textarea>
            </div>
        </section>

        <div class="form-actions">
            <button class="btn save-button" on:click={handleSubmit} disabled={saving}>
                {#if saving}
                    <i class="fas fa-spinner fa-spin"></i>
                    Guardando...
                {:else}
                    <i class="fas fa-save"></i>
                    Guardar Configuración
                {/if}
            </button>
        </div>
    </div>
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

    .error-message,
    .success-message {
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .error-message {
        background: #ffebee;
        color: #c62828;
    }

    .success-message {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .config-form {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    section {
        margin-bottom: 2rem;
    }

    h2 {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        color: var(--color-dark);
        margin-bottom: 1rem;
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .form-group {
        margin-bottom: 1rem;
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
        resize: vertical;
        min-height: 120px;
    }

    .accounts-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
    }

    .account-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 4px;
    }

    .account-info h3 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--color-dark);
    }

    .account-info p {
        margin: 0.25rem 0;
        color: #666;
    }

    .btn {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-family: var(--font-body);
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s;
    }

    .add-button {
        background: var(--color-gold-primary);
        color: white;
    }

    .remove-button {
        background: none;
        color: #dc3545;
        padding: 0.5rem;
    }

    .save-button {
        background: var(--color-gold-primary);
        color: white;
    }

    .save-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 2rem;
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