
// Sample data for the Stock Management System

// Products data with stock by depot and price by client type
const products = [
    {
        id: 1,
        name: "Makrouna Plume",
        stock: {
            "Tunis": 500,
            "Sousse": 300,
            "Sfax": 400
        },
        prices: {
            "Gros": 1.200,
            "Grand Surface": 1.300,
            "Restaurant": 1.400,
            "Personnel": 1.500
        }
    },
    {
        id: 2,
        name: "Makrouna Spaghetti",
        stock: {
            "Tunis": 600,
            "Sousse": 350,
            "Sfax": 450
        },
        prices: {
            "Gros": 1.100,
            "Grand Surface": 1.250,
            "Restaurant": 1.350,
            "Personnel": 1.450
        }
    },
    {
        id: 3,
        name: "Makrouna Papillon",
        stock: {
            "Tunis": 450,
            "Sousse": 250,
            "Sfax": 380
        },
        prices: {
            "Gros": 1.300,
            "Grand Surface": 1.400,
            "Restaurant": 1.500,
            "Personnel": 1.600
        }
    },
    {
        id: 4,
        name: "Makrouna Coquillette",
        stock: {
            "Tunis": 520,
            "Sousse": 330,
            "Sfax": 410
        },
        prices: {
            "Gros": 1.250,
            "Grand Surface": 1.350,
            "Restaurant": 1.450,
            "Personnel": 1.550
        }
    },
    {
        id: 5,
        name: "Makrouna Torti",
        stock: {
            "Tunis": 480,
            "Sousse": 290,
            "Sfax": 390
        },
        prices: {
            "Gros": 1.150,
            "Grand Surface": 1.300,
            "Restaurant": 1.400,
            "Personnel": 1.500
        }
    }
];

// Clients data by type
const clients = [
    {
        id: 1,
        name: "Carrefour",
        type: "Grand Surface",
        email: "contact@carrefour.tn",
        phone: "+216 71 123 456",
        address: "Avenue Habib Bourguiba, Tunis"
    },
    {
        id: 2,
        name: "Monoprix",
        type: "Grand Surface",
        email: "contact@monoprix.tn",
        phone: "+216 71 234 567",
        address: "Rue de Marseille, Tunis"
    },
    {
        id: 3,
        name: "Magasin Général",
        type: "Gros",
        email: "contact@mg.tn",
        phone: "+216 73 345 678",
        address: "Avenue Habib Thameur, Sousse"
    },
    {
        id: 4,
        name: "Restaurant Dar El Jeld",
        type: "Restaurant",
        email: "info@dareljeld.tn",
        phone: "+216 74 456 789",
        address: "Médina de Tunis"
    },
    {
        id: 5,
        name: "Restaurant Le Baroque",
        type: "Restaurant",
        email: "contact@lebaroque.tn",
        phone: "+216 74 567 890",
        address: "La Marsa, Tunis"
    },
    {
        id: 6,
        name: "Grossiste Ben Ali",
        type: "Gros",
        email: "contact@benali.tn",
        phone: "+216 75 678 901",
        address: "Rue Ibn Khaldoun, Sfax"
    },
    {
        id: 7,
        name: "Ahmed Trabelsi",
        type: "Personnel",
        email: "ahmed.trabelsi@gmail.com",
        phone: "+216 20 123 456",
        address: "Avenue Habib Bourguiba, Sousse"
    }
];

// Commercial agents data
const commercials = [
    {
        id: 1,
        name: "Ali Ben Salah",
        email: "ali.bensalah@company.tn",
        phone: "+216 22 111 222",
        territory: "Tunis",
        specialization: "Gros"
    },
    {
        id: 2,
        name: "Khaled Jebali",
        email: "khaled.jebali@company.tn",
        phone: "+216 22 333 444",
        territory: "Sousse",
        specialization: "Grand Surface"
    },
    {
        id: 3,
        name: "Hassen Trabelsi",
        email: "hassen.trabelsi@company.tn",
        phone: "+216 22 555 666",
        territory: "Sfax",
        specialization: "Restaurant"
    },
    {
        id: 4,
        name: "Meriem Bouzid",
        email: "meriem.bouzid@company.tn",
        phone: "+216 22 777 888",
        territory: "Tunis",
        specialization: "Personnel"
    }
];

// Sample orders data
const orders = [
    {
        id: 1,
        date: "2023-06-15",
        clientId: 1,
        commercialId: 2,
        products: [
            { productId: 1, quantity: 100, unitPrice: 1.300 },
            { productId: 3, quantity: 50, unitPrice: 1.400 }
        ],
        status: "validated",
        totalValue: 200.00
    },
    {
        id: 2,
        date: "2023-06-18",
        clientId: 3,
        commercialId: 1,
        products: [
            { productId: 2, quantity: 200, unitPrice: 1.100 },
            { productId: 5, quantity: 150, unitPrice: 1.150 }
        ],
        status: "pending",
        totalValue: 392.50
    }
];

