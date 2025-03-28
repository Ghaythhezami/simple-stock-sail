// Order management functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load orders list
    loadOrdersList();
    
    // Load clients for the order creation modal
    loadClientsForOrder();
    
    // Load commercials for the order creation modal
    loadCommercialsForOrder();
    
    // Load products for the order creation modal
    loadProductsForOrder();
    
    // Event listener for order filter
    document.getElementById('order-filter').addEventListener('change', function() {
        const filterValue = this.value;
        loadOrdersList(null, filterValue);
    });
    
    // Event listener for search button
    document.getElementById('order-search-btn').addEventListener('click', function() {
        const searchTerm = document.getElementById('order-search').value.toLowerCase();
        const filterValue = document.getElementById('order-filter').value;
        loadOrdersList(searchTerm, filterValue);
    });
    
    // Event listener for "Create New Order" button
    document.getElementById('create-order-btn').addEventListener('click', function() {
        openOrderModal();
    });
    
    // Event listener for "Add Product" button in order modal
    document.getElementById('add-product-btn').addEventListener('click', function() {
        addProductRow();
    });
    
    // Event listener for form submission
    document.getElementById('order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveOrder();
    });
    
    // Event listener for modal close button
    document.querySelectorAll('#order-modal .close-btn, #order-details-modal .close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            closeOrderModal(this.closest('.modal').id);
        });
    });
    
    // Event listener for Cancel button in modal
    document.getElementById('cancel-order-modal-btn').addEventListener('click', function() {
        closeOrderModal('order-modal');
    });
    
    // Event listener for Close button in details modal
    document.getElementById('close-details-btn').addEventListener('click', function() {
        closeOrderModal('order-details-modal');
    });
    
    // Event listeners for validate and cancel order buttons
    document.getElementById('validate-order-btn').addEventListener('click', function() {
        const orderId = this.getAttribute('data-id');
        updateOrderStatus(orderId, 'validated');
        closeOrderModal('order-details-modal');
        loadOrdersList();
    });
    
    document.getElementById('cancel-order-btn').addEventListener('click', function() {
        const orderId = this.getAttribute('data-id');
        updateOrderStatus(orderId, 'cancelled');
        closeOrderModal('order-details-modal');
        loadOrdersList();
    });
});

