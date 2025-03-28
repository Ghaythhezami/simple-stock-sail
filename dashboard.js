
// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update dashboard statistics
    document.getElementById('dash-total-items').textContent = getTotalProductsCount();
    document.getElementById('dash-total-value').textContent = `$${getTotalInventoryValue()}`;
    document.getElementById('dash-total-orders').textContent = getTotalOrdersCount();
    document.getElementById('dash-total-clients').textContent = getTotalClientsCount();
    
    // Display recent activities
    displayRecentActivities();
    
    // Display low stock items
    displayLowStockItems();
});

// Display recent activities in the dashboard
function displayRecentActivities() {
    const activitiesContainer = document.getElementById('recent-activities');
    
    // Clear no data message if present
    activitiesContainer.innerHTML = '';
    
    if (activities.length === 0) {
        activitiesContainer.innerHTML = '<p class="no-data-message">No recent activities</p>';
        return;
    }
    
    // Get only the 5 most recent activities
    const recentActivities = activities.slice(0, 5);
    
    // Create HTML for each activity
    recentActivities.forEach(activity => {
        const activityEl = document.createElement('div');
        activityEl.className = 'activity-item';
        
        const activityClass = getActivityClass(activity.type);
        
        activityEl.innerHTML = `
            <div class="activity-icon ${activityClass}"></div>
            <div class="activity-details">
                <span class="activity-date">${activity.date}</span>
                <span class="activity-desc">${activity.description}</span>
            </div>
        `;
        
        activitiesContainer.appendChild(activityEl);
    });
}

// Get CSS class for activity type
function getActivityClass(type) {
    switch(true) {
        case type.includes('order_created'):
            return 'activity-order';
        case type.includes('order_validated'):
            return 'activity-success';
        case type.includes('order_cancelled'):
            return 'activity-danger';
        case type.includes('client'):
            return 'activity-client';
        case type.includes('commercial'):
            return 'activity-commercial';
        case type.includes('stock'):
            return 'activity-stock';
        default:
            return 'activity-info';
    }
}

// Display low stock items in the dashboard
function displayLowStockItems() {
    const lowStockContainer = document.getElementById('low-stock-items');
    
    // Clear no data message if present
    lowStockContainer.innerHTML = '';
    
    const lowStockItems = getLowStockItems();
    
    if (lowStockItems.length === 0) {
        lowStockContainer.innerHTML = '<p class="no-data-message">No low stock items</p>';
        return;
    }
    
    // Create HTML for each low stock item
    lowStockItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'low-stock-item';
        
        itemEl.innerHTML = `
            <span class="item-name">${item.name}</span>
            <span class="item-location">${item.location}</span>
            <span class="item-quantity">${item.quantity}</span>
        `;
        
        lowStockContainer.appendChild(itemEl);
    });
}