// Activities log
const activities = [
    {
        id: 1,
        date: "2023-06-15",
        type: "order_created",
        description: "New order #1 created for Carrefour"
    },
    {
        id: 2,
        date: "2023-06-15",
        type: "order_validated",
        description: "Order #1 has been validated"
    },
    {
        id: 3,
        date: "2023-06-18",
        type: "order_created",
        description: "New order #2 created for Magasin Général"
    },
    {
        id: 4,
        date: "2023-06-19",
        type: "client_added",
        description: "New client 'Restaurant Le Baroque' added"
    },
    {
        id: 5,
        date: "2023-06-20",
        type: "stock_updated",
        description: "Stock updated for Makrouna Plume in Tunis depot"
    }
];

// Get client by ID
function getClientById(id) {
    return clients.find(client => client.id === id);
}

// Get commercial by ID
function getCommercialById(id) {
    return commercials.find(commercial => commercial.id === id);
}

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Get order by ID
function getOrderById(id) {
    return orders.find(order => order.id === id);
}

// Low stock items (for dashboard)
function getLowStockItems() {
    const lowStockItems = [];
    products.forEach(product => {
        Object.entries(product.stock).forEach(([location, quantity]) => {
            if (quantity < 300) {
                lowStockItems.push({
                    id: product.id,
                    name: product.name,
                    location,
                    quantity
                });
            }
        });
    });
    return lowStockItems;
}

// Add new order and update activities
function addOrder(order) {
    // Generate new ID
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    
    // Create new order object
    const newOrder = {
        id: newId,
        date: new Date().toISOString().split('T')[0],
        clientId: parseInt(order.clientId),
        commercialId: parseInt(order.commercialId),
        products: order.products.map(p => ({
            productId: parseInt(p.productId),
            quantity: parseInt(p.quantity),
            unitPrice: parseFloat(p.unitPrice)
        })),
        status: "pending",
        totalValue: calculateOrderTotal(order.products)
    };
    
    // Add to orders array
    orders.push(newOrder);
    
    // Add activity
    const client = getClientById(newOrder.clientId);
    addActivity({
        type: "order_created",
        description: `New order #${newId} created for ${client.name}`
    });
    
    return newOrder;
}

// Calculate order total
function calculateOrderTotal(orderProducts) {
    return orderProducts.reduce((total, item) => {
        return total + (parseFloat(item.unitPrice) * parseInt(item.quantity));
    }, 0);
}

// Add new client
function addClient(client) {
    // Generate new ID
    const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
    
    // Create new client object
    const newClient = {
        id: newId,
        name: client.name,
        type: client.type || "Personnel",
        email: client.email,
        phone: client.phone,
        address: client.address
    };
    
    // Add to clients array
    clients.push(newClient);
    
    // Add activity
    addActivity({
        type: "client_added",
        description: `New client '${newClient.name}' added`
    });
    
    return newClient;
}

// Add new commercial
function addCommercial(commercial) {
    // Generate new ID
    const newId = commercials.length > 0 ? Math.max(...commercials.map(c => c.id)) + 1 : 1;
    
    // Create new commercial object
    const newCommercial = {
        id: newId,
        name: commercial.name,
        email: commercial.email,
        phone: commercial.phone,
        territory: commercial.territory,
        specialization: commercial.specialization
    };
    
    // Add to commercials array
    commercials.push(newCommercial);
    
    // Add activity
    addActivity({
        type: "commercial_added",
        description: `New commercial agent '${newCommercial.name}' added`
    });
    
    return newCommercial;
}

// Add activity
function addActivity(activity) {
    // Generate new ID
    const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
    
    // Create new activity object
    const newActivity = {
        id: newId,
        date: new Date().toISOString().split('T')[0],
        type: activity.type,
        description: activity.description
    };
    
    // Add to activities array
    activities.unshift(newActivity);
    
    return newActivity;
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    const order = getOrderById(parseInt(orderId));
    if (order) {
        order.status = newStatus;
        
        const client = getClientById(order.clientId);
        addActivity({
            type: `order_${newStatus}`,
            description: `Order #${orderId} has been ${newStatus} for ${client.name}`
        });
        
        return true;
    }
    return false;
}

// Get total orders count
function getTotalOrdersCount() {
    return orders.length;
}

// Get total clients count
function getTotalClientsCount() {
    return clients.length;
}

// Get total products count
function getTotalProductsCount() {
    return products.length;
}

// Get total inventory value
function getTotalInventoryValue() {
    let totalValue = 0;
    products.forEach(product => {
        const totalStock = Object.values(product.stock).reduce((sum, qty) => sum + qty, 0);
        // Use average price for calculation
        const avgPrice = Object.values(product.prices).reduce((sum, price) => sum + price, 0) / 
                        Object.values(product.prices).length;
        totalValue += totalStock * avgPrice;
    });
    return totalValue.toFixed(2);
}