// Load orders list into table
function loadOrdersList(searchTerm = '', filterValue = 'all') {
    const ordersTableBody = document.getElementById('orders-list');
    ordersTableBody.innerHTML = '';
    
    // Filter orders by search term and status
    let filteredOrders = orders;
    
    if (filterValue !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === filterValue);
    }
    
    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => {
            const client = getClientById(order.clientId);
            const commercial = getCommercialById(order.commercialId);
            
            return (
                order.id.toString().includes(searchTerm) ||
                (client && client.name.toLowerCase().includes(searchTerm)) ||
                (commercial && commercial.name.toLowerCase().includes(searchTerm))
            );
        });
    }
    
    // Create table rows for each order
    filteredOrders.forEach(order => {
        const client = getClientById(order.clientId);
        const commercial = getCommercialById(order.commercialId);
        
        const row = document.createElement('tr');
        
        // Determine status class
        let statusClass = '';
        switch(order.status) {
            case 'pending':
                statusClass = 'status-pending';
                break;
            case 'validated':
                statusClass = 'status-validated';
                break;
            case 'cancelled':
                statusClass = 'status-cancelled';
                break;
        }
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>${client ? client.name : 'Unknown'}</td>
            <td>${commercial ? commercial.name : 'Unknown'}</td>
            <td>${order.products.length} products</td>
            <td>$${order.totalValue.toFixed(2)}</td>
            <td><span class="status-badge ${statusClass}">${order.status}</span></td>
            <td>
                <button class="btn-view" data-id="${order.id}">View</button>
                ${order.status === 'pending' ? `
                    <button class="btn-validate" data-id="${order.id}">Validate</button>
                    <button class="btn-cancel" data-id="${order.id}">Cancel</button>
                ` : ''}
            </td>
        `;
        
        ordersTableBody.appendChild(row);
    });
    
    // Attach event listeners to action buttons
    attachOrderActionListeners();
}

// Attach event listeners to order action buttons
function attachOrderActionListeners() {
    // View buttons
    document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-id'));
            openOrderDetailsModal(orderId);
        });
    });
    
    // Validate buttons
    document.querySelectorAll('.btn-validate').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-id'));
            if (confirm('Are you sure you want to validate this order?')) {
                updateOrderStatus(orderId, 'validated');
                loadOrdersList();
            }
        });
    });
    
    // Cancel buttons
    document.querySelectorAll('.btn-cancel').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-id'));
            if (confirm('Are you sure you want to cancel this order?')) {
                updateOrderStatus(orderId, 'cancelled');
                loadOrdersList();
            }
        });
    });
}

// Load clients for order form
function loadClientsForOrder() {
    const clientSelect = document.getElementById('order-client');
    clientSelect.innerHTML = '<option value="">Select a client</option>';
    
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = `${client.name} (${client.type})`;
        option.setAttribute('data-type', client.type);
        clientSelect.appendChild(option);
    });
    
    // Event listener for client change to update product prices
    clientSelect.addEventListener('change', function() {
        updateProductPricesBasedOnClient();
    });
}

// Load commercials for order form
function loadCommercialsForOrder() {
    const commercialSelect = document.getElementById('order-commercial');
    commercialSelect.innerHTML = '<option value="">Select a commercial agent</option>';
    
    commercials.forEach(commercial => {
        const option = document.createElement('option');
        option.value = commercial.id;
        option.textContent = `${commercial.name} (${commercial.specialization}, ${commercial.territory})`;
        commercialSelect.appendChild(option);
    });
}

// Load products for order form
function loadProductsForOrder() {
    // Get the first product row that exists by default
    const productSelects = document.querySelectorAll('.order-product');
    
    productSelects.forEach(select => {
        select.innerHTML = '<option value="">Select a product</option>';
        
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            select.appendChild(option);
        });
        
        // Add event listener for product selection change
        select.addEventListener('change', function() {
            updateProductRowPricing(this.closest('.order-product-row'));
        });
    });
    
    // Add event listeners for quantity changes in existing rows
    document.querySelectorAll('.order-quantity').forEach(input => {
        input.addEventListener('change', function() {
            updateProductRowPricing(this.closest('.order-product-row'));
        });
    });
    
    // Attach event listeners to remove buttons
    attachRemoveProductListeners();
}

// Open order creation/edit modal
function openOrderModal() {
    const modal = document.getElementById('order-modal');
    const form = document.getElementById('order-form');
    
    // Reset form
    form.reset();
    
    // Clear product rows except the first one
    const productContainer = document.getElementById('order-products-container');
    const productRows = productContainer.querySelectorAll('.order-product-row');
    
    // Keep only the first row and reset it
    for (let i = 1; i < productRows.length; i++) {
        productRows[i].remove();
    }
    
    const firstRow = productRows[0];
    if (firstRow) {
        firstRow.querySelector('.order-product').value = '';
        firstRow.querySelector('.order-quantity').value = '1';
        firstRow.querySelector('.product-price').textContent = ' dt0.00';
        firstRow.querySelector('.product-subtotal').textContent = ' dt0.00';
    }
    
    // Reset order total
    document.getElementById('order-total').textContent = ' dt0.00';
    
    // Show modal
    modal.style.display = 'block';
}

// Open order details modal
function openOrderDetailsModal(orderId) {
    const modal = document.getElementById('order-details-modal');
    const contentDiv = document.getElementById('order-details-content');
    const order = getOrderById(orderId);
    
    if (!order) {
        alert('Order not found');
        return;
    }
    
    const client = getClientById(order.clientId);
    const commercial = getCommercialById(order.commercialId);
    
    // Build order details HTML
    let detailsHTML = `
        <div class="order-details-header">
            <div class="order-id">Order #${order.id}</div>
            <div class="order-date">Date: ${order.date}</div>
            <div class="order-status">Status: <span class="status-badge status-${order.status}">${order.status}</span></div>
        </div>
        <div class="order-details-section">
            <h4>Client:</h4>
            <p>${client ? client.name : 'Unknown'}</p>
            <p>${client ? client.email : ''}</p>
            <p>${client ? client.phone : ''}</p>
            <p>${client ? client.address : ''}</p>
        </div>
        <div class="order-details-section">
            <h4>Commercial Agent:</h4>
            <p>${commercial ? commercial.name : 'Unknown'}</p>
            <p>${commercial ? commercial.email : ''}</p>
            <p>${commercial ? commercial.phone : ''}</p>
            <p>Territory: ${commercial ? commercial.territory : ''}</p>
        </div>
        <div class="order-details-section">
            <h4>Products:</h4>
            <table class="order-products-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Add product rows
    order.products.forEach(item => {
        const product = getProductById(item.productId);
        detailsHTML += `
            <tr>
                <td>${product ? product.name : `Product #${item.productId}`}</td>
                <td>${item.quantity}</td>
                <td>$${item.unitPrice.toFixed(3)}</td>
                <td>$${(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
        `;
    });
    
    // Close table and add order total
    detailsHTML += `
                </tbody>
            </table>
        </div>
        <div class="order-details-section order-total-section">
            <h4>Order Total: <span>$${order.totalValue.toFixed(2)}</span></h4>
        </div>
    `;
    
    contentDiv.innerHTML = detailsHTML;
    
    // Set order ID to action buttons
    document.getElementById('validate-order-btn').setAttribute('data-id', order.id);
    document.getElementById('cancel-order-btn').setAttribute('data-id', order.id);
    
    // Show/hide action buttons based on order status
    if (order.status === 'pending') {
        document.getElementById('validate-order-btn').style.display = 'inline-block';
        document.getElementById('cancel-order-btn').style.display = 'inline-block';
    } else {
        document.getElementById('validate-order-btn').style.display = 'none';
        document.getElementById('cancel-order-btn').style.display = 'none';
    }
    
    // Show modal
    modal.style.display = 'block';
}

// Close order modal (creation or details)
function closeOrderModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Add a new product row to the order form
function addProductRow() {
    const productContainer = document.getElementById('order-products-container');
    const newRow = document.createElement('div');
    newRow.className = 'order-product-row';
    
    newRow.innerHTML = `
        <select class="order-product" required>
            <option value="">Select a product</option>
        </select>
        <input type="number" class="order-quantity" min="1" value="1" required>
        <span class="product-price"> dt0.00</span>
        <span class="product-subtotal"> dt0.00</span>
        <button type="button" class="remove-product-btn">Remove</button>
    `;
    
    productContainer.appendChild(newRow);
    
    // Add products to the new select
    const newSelect = newRow.querySelector('.order-product');
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        newSelect.appendChild(option);
    });
    
    // Add event listeners
    newSelect.addEventListener('change', function() {
        updateProductRowPricing(newRow);
    });
    
    newRow.querySelector('.order-quantity').addEventListener('change', function() {
        updateProductRowPricing(newRow);
    });
    
    // Update remove button event listeners
    attachRemoveProductListeners();
}

// Attach event listeners to remove product buttons
function attachRemoveProductListeners() {
    document.querySelectorAll('.remove-product-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productRows = document.querySelectorAll('.order-product-row');
            // Only remove if there's more than one row
            if (productRows.length > 1) {
                this.closest('.order-product-row').remove();
                updateOrderTotal();
            } else {
                alert('You need at least one product in the order.');
            }
        });
    });
}

// Update pricing for a specific product row
function updateProductRowPricing(row) {
    const productSelect = row.querySelector('.order-product');
    const quantityInput = row.querySelector('.order-quantity');
    const priceSpan = row.querySelector('.product-price');
    const subtotalSpan = row.querySelector('.product-subtotal');
    
    const productId = parseInt(productSelect.value);
    const quantity = parseInt(quantityInput.value);
    
    if (isNaN(productId) || productId === 0) {
        priceSpan.textContent = ' dt0.00';
        subtotalSpan.textContent = ' dt0.00';
        return;
    }
    
    const product = getProductById(productId);
    const clientSelect = document.getElementById('order-client');
    const clientOption = clientSelect.options[clientSelect.selectedIndex];
    const clientType = clientOption?.getAttribute('data-type') || '';
    
    let unitPrice = 0;
    
    if (product && clientType && product.prices[clientType]) {
        unitPrice = product.prices[clientType];
        priceSpan.textContent = `$${unitPrice.toFixed(3)}`;
        
        const subtotal = unitPrice * quantity;
        subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
    } else {
        priceSpan.textContent = 'N/A';
        subtotalSpan.textContent = 'N/A';
    }
    
    // Update total order price
    updateOrderTotal();
}

// Update all product prices based on selected client
function updateProductPricesBasedOnClient() {
    const rows = document.querySelectorAll('.order-product-row');
    rows.forEach(row => {
        updateProductRowPricing(row);
    });
}

// Update total order price
function updateOrderTotal() {
    const rows = document.querySelectorAll('.order-product-row');
    let total = 0;
    
    rows.forEach(row => {
        const subtotalText = row.querySelector('.product-subtotal').textContent;
        if (subtotalText !== 'N/A') {
            const subtotal = parseFloat(subtotalText.replace('$', ''));
            if (!isNaN(subtotal)) {
                total += subtotal;
            }
        }
    });
    
    document.getElementById('order-total').textContent = `$${total.toFixed(2)}`;
}

// Save order
function saveOrder() {
    const clientId = document.getElementById('order-client').value;
    const commercialId = document.getElementById('order-commercial').value;
    
    if (!clientId || !commercialId) {
        alert('Please select a client and a commercial agent.');
        return;
    }
    
    // Get products
    const productRows = document.querySelectorAll('.order-product-row');
    const products = [];
    
    let isValid = true;
    
    productRows.forEach(row => {
        const productId = row.querySelector('.order-product').value;
        const quantity = row.querySelector('.order-quantity').value;
        const priceText = row.querySelector('.product-price').textContent;
        
        if (!productId || !quantity || priceText === 'N/A') {
            isValid = false;
            return;
        }
        
        const unitPrice = parseFloat(priceText.replace('$', ''));
        
        products.push({
            productId,
            quantity,
            unitPrice
        });
    });
    
    if (!isValid) {
        alert('Please make sure all products are properly selected and have valid prices.');
        return;
    }
    
    // Create order
    const orderData = {
        clientId,
        commercialId,
        products
    };
    
    // Add order to data
    const newOrder = addOrder(orderData);
    
    // Close modal and reload list
    closeOrderModal('order-modal');
    loadOrdersList();
}
