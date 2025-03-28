
// Initialize stock items from local storage or empty array if none exists
let stockItems = JSON.parse(localStorage.getItem('stockItems')) || [];
let currentItemIndex = -1;

// DOM Elements
const stockForm = document.getElementById('stock-form');
const itemNameInput = document.getElementById('item-name');
const itemCategoryInput = document.getElementById('item-category');
const itemQuantityInput = document.getElementById('item-quantity');
const itemPriceInput = document.getElementById('item-price');
const addButton = document.getElementById('add-button');
const updateButton = document.getElementById('update-button');
const cancelButton = document.getElementById('cancel-button');
const inventoryBody = document.getElementById('inventory-body');
const noItemsMessage = document.getElementById('no-items-message');
const totalItemsElement = document.getElementById('total-items');
const totalValueElement = document.getElementById('total-value');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const categoryFilter = document.getElementById('category-filter');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load and display inventory
    renderInventory();
    
    // Add event listeners
    stockForm.addEventListener('submit', handleFormSubmit);
    updateButton.addEventListener('click', handleUpdateClick);
    cancelButton.addEventListener('click', resetForm);
    searchButton.addEventListener('click', filterInventory);
    searchInput.addEventListener('keyup', filterInventory);
    categoryFilter.addEventListener('change', filterInventory);
});

// Function to handle form submission (add new item)
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = itemNameInput.value.trim();
    const category = itemCategoryInput.value;
    const quantity = parseInt(itemQuantityInput.value);
    const price = parseFloat(itemPriceInput.value);
    
    // Create new item object
    const newItem = {
        id: Date.now(), // Simple unique ID
        name: name,
        category: category,
        quantity: quantity,
        price: price,
        totalValue: quantity * price
    };
    
    // Add to stock items array
    stockItems.push(newItem);
    
    // Save to local storage
    saveToLocalStorage();
    
    // Update the UI
    renderInventory();
    
    // Reset the form
    stockForm.reset();
    
    // Show success message
    alert('Item added successfully!');
}

// Function to handle update click
function handleUpdateClick() {
    if (currentItemIndex === -1) return;
    
    // Get form values
    const name = itemNameInput.value.trim();
    const category = itemCategoryInput.value;
    const quantity = parseInt(itemQuantityInput.value);
    const price = parseFloat(itemPriceInput.value);
    
    // Update item
    stockItems[currentItemIndex].name = name;
    stockItems[currentItemIndex].category = category;
    stockItems[currentItemIndex].quantity = quantity;
    stockItems[currentItemIndex].price = price;
    stockItems[currentItemIndex].totalValue = quantity * price;
    
    // Save to local storage
    saveToLocalStorage();
    
    // Update the UI
    renderInventory();
    
    // Reset the form and state
    resetForm();
    
    // Show success message
    alert('Item updated successfully!');
}

// Function to save items to local storage
function saveToLocalStorage() {
    localStorage.setItem('stockItems', JSON.stringify(stockItems));
}

// Function to render inventory
function renderInventory(filteredItems) {
    const items = filteredItems || stockItems;
    
    // Clear existing rows
    inventoryBody.innerHTML = '';
    
    // Show/hide no items message
    if (items.length === 0) {
        noItemsMessage.style.display = 'block';
        inventoryBody.style.display = 'none';
    } else {
        noItemsMessage.style.display = 'none';
        inventoryBody.style.display = 'table-row-group';
        
        // Create rows for each item
        items.forEach((item, index) => {
            const row = document.createElement('tr');
            
            // Format price and total value with 2 decimal places
            const formattedPrice = formatCurrency(item.price);
            const formattedTotal = formatCurrency(item.totalValue);
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${capitalizeFirstLetter(item.category)}</td>
                <td>${item.quantity}</td>
                <td>${formattedPrice}</td>
                <td>${formattedTotal}</td>
                <td class="action-buttons">
                    <button class="edit-btn" data-index="${stockItems.indexOf(item)}">Edit</button>
                    <button class="delete-btn" data-index="${stockItems.indexOf(item)}">Delete</button>
                </td>
            `;
            
            inventoryBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        addActionButtonListeners();
    }
    
    // Update inventory statistics
    updateInventoryStats(items);
}

// Function to update inventory statistics
function updateInventoryStats(items) {
    const itemCount = items.length;
    const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);
    
    totalItemsElement.textContent = itemCount;
    totalValueElement.textContent = formatCurrency(totalValue);
}

// Function to add event listeners to action buttons
function addActionButtonListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            editItem(index);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            deleteItem(index);
        });
    });
}

// Function to edit an item
function editItem(index) {
    const item = stockItems[index];
    
    // Populate the form with item values
    itemNameInput.value = item.name;
    itemCategoryInput.value = item.category;
    itemQuantityInput.value = item.quantity;
    itemPriceInput.value = item.price;
    
    // Update UI to show we're in edit mode
    addButton.disabled = true;
    updateButton.disabled = false;
    
    // Store the current item index
    currentItemIndex = index;
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Function to delete an item
function deleteItem(index) {
    if (confirm('Are you sure you want to delete this item?')) {
        stockItems.splice(index, 1);
        saveToLocalStorage();
        renderInventory();
        
        // Reset form if we were editing the deleted item
        if (currentItemIndex === index) {
            resetForm();
        }
    }
}

// Function to reset the form and form state
function resetForm() {
    stockForm.reset();
    addButton.disabled = false;
    updateButton.disabled = true;
    currentItemIndex = -1;
}

// Function to filter inventory based on search term and category
function filterInventory() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const categoryValue = categoryFilter.value;
    
    // Filter items based on search term and selected category
    const filteredItems = stockItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryValue === 'all' || item.category === categoryValue;
        
        return matchesSearch && matchesCategory;
    });
    
    // Render the filtered inventory
    renderInventory(filteredItems);
}

// Utility function to format currency
function formatCurrency(value) {
    return '$' + value.toFixed(2);
}

// Utility function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
