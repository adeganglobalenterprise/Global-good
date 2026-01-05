// Database simulation using localStorage
const DB = {
    // Initialize database
    init() {
        if (!localStorage.getItem('bankDB')) {
            const initialDB = {
                admin: {
                    username: 'admin',
                    password: 'admin123',
                    isLoggedIn: false
                },
                customers: [],
                transactions: [],
                mining: {
                    enabled: true,
                    walletAddress: '',
                    balance: 100,
                    lastUpdate: Date.now(),
                    rate: 0.5, // £ per 5 minutes
                    autoCredit: true,
                    creditWallet: 'BTC' // Default wallet to credit
                },
                cryptoWallets: {
                    BTC: { address: '', balance: 0, symbol: 'BTC', name: 'Bitcoin' },
                    ETH: { address: '', balance: 0, symbol: 'ETH', name: 'Ethereum' },
                    USDT: { address: '', balance: 0, symbol: 'USDT', name: 'Tether' },
                    USDC: { address: '', balance: 0, symbol: 'USDC', name: 'USD Coin' },
                    BNB: { address: '', balance: 0, symbol: 'BNB', name: 'Binance Coin' },
                    DOGE: { address: '', balance: 0, symbol: 'DOGE', name: 'Dogecoin' },
                    LTC: { address: '', balance: 0, symbol: 'LTC', name: 'Litecoin' },
                    XRP: { address: '', balance: 0, symbol: 'XRP', name: 'Ripple' },
                    ADA: { address: '', balance: 0, symbol: 'ADA', name: 'Cardano' },
                    SOL: { address: '', balance: 0, symbol: 'SOL', name: 'Solana' }
                },
                systemSettings: {
                    bankName: 'Global Finance Bank',
                    currency: 'GBP',
                    transferFee: 0.02, // 2%
                    internationalFee: 0.05 // 5%
                }
            };
            localStorage.setItem('bankDB', JSON.stringify(initialDB));
        }
    },

    // Get database
    getDB() {
        return JSON.parse(localStorage.getItem('bankDB'));
    },

    // Save database
    saveDB(data) {
        localStorage.setItem('bankDB', JSON.stringify(data));
    },

    // Admin operations
    adminLogin(username, password) {
        const db = this.getDB();
        if (db.admin.username === username && db.admin.password === password) {
            db.admin.isLoggedIn = true;
            this.saveDB(db);
            return true;
        }
        return false;
    },

    adminLogout() {
        const db = this.getDB();
        db.admin.isLoggedIn = false;
        this.saveDB(db);
    },

    // Customer operations
    registerCustomer(customerData) {
        const db = this.getDB();
        
        // Check if email already exists
        if (db.customers.find(c => c.email === customerData.email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Generate account number
        const accountNumber = this.generateAccountNumber();

        const newCustomer = {
            id: Date.now(),
            accountNumber: accountNumber,
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            email: customerData.email,
            password: customerData.password,
            passport: customerData.passport,
            balance: 0,
            creditBalance: 0,
            creditLimit: 5000,
            currency: 'GBP',
            cards: [],
            transactions: [],
            isLoggedIn: false,
            createdAt: new Date().toISOString()
        };

        db.customers.push(newCustomer);
        this.saveDB(db);
        return { success: true, customer: newCustomer };
    },

    customerLogin(email, password) {
        const db = this.getDB();
        const customer = db.customers.find(c => c.email === email && c.password === password);
        
        if (customer) {
            customer.isLoggedIn = true;
            this.saveDB(db);
            return { success: true, customer };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    customerLogout(customerId) {
        const db = this.getDB();
        const customer = db.customers.find(c => c.id === customerId);
        if (customer) {
            customer.isLoggedIn = false;
            this.saveDB(db);
        }
    },

    // Generate 10-digit account number
    generateAccountNumber() {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    },

    // Generate card number
    generateCardNumber() {
        return '4' + Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0');
    },

    // Transaction operations
    createTransaction(transactionData) {
        const db = this.getDB();
        const transaction = {
            id: Date.now(),
            type: transactionData.type,
            from: transactionData.from,
            to: transactionData.to,
            amount: transactionData.amount,
            fee: transactionData.fee || 0,
            status: 'pending',
            description: transactionData.description,
            timestamp: new Date().toISOString()
        };

        db.transactions.push(transaction);
        this.saveDB(db);
        return transaction;
    },

    updateTransactionStatus(transactionId, status) {
        const db = this.getDB();
        const transaction = db.transactions.find(t => t.id === transactionId);
        if (transaction) {
            transaction.status = status;
            this.saveDB(db);
        }
    },

    // Balance operations
    updateBalance(customerId, amount, type) {
        const db = this.getDB();
        const customer = db.customers.find(c => c.id === customerId);
        if (customer) {
            if (type === 'credit') {
                customer.balance += amount;
            } else if (type === 'debit') {
                if (customer.balance >= amount) {
                    customer.balance -= amount;
                    return { success: true };
                } else {
                    return { success: false, message: 'Insufficient funds' };
                }
            }
            this.saveDB(db);
            return { success: true };
        }
        return { success: false, message: 'Customer not found' };
    },

    // Mining operations
    updateMiningBalance() {
        const db = this.getDB();
        if (db.mining.enabled) {
            const now = Date.now();
            const timeDiff = (now - db.mining.lastUpdate) / 1000; // Convert to seconds
            const intervals = Math.floor(timeDiff / 300); // 300 seconds = 5 minutes
            
            if (intervals > 0) {
                const increase = intervals * db.mining.rate;
                
                if (db.mining.autoCredit) {
                    // Credit to selected crypto wallet
                    const walletType = db.mining.creditWallet;
                    if (db.cryptoWallets[walletType]) {
                        // Convert GBP to crypto (simplified conversion rates)
                        const conversionRates = {
                            BTC: 0.000025,
                            ETH: 0.0004,
                            USDT: 1,
                            USDC: 1,
                            BNB: 0.002,
                            DOGE: 5,
                            LTC: 0.005,
                            XRP: 1.2,
                            ADA: 1.5,
                            SOL: 0.01
                        };
                        const cryptoIncrease = increase * (conversionRates[walletType] || 1);
                        db.cryptoWallets[walletType].balance += cryptoIncrease;
                    }
                } else {
                    // Credit to main mining balance
                    db.mining.balance += increase;
                }
                
                db.mining.lastUpdate = now;
                this.saveDB(db);
                return { success: true, newBalance: db.mining.balance, increase };
            }
        }
        return { success: false };
    },

    toggleMining(enabled) {
        const db = this.getDB();
        db.mining.enabled = enabled;
        db.mining.lastUpdate = Date.now();
        this.saveDB(db);
    },

    setMiningWallet(address) {
        const db = this.getDB();
        db.mining.walletAddress = address;
        this.saveDB(db);
    },

    // Card operations
    issueCard(customerId, cardType) {
        const db = this.getDB();
        const customer = db.customers.find(c => c.id === customerId);
        if (customer) {
            const card = {
                number: this.generateCardNumber(),
                type: cardType,
                expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                cvv: Math.floor(100 + Math.random() * 900).toString(),
                status: 'active',
                createdAt: new Date().toISOString()
            };
            customer.cards.push(card);
            this.saveDB(db);
            return card;
        }
        return null;
    },

    // Get customer by ID
    getCustomer(customerId) {
        const db = this.getDB();
        return db.customers.find(c => c.id === customerId);
    },

    // Get all customers
    getAllCustomers() {
        const db = this.getDB();
        return db.customers;
    },

    // Get all transactions
    getAllTransactions() {
        const db = this.getDB();
        return db.transactions;
    },

    // Crypto wallet operations
    updateCryptoWallet(walletType, address, balance) {
        const db = this.getDB();
        if (db.cryptoWallets[walletType]) {
            db.cryptoWallets[walletType].address = address;
            if (balance !== undefined) {
                db.cryptoWallets[walletType].balance = balance;
            }
            this.saveDB(db);
            return { success: true };
        }
        return { success: false, message: 'Invalid wallet type' };
    },

    getCryptoWallets() {
        const db = this.getDB();
        return db.cryptoWallets;
    },

    setMiningAutoCredit(enabled, walletType) {
        const db = this.getDB();
        db.mining.autoCredit = enabled;
        if (walletType && db.cryptoWallets[walletType]) {
            db.mining.creditWallet = walletType;
        }
        this.saveDB(db);
        return { success: true };
    },

    // Card management operations
    updateCard(customerId, cardIndex, updates) {
        const db = this.getDB();
        const customer = db.customers.find(c => c.id === customerId);
        if (customer && customer.cards[cardIndex]) {
            Object.assign(customer.cards[cardIndex], updates);
            this.saveDB(db);
            return { success: true };
        }
        return { success: false, message: 'Card not found' };
    },

    deleteCard(customerId, cardIndex) {
        const db = this.getDB();
        const customer = db.customers.find(c => c.id === customerId);
        if (customer && customer.cards[cardIndex]) {
            customer.cards.splice(cardIndex, 1);
            this.saveDB(db);
            return { success: true };
        }
        return { success: false, message: 'Card not found' };
    }
};

// SMS Notification System
const SMS = {
    sendNotification(phoneNumber, message) {
        console.log(`SMS sent to ${phoneNumber}: ${message}`);
        // In production, this would integrate with an SMS API
        return { success: true, message: 'SMS sent successfully' };
    },

    // Predefined templates
    templates: {
        deposit: (amount, balance) => `Your account has been credited with £${amount.toFixed(2)}. New balance: £${balance.toFixed(2)}`,
        withdrawal: (amount, balance) => `Your account has been debited with £${amount.toFixed(2)}. New balance: £${balance.toFixed(2)}`,
        transfer: (amount, recipient, balance) => `You have transferred £${amount.toFixed(2)} to ${recipient}. New balance: £${balance.toFixed(2)}`,
        cardIssued: (cardNumber) => `Your new card ending in ${cardNumber.slice(-4)} has been issued and is active.`,
        login: () => `Security alert: New login detected on your account. If this wasn't you, please contact support immediately.`
    }
};

// UI Controller
const UI = {
    // Show modal
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    },

    // Hide modal
    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    },

    // Show success message
    showSuccess(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.textContent = message;
        document.querySelector('.container').prepend(alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    },

    // Show error message
    showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-warning';
        alertDiv.textContent = message;
        document.querySelector('.container').prepend(alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    },

    // Switch tab
    switchTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.nav-tabs button').forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(tabId).classList.add('active');
        event.target.classList.add('active');
    },

    // Format currency
    formatCurrency(amount) {
        return `£${amount.toFixed(2)}`;
    },

    // Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleString();
    },

    // Copy to clipboard
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showSuccess('Copied to clipboard!');
        });
    }
};

