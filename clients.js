
// Client management functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load client list
    loadClientsList();
    
    // Event listener for search button
    document.getElementById('client-search-btn').addEventListener('click', function() {
        const searchTerm = document.getElementById('client-search').value.toLowerCase();
        loadClientsList(searchTerm);
    });
    
    // Event listener for search input (search as you type)
    document.getElementById('client-search').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        loadClientsList(searchTerm);
    });
    
    // Event listener for "Add New Client" button
    document.getElementById('create-client-btn').addEventListener('click', function() {
        openClientModal('add');
    });
    
    // Event listener for client form submission
    document.getElementById('client-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveClient();
    });
    
    // Event listener for modal close button
    document.querySelector('#client-modal .close-btn').addEventListener('click', function() {
        closeClientModal();
    });
    
    // Event listener for Cancel button in modal
    document.getElementById('cancel-client-modal-btn').addEventListener('click', function() {
        closeClientModal();
    });
});

// Load clients list into table
function loadClientsList(searchTerm = '') {
    const clientsTableBody = document.getElementById('clients-list');
    clientsTableBody.innerHTML = '';
    
    // Filter clients if search term provided
    const filteredClients = searchTerm ? 
        clients.filter(client => 
            client.name.toLowerCase().includes(searchTerm) || 
            client.email.toLowerCase().includes(searchTerm) ||
            client.type.toLowerCase().includes(searchTerm)
        ) : clients;
    
    // Create table rows for each client
    filteredClients.forEach(client => {
        // Count orders for this client
        const clientOrders = orders.filter(order => order.clientId === client.id);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.id}</td>
            <td>${client.name}</td>
            <td>${client.type}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${client.address}</td>
            <td>${clientOrders.length}</td>
            <td>
                <button class="btn-edit" data-id="${client.id}">Edit</button>
                <button class="btn-delete" data-id="${client.id}">Delete</button>
            </td>
        `;
        
        clientsTableBody.appendChild(row);
    });
    
    // Attach event listeners to action buttons
    attachClientActionListeners();
}

// Attach event listeners to client action buttons
function attachClientActionListeners() {
    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const clientId = parseInt(this.getAttribute('data-id'));
            openClientModal('edit', clientId);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const clientId = parseInt(this.getAttribute('data-id'));
            if (confirm('Are you sure you want to delete this client?')) {
                deleteClient(clientId);
            }
        });
    });
}

// Open client modal for adding or editing
function openClientModal(mode, clientId = null) {
    const modal = document.getElementById('client-modal');
    const modalTitle = document.getElementById('client-modal-title');
    const form = document.getElementById('client-form');
    
    // Reset form
    form.reset();
    
    if (mode === 'add') {
        modalTitle.textContent = 'Add New Client';
        // Set a default client type
        document.getElementById('client-form').setAttribute('data-mode', 'add');
    } else {
        modalTitle.textContent = 'Edit Client';
        document.getElementById('client-form').setAttribute('data-mode', 'edit');
        document.getElementById('client-form').setAttribute('data-id', clientId);
        
        // Fill form with client data
        const client = getClientById(clientId);
        if (client) {
            document.getElementById('client-name').value = client.name;
            document.getElementById('client-company').value = client.type;
            document.getElementById('client-email').value = client.email;
            document.getElementById('client-phone').value = client.phone;
            document.getElementById('client-address').value = client.address;
        }
    }
    
    modal.style.display = 'block';
}

// Close client modal
function closeClientModal() {
    const modal = document.getElementById('client-modal');
    modal.style.display = 'none';
}

// Save client (add new or update existing)
function saveClient() {
    const form = document.getElementById('client-form');
    const mode = form.getAttribute('data-mode');
    
    const clientData = {
        name: document.getElementById('client-name').value,
        type: document.getElementById('client-company').value,
        email: document.getElementById('client-email').value,
        phone: document.getElementById('client-phone').value,
        address: document.getElementById('client-address').value
    };
    
    if (mode === 'add') {
        // Add new client
        addClient(clientData);
    } else {
        // Update existing client
        const clientId = parseInt(form.getAttribute('data-id'));
        updateClient(clientId, clientData);
    }
    
    // Close modal and reload list
    closeClientModal();
    loadClientsList();
}

// Update existing client
function updateClient(clientId, clientData) {
    const clientIndex = clients.findIndex(client => client.id === clientId);
    if (clientIndex !== -1) {
        clients[clientIndex] = { 
            ...clients[clientIndex], 
            ...clientData 
        };
        
        addActivity({
            type: "client_updated",
            description: `Client '${clientData.name}' updated`
        });
    }
}

// Delete client
function deleteClient(clientId) {
    const clientIndex = clients.findIndex(client => client.id === clientId);
    if (clientIndex !== -1) {
        const clientName = clients[clientIndex].name;
        
        // Check if client has orders
        const clientOrders = orders.filter(order => order.clientId === clientId);
        if (clientOrders.length > 0) {
            alert(`Cannot delete client "${clientName}" because they have ${clientOrders.length} orders.`);
            return;
        }
        
        // Remove client
        clients.splice(clientIndex, 1);
        
        addActivity({
            type: "client_deleted",
            description: `Client '${clientName}' deleted`
        });
        
        // Reload list
        loadClientsList();
    }
}
