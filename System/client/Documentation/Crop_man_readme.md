
This document outlines the frontend implementation of the Crop Management feature for the SmartAgri application. The feature consists of two main components:

1. **Crop Lifecycle Tracking** - Track crops from sowing to harvest
2. **Inventory Management** - Manage harvested crop inventory

## Features Implemented

### 1. Crop Lifecycle Tracking
- **Track New Crops**: Add crops with variety, sowing date, expected harvest date, and area
- **Stage Progress**: Visual timeline showing crop growth stages
- **Status Monitoring**: Health status indicators (Healthy, Attention, Critical)
- **Timeline View**: Detailed growth stage timeline with completion status
- **Progress Calculation**: Automatic progress calculation based on time elapsed
- **Notes System**: Add and view notes for each crop

#### Crop Stages Supported:
- **Wheat**: Seed Preparation → Sowing → Germination → Tillering → Jointing → Booting → Flowering → Grain Filling → Maturity → Harvest Ready
- **Rice**: Seed Preparation → Sowing → Germination → Vegetative Growth → Reproductive Phase → Flowering → Grain Filling → Maturity → Harvest Ready
- **Corn**: Seed Preparation → Planting → Emergence → Vegetative Growth → Tasseling → Silking → Grain Filling → Maturity → Harvest Ready

### 2. Inventory Management
- **Add Inventory Items**: Record harvested crops with quantity, quality, storage location
- **Quality Grading**: Premium, Grade A, Grade B, Standard classifications
- **Market Price Tracking**: Current market price per unit
- **Value Calculation**: Automatic value calculation based on quantity and price
- **Status Management**: Available, Low Stock, Reserved, Sold status tracking
- **Search & Filter**: Search by crop name/variety and filter by status
- **Export Functionality**: Export inventory reports (UI ready)

## Component Architecture

### CropManagement.jsx
- Main container component
- Tab navigation between Lifecycle and Inventory
- Route integration

### CropLifecycleTracking.jsx
- Crop tracking functionality
- Add/Edit/View crop modals
- Progress visualization
- Timeline display

### InventoryManagement.jsx
- Inventory table and management
- Search and filter functionality
- Add/Edit/Delete inventory items
- Value calculations

## Data Structures

### Crop Lifecycle Object
```javascript
{
  id: 1,
  name: "Wheat",
  variety: "HD-2967",
  sowingDate: "2024-11-15",
  expectedHarvest: "2025-04-15",
  currentStage: "Vegetative Growth",
  progress: 35,
  area: "2.5 acres",
  status: "healthy", // "healthy", "attention", "critical"
  notes: "Crop is growing well, regular watering maintained."
}
```

### Inventory Object
```javascript
{
  id: 1,
  cropName: "Wheat",
  variety: "HD-2967",
  quantity: 450,
  unit: "kg", // "kg", "tons", "quintals", "bags"
  harvestDate: "2024-04-10",
  quality: "Grade A", // "Premium", "Grade A", "Grade B", "Standard"
  storageLocation: "Warehouse 1",
  estimatedValue: 18000,
  marketPrice: 2500,
  expiryDate: "2025-04-10",
  status: "available" // "available", "low-stock", "reserved", "sold"
}
```

## Backend Integration Requirements

### Required API Endpoints

#### Crop Lifecycle APIs
- `GET /api/crops/lifecycle` - Get all tracked crops
- `POST /api/crops/lifecycle` - Add new crop to tracking
- `PUT /api/crops/lifecycle/:id` - Update crop stage/status
- `DELETE /api/crops/lifecycle/:id` - Remove crop from tracking

#### Inventory APIs
- `GET /api/inventory` - Get inventory items (with optional filters)
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

### Database Schema Recommendations

#### crops table
```sql
CREATE TABLE crops (
  id INT PRIMARY KEY AUTO_INCREMENT,
  farmer_id VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  variety VARCHAR(100) NOT NULL,
  sowing_date DATE NOT NULL,
  expected_harvest DATE NOT NULL,
  current_stage VARCHAR(100) NOT NULL,
  progress INT DEFAULT 0,
  area DECIMAL(10,2) NOT NULL,
  status ENUM('healthy', 'attention', 'critical') DEFAULT 'healthy',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### inventory table
```sql
CREATE TABLE inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  farmer_id VARCHAR(255) NOT NULL,
  crop_name VARCHAR(100) NOT NULL,
  variety VARCHAR(100) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit ENUM('kg', 'tons', 'quintals', 'bags') NOT NULL,
  harvest_date DATE NOT NULL,
  quality ENUM('Premium', 'Grade A', 'Grade B', 'Standard') NOT NULL,
  storage_location VARCHAR(255) NOT NULL,
  estimated_value DECIMAL(12,2) NOT NULL,
  market_price DECIMAL(10,2) NOT NULL,
  expiry_date DATE,
  status ENUM('available', 'low-stock', 'reserved', 'sold') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Routing Configuration

Add these routes to your application:

```javascript
// App.jsx
<Route path="/crop-planning" element={<CropManagement />} />
<Route path="/crop-health" element={<CropManagement />} />
```

The sidebar navigation is already configured to support these routes.

## UI Features

### Visual Elements
- **Progress Bars**: Visual representation of crop growth progress
- **Status Indicators**: Color-coded status badges for health monitoring
- **Timeline View**: Step-by-step growth stage visualization
- **Summary Cards**: Quick stats overview (total crops, inventory value, etc.)
- **Modal Forms**: User-friendly forms for adding/editing data
- **Search & Filter**: Real-time search and status filtering

### Responsive Design
- Mobile-friendly layout
- Collapsible sidebar navigation
- Responsive tables and cards
- Touch-friendly buttons and interactions

## Authentication

The service file includes authentication token handling:
```javascript
'Authorization': `Bearer ${localStorage.getItem('token')}`
```

Ensure your backend validates these tokens and returns user-specific data.

## Error Handling

All API calls include error handling and user-friendly error messages. Backend should return appropriate HTTP status codes and error messages.

## Future Enhancements

Potential features that can be added:
1. **Weather Integration**: Link crop stages with weather data
2. **Market Price API**: Real-time market price updates
3. **Notifications**: Alerts for stage transitions and harvest dates
4. **Analytics**: Crop performance analytics and insights
5. **Export Reports**: PDF/Excel export functionality
6. **Photo Documentation**: Add photos for each crop stage
7. **Pest & Disease Tracking**: Integration with pest detection features

## Testing

The components use sample data for demonstration. Replace with actual API calls when backend is ready.

## Dependencies

Make sure these packages are installed:
- `@fortawesome/react-fontawesome`
- `@fortawesome/free-solid-svg-icons`
- `react-router-dom`

## Getting Started

1. The crop management feature is accessible via the sidebar navigation
2. Navigate to "Crop Management" → "Crop Planning" or "Health Monitoring"
3. Both routes lead to the same component with tab navigation
4. Sample data is pre-loaded for demonstration purposes

For backend developers: Refer to `cropManagementService.js` for detailed API specifications and data structures.