// Initialize database
DB.init();

// Check mining status periodically
setInterval(() => {
    const result = DB.updateMiningBalance();
    if (result.success && result.increase > 0) {
        console.log(`Mining update: +£${result.increase.toFixed(2)} (Total: £${result.newBalance.toFixed(2)})`);
        // Update UI if mining section is visible
        const miningBalanceEl = document.getElementById('mining-balance');
        if (miningBalanceEl) {
            miningBalanceEl.textContent = UI.formatCurrency(result.newBalance);
        }
    }
}, 5000); // Check every 5 seconds

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Admin login
    document.getElementById('admin-login-btn').addEventListener('click', () => {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        
        if (DB.adminLogin(username, password)) {
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('admin-dashboard').classList.add('active');
            updateAdminDashboard();
            UI.showSuccess('Welcome Admin!');
        } else {
            UI.showError('Invalid admin credentials');
        }
    });

    // Customer login
    document.getElementById('customer-login-btn').addEventListener('click', () => {
        const email = document.getElementById('customer-email').value;
        const password = document.getElementById('customer-password').value;
        
        const result = DB.customerLogin(email, password);
        if (result.success) {
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('customer-dashboard').classList.add('active');
            updateCustomerDashboard(result.customer);
            UI.showSuccess('Welcome back!');
        } else {
            UI.showError(result.message);
        }
    });

    // Customer registration
    document.getElementById('register-btn').addEventListener('click', () => {
        UI.showModal('register-modal');
    });

    document.getElementById('customer-register-btn').addEventListener('click', () => {
        const customerData = {
            firstName: document.getElementById('reg-first-name').value,
            lastName: document.getElementById('reg-last-name').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            passport: document.getElementById('reg-passport').value
        };

        if (!customerData.firstName || !customerData.lastName || !customerData.email || 
            !customerData.password || !customerData.passport) {
            UI.showError('Please fill all fields');
            return;
        }

        const result = DB.registerCustomer(customerData);
        if (result.success) {
            UI.hideModal('register-modal');
            UI.showSuccess('Registration successful! Please login.');
        } else {
            UI.showError(result.message);
        }
    });

    // Mining toggle
    document.getElementById('mining-toggle').addEventListener('change', (e) => {
        DB.toggleMining(e.target.checked);
        const status = e.target.checked ? 'enabled' : 'disabled';
        UI.showSuccess(`Mining ${status}`);
    });

    // Set mining wallet
    document.getElementById('set-wallet-btn').addEventListener('click', () => {
        const address = document.getElementById('mining-wallet').value;
        if (address) {
            DB.setMiningWallet(address);
            UI.showSuccess('Mining wallet address updated!');
        }
    });

    // Auto credit toggle
    document.getElementById('auto-credit-toggle').addEventListener('change', (e) => {
        const walletType = document.getElementById('credit-wallet-select').value;
        DB.setMiningAutoCredit(e.target.checked, walletType);
        const status = e.target.checked ? 'enabled' : 'disabled';
        UI.showSuccess(`Auto credit to wallet ${status}`);
    });

    // Credit wallet select
    document.getElementById('credit-wallet-select').addEventListener('change', (e) => {
        const autoCredit = document.getElementById('auto-credit-toggle').checked;
        DB.setMiningAutoCredit(autoCredit, e.target.value);
        UI.showSuccess(`Auto credit wallet changed to ${e.target.value}`);
    });

    // Issue card
    document.getElementById('issue-card-btn').addEventListener('click', () => {
        const customerId = getLoggedInCustomerId();
        const cardType = document.getElementById('card-type').value;
        const card = DB.issueCard(customerId, cardType);
        if (card) {
            UI.showSuccess(`New ${cardType} card issued: ${card.number}`);
            updateCustomerDashboard(DB.getCustomer(customerId));
        }
    });

    // Close modal buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            UI.hideModal(e.target.closest('.modal').id);
        });
    });

    // Logout buttons
    document.getElementById('admin-logout').addEventListener('click', () => {
        DB.adminLogout();
        document.getElementById('admin-dashboard').classList.remove('active');
        document.getElementById('login-section').style.display = 'flex';
        UI.showSuccess('Logged out successfully');
    });

    document.getElementById('customer-logout').addEventListener('click', () => {
        const customerId = getLoggedInCustomerId();
        DB.customerLogout(customerId);
        document.getElementById('customer-dashboard').classList.remove('active');
        document.getElementById('login-section').style.display = 'flex';
        UI.showSuccess('Logged out successfully');
    });
});

// Helper functions
function getLoggedInCustomerId() {
    const db = DB.getDB();
    const customer = db.customers.find(c => c.isLoggedIn);
    return customer ? customer.id : null;
}

function updateAdminDashboard() {
    const db = DB.getDB();
    const customers = DB.getAllCustomers();
    const transactions = DB.getAllTransactions();

    // Update stats
    document.getElementById('total-customers').textContent = customers.length;
    document.getElementById('total-transactions').textContent = transactions.length;
    document.getElementById('mining-balance').textContent = UI.formatCurrency(db.mining.balance);
    document.getElementById('mining-wallet-display').textContent = db.mining.walletAddress || 'Not set';

    // Update mining toggle
    document.getElementById('mining-toggle').checked = db.mining.enabled;
    document.getElementById('auto-credit-toggle').checked = db.mining.autoCredit;
    document.getElementById('credit-wallet-select').value = db.mining.creditWallet;

    // Update crypto wallets
    updateCryptoWalletsDisplay();

    // Update customer list
    const customerList = document.getElementById('customer-list');
    customerList.innerHTML = '';
    
    customers.forEach(customer => {
        const customerItem = document.createElement('div');
        customerItem.className = 'customer-item';
        
        // Cards HTML
        let cardsHtml = '';
        if (customer.cards && customer.cards.length > 0) {
            cardsHtml = '<div class="customer-cards"><strong>Cards:</strong><ul>';
            customer.cards.forEach((card, index) => {
                cardsHtml += `
                    <li>
                        ${card.type} - ****${card.number.slice(-4)} (${card.status})
                        <button class="btn-sm btn-warning edit-card-btn" 
                                onclick="editCustomerCard(${customer.id}, ${index})">Edit</button>
                        <button class="btn-sm btn-danger delete-card-btn" 
                                onclick="deleteCustomerCard(${customer.id}, ${index})">Delete</button>
                    </li>
                `;
            });
            cardsHtml += '</ul></div>';
        }
        
        customerItem.innerHTML = `
            <h4>${customer.firstName} ${customer.lastName}</h4>
            <p><strong>Account:</strong> ${customer.accountNumber}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Balance:</strong> ${UI.formatCurrency(customer.balance)}</p>
            <p><strong>Credit Limit:</strong> ${UI.formatCurrency(customer.creditLimit)}</p>
            <p><strong>Passport:</strong> ${customer.passport}</p>
            ${cardsHtml}
        `;
        customerList.appendChild(customerItem);
    });

    // Update transaction list
    updateTransactionTable(transactions);
}

function updateCustomerDashboard(customer) {
    if (!customer) return;

    // Update stats
    document.getElementById('customer-balance').textContent = UI.formatCurrency(customer.balance);
    document.getElementById('customer-account').textContent = customer.accountNumber;
    document.getElementById('customer-name').textContent = `${customer.firstName} ${customer.lastName}`;

    // Update cards
    const cardsList = document.getElementById('customer-cards');
    cardsList.innerHTML = '';
    
    customer.cards.forEach(card => {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        cardItem.innerHTML = `
            <p><strong>Type:</strong> ${card.type}</p>
            <p><strong>Number:</strong> **** **** **** ${card.number.slice(-4)}</p>
            <p><strong>Expiry:</strong> ${card.expiry}</p>
            <p><strong>Status:</strong> ${card.status}</p>
        `;
        cardsList.appendChild(cardItem);
    });

    // Update transactions
    updateTransactionTable(customer.transactions);
}

function updateTransactionTable(transactions) {
    const tableBody = document.getElementById('transactions-body');
    tableBody.innerHTML = '';
    
    transactions.slice(-10).reverse().forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${UI.formatDate(transaction.timestamp)}</td>
            <td>${transaction.type.toUpperCase()}</td>
            <td>${transaction.description || '-'}</td>
            <td>${UI.formatCurrency(transaction.amount)}</td>
            <td class="status-${transaction.status}">${transaction.status.toUpperCase()}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Update crypto wallets display
function updateCryptoWalletsDisplay() {
    const wallets = DB.getCryptoWallets();
    const container = document.getElementById('crypto-wallets-container');
    container.innerHTML = '';

    Object.entries(wallets).forEach(([type, wallet]) => {
        const walletCard = document.createElement('div');
        walletCard.className = 'crypto-wallet-card';
        walletCard.innerHTML = `
            <div class="wallet-header">
                <h3>${wallet.name} (${type})</h3>
                <span class="wallet-symbol">${type}</span>
            </div>
            <div class="wallet-info">
                <div class="wallet-address">
                    <label>Address:</label>
                    <input type="text" class="wallet-address-input" data-wallet="${type}" 
                           value="${wallet.address}" placeholder="Enter wallet address">
                </div>
                <div class="wallet-balance">
                    <label>Balance:</label>
                    <span class="balance-value">${wallet.balance.toFixed(8)} ${type}</span>
                </div>
            </div>
            <div class="wallet-actions">
                <button class="btn btn-success save-wallet-btn" data-wallet="${type}">Save Address</button>
                <button class="btn btn-secondary update-balance-btn" data-wallet="${type}">Update Balance</button>
            </div>
        `;
        container.appendChild(walletCard);
    });

    // Add event listeners for wallet buttons
    document.querySelectorAll('.save-wallet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const walletType = e.target.dataset.wallet;
            const addressInput = document.querySelector(`.wallet-address-input[data-wallet="${walletType}"]`);
            const result = DB.updateCryptoWallet(walletType, addressInput.value);
            if (result.success) {
                UI.showSuccess(`${walletType} wallet address updated!`);
            } else {
                UI.showError(result.message);
            }
        });
    });

    document.querySelectorAll('.update-balance-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const walletType = e.target.dataset.wallet;
            const newBalance = prompt(`Enter new balance for ${walletType}:`);
            if (newBalance !== null) {
                const result = DB.updateCryptoWallet(walletType, null, parseFloat(newBalance));
                if (result.success) {
                    UI.showSuccess(`${walletType} wallet balance updated!`);
                    updateCryptoWalletsDisplay();
                } else {
                    UI.showError(result.message);
                }
            }
        });
    });
}

// Edit customer card
function editCustomerCard(customerId, cardIndex) {
    const customer = DB.getCustomer(customerId);
    if (!customer || !customer.cards[cardIndex]) return;

    const card = customer.cards[cardIndex];
    const modal = document.getElementById('edit-card-modal');
    
    document.getElementById('edit-card-number').value = card.number;
    document.getElementById('edit-card-type').value = card.type;
    document.getElementById('edit-card-status').value = card.status;
    document.getElementById('edit-card-expiry').value = card.expiry;
    
    document.getElementById('save-card-edit').dataset.customerId = customerId;
    document.getElementById('save-card-edit').dataset.cardIndex = cardIndex;
    
    UI.showModal('edit-card-modal');
}

// Save card edit
document.getElementById('save-card-edit').addEventListener('click', () => {
    const customerId = parseInt(document.getElementById('save-card-edit').dataset.customerId);
    const cardIndex = parseInt(document.getElementById('save-card-edit').dataset.cardIndex);
    
    const updates = {
        number: document.getElementById('edit-card-number').value,
        type: document.getElementById('edit-card-type').value,
        status: document.getElementById('edit-card-status').value,
        expiry: document.getElementById('edit-card-expiry').value
    };
    
    const result = DB.updateCard(customerId, cardIndex, updates);
    if (result.success) {
        UI.showSuccess('Card updated successfully!');
        UI.hideModal('edit-card-modal');
        updateAdminDashboard();
    } else {
        UI.showError(result.message);
    }
});

// Delete customer card
function deleteCustomerCard(customerId, cardIndex) {
    if (confirm('Are you sure you want to delete this card?')) {
        const result = DB.deleteCard(customerId, cardIndex);
        if (result.success) {
            UI.showSuccess('Card deleted successfully!');
            updateAdminDashboard();
        } else {
            UI.showError(result.message);
        }
    }
}

// Transfer functionality
function initiateTransfer(type) {
    const customerId = getLoggedInCustomerId();
    const customer = DB.getCustomer(customerId);
    
    let recipient, amount, description, fee;
    
    if (type === 'local') {
        recipient = document.getElementById('local-recipient').value;
        amount = parseFloat(document.getElementById('local-amount').value);
        description = document.getElementById('local-description').value;
        fee = amount * DB.getDB().systemSettings.transferFee;
    } else if (type === 'international') {
        recipient = document.getElementById('int-recipient').value;
        amount = parseFloat(document.getElementById('int-amount').value);
        description = document.getElementById('int-description').value;
        fee = amount * DB.getDB().systemSettings.internationalFee;
    }

    if (!recipient || !amount || amount <= 0) {
        UI.showError('Please fill all fields with valid values');
        return;
    }

    const totalAmount = amount + fee;
    
    if (customer.balance < totalAmount) {
        UI.showError('Insufficient funds');
        return;
    }

    // Create transaction
    const transaction = DB.createTransaction({
        type: type,
        from: customer.accountNumber,
        to: recipient,
        amount: amount,
        fee: fee,
        description: description
    });

    // Update balance
    const balanceResult = DB.updateBalance(customerId, totalAmount, 'debit');
    
    if (balanceResult.success) {
        DB.updateTransactionStatus(transaction.id, 'success');
        customer.transactions.push(transaction);
        DB.saveDB(DB.getDB());
        
        UI.showSuccess(`Transfer of £${amount.toFixed(2)} successful! Fee: £${fee.toFixed(2)}`);
        updateCustomerDashboard(customer);
        UI.hideModal(`${type}-transfer-modal`);
    } else {
        DB.updateTransactionStatus(transaction.id, 'failed');
        UI.showError(balanceResult.message);
    }
}

// Deposit functionality
function makeDeposit(type) {
    const customerId = getLoggedInCustomerId();
    const customer = DB.getCustomer(customerId);
    
    let amount;
    
    if (type === 'cash') {
        amount = parseFloat(document.getElementById('cash-amount').value);
    } else if (type === 'card') {
        amount = parseFloat(document.getElementById('card-deposit-amount').value);
    }

    if (!amount || amount <= 0) {
        UI.showError('Please enter a valid amount');
        return;
    }

    // Create transaction
    const transaction = DB.createTransaction({
        type: 'deposit',
        from: type,
        to: customer.accountNumber,
        amount: amount,
        description: `${type} deposit`
    });

    // Update balance
    DB.updateBalance(customerId, amount, 'credit');
    customer.transactions.push(transaction);
    DB.saveDB(DB.getDB());
    
    UI.showSuccess(`Deposit of £${amount.toFixed(2)} successful!`);
    updateCustomerDashboard(customer);
    UI.hideModal(`${type}-deposit-modal`);
}

// Bill payment functionality
function payBill() {
    const customerId = getLoggedInCustomerId();
    const customer = DB.getCustomer(customerId);
    
    const biller = document.getElementById('bill-biller').value;
    const amount = parseFloat(document.getElementById('bill-amount').value);
    const reference = document.getElementById('bill-reference').value;

    if (!biller || !amount || amount <= 0) {
        UI.showError('Please fill all fields with valid values');
        return;
    }

    // Create transaction
    const transaction = DB.createTransaction({
        type: 'bill_payment',
        from: customer.accountNumber,
        to: biller,
        amount: amount,
        description: `Bill payment - Ref: ${reference}`
    });

    // Update balance
    const balanceResult = DB.updateBalance(customerId, amount, 'debit');
    
    if (balanceResult.success) {
        DB.updateTransactionStatus(transaction.id, 'success');
        customer.transactions.push(transaction);
        DB.saveDB(DB.getDB());
        
        UI.showSuccess(`Bill payment of £${amount.toFixed(2)} to ${biller} successful!`);
        updateCustomerDashboard(customer);
        UI.hideModal('bill-payment-modal');
    } else {
        DB.updateTransactionStatus(transaction.id, 'failed');
        UI.showError(balanceResult.message);
    }
}

// Add event listeners for transfer modals
document.getElementById('local-transfer-submit').addEventListener('click', () => initiateTransfer('local'));
document.getElementById('int-transfer-submit').addEventListener('click', () => initiateTransfer('international'));
document.getElementById('cash-deposit-submit').addEventListener('click', () => makeDeposit('cash'));
document.getElementById('card-deposit-submit').addEventListener('click', () => makeDeposit('card'));
document.getElementById('bill-pay-submit').addEventListener('click', payBill);