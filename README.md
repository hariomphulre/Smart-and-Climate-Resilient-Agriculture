# 🌾 SmartAgri: Satellite-Powered Precision Farming Platform

<!-- Logo/Banner will be added before submission -->

### "Empowering Farmers Through Earth Observation & AI"

---

## 🌟 Project Overview

**SmartAgri** is an innovative precision agriculture platform that bridges the gap between advanced satellite technology and practical farming needs. Our solution democratizes access to Earth Observation data for farmers, providing actionable insights to improve crop yields, optimize resource usage, and build climate resilience.

### 🎯 Problem Statement

Indian farmers face significant challenges:
- **Limited access** to advanced agricultural technologies
- **Inefficient resource management** leading to wasted water, fertilizer and pesticides
- **Climate unpredictability** affecting crop planning and yields
- **Information gap** between government agricultural schemes and farmers
- **Financial vulnerability** due to crop failures and market fluctuations

### 💡 Our Solution

SmartAgri transforms satellite data into practical, farm-specific insights delivered through an intuitive dashboard that works on any device. Our platform helps farmers:
- **Make data-driven decisions** about when to irrigate, fertilize, or harvest
- **Detect early signs** of crop stress, disease, and pest infestations
- **Optimize resource usage** to reduce costs and environmental impact
- **Access financial aid** opportunities from government and private sources
- **Build climate resilience** through better planning and risk management

---

## ✨ Key Features

### 🌐 Field Management
- **Interactive Field Mapping**: Polygon-based field creation with GPS coordinates
- **Multi-field Management**: Track and analyze multiple parcels of land
- **Real-time Synchronization**: Field boundaries connect directly to satellite data processing

### 📊 Climate & Vegetation Analytics
- **Comprehensive Vegetation Indices**: NDVI, EVI, NDWI, NDMI, NDRE, CRI1, PSRI, GCI
- **Weather Analysis**: Temperature trends, precipitation patterns, and forecasts
- **Soil Analysis**: Composition analysis, nutrient levels, pH readings
- **Water Resource Management**: Soil moisture, irrigation planning, water stress detection

### 🌱 Crop Management
- **Lifecycle Tracking**: Monitor crops from planting to harvest
- **Inventory Management**: Track seed, fertilizer, and harvested crop storage
- **Growth Stage Analysis**: Visualize crop development progress
- **Yield Prediction**: Early estimates based on growth patterns and historical data

### 💰 Financial Aid Integration
- **Scheme Eligibility Finder**: Personalized government program recommendations
- **Subsidy Navigator**: Available agricultural subsidies based on location and crop
- **Loan Finder**: Agricultural loan options from banks and financial institutions
- **Application Support**: Step-by-step assistance for financial program applications
- **Notification Center**: Timely updates on application deadlines and new programs

### 🤖 AI Assistant
- **Natural Language Interface**: Ask farming questions in plain language
- **Contextual Awareness**: Recommendations based on your specific fields and crops
- **Problem Diagnosis**: Identify potential issues from descriptions or images
- **Knowledge Repository**: Access farming best practices and research findings

---

## 🛠️ Technical Architecture

### 🧩 System Components
```
┌────────────────┐     ┌──────────────────┐     ┌────────────────┐
│   Frontend     │◄────┤     Backend      │◄────┤ Earth Engine   │
│   (React.js)   │─────►     (Node.js)    │─────►  Processing    │
└────────────────┘     └──────────────────┘     └────────────────┘
```

### 🌟 Frontend
- **React.js** with Hooks and Context API for state management
- **Tailwind CSS** for responsive, mobile-first design
- **Chart.js** for interactive data visualization
- **React Router** for seamless navigation between features

### ⚙️ Backend
- **Node.js** with Express for RESTful API
- **JSON-based storage** for field coordinates and user preferences
- **Coordinate transformation** for satellite data processing

### 🛰️ Earth Observation Integration
- **Google Earth Engine** for satellite imagery processing:
  - Sentinel-2 multispectral imagery (10m resolution)
  - Historical data analysis (2017-present)
  - Custom vegetation indices calculations
  - Python-based data export pipeline

### 📈 Data Processing Pipeline
1. **Field Selection** → Creates boundary polygon
2. **Coordinate Transformation** → Prepares for Earth Engine ingestion
3. **Index Calculation** → Processes vegetation indices (NDVI, EVI, etc.)
4. **Time Series Analysis** → Tracks changes over growing seasons
5. **Visualization** → Transforms data into actionable insights

---

## 🌱 Innovation Highlights

### 1️⃣ Democratizing Satellite Technology
We've simplified complex Earth observation data processing into an intuitive interface accessible to farmers with basic smartphones, bridging the technological divide in rural agriculture.

### 2️⃣ Multi-Index Vegetation Analysis
Unlike systems that rely solely on NDVI, our platform calculates 8+ specialized vegetation indices to provide a comprehensive view of crop health and stress factors:
- **NDVI**: General vegetation health
- **EVI**: Enhanced sensitivity in high-biomass regions
- **NDWI/NDMI**: Water content in vegetation
- **NDRE**: Nitrogen content estimation
- **CRI1**: Carotenoid content for stress detection
- **PSRI**: Plant senescence monitoring
- **GCI**: Chlorophyll content estimation

### 3️⃣ Unified Financial Aid Hub
We've consolidated fragmented information about agricultural subsidies, loans, and government schemes into a personalized recommendation engine that matches farmers with appropriate financial support based on their specific circumstances.

### 4️⃣ Field-Specific Data Processing
Instead of generic regional data, our platform processes satellite imagery for each individual field boundary, providing truly personalized insights at the farm level.

### 5️⃣ Full-Spectrum Agricultural Platform
Rather than focusing on a single aspect, SmartAgri integrates climate analysis, crop management, field mapping, and financial support into a unified platform addressing the full spectrum of farming needs.

---

## 🔍 Technical Implementation

### Google Earth Engine Integration
```python
# NDVI Calculation Example
def getNDVI(image):
    ndvi = image.normalizedDifference(['B8', 'B4']).rename('ndvi')
    return ndvi.copyProperties(image, ['system:time_start'])

# Map function over image collection
ndvi_series = sentinel2Collection.map(getNDVI)
```

### API Architecture
```javascript
// Field coordinate processing endpoint
app.post('/api/update-manipal', (req, res) => {
  try {
    const { fieldId } = req.body;
    // Transform field coordinates for satellite processing
    const manipalCoordinates = {};
    fieldData.coordinates.forEach((coord, index) => {
      manipalCoordinates[(index + 1).toString()] = [coord.lng, coord.lat];
    });
    // Write coordinates to processing file
    fs.writeFileSync(manipalPath, JSON.stringify(manipalCoordinates, null, 2));
    return res.status(200).json({
      success: true,
      message: 'Coordinates updated successfully',
      coordinates: manipalCoordinates
    });
  } catch (error) {
    console.error('Error updating coordinates:', error);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`
    });
  }
});
```

### Context-based State Management
```jsx
// Custom setter to update both UI and satellite processing coordinates
const handleSetSelectedField = (fieldId) => {
  setSelectedField(fieldId);
  
  // Update processing coordinates when field changes
  if (fieldId) {
    updateManipalCoordinates(fieldId)
      .then(result => {
        if (!result.success) {
          console.warn('Failed to update coordinates:', result.message);
        }
      })
      .catch(error => {
        console.error('Error updating coordinates:', error);
      });
  }
};
```

---

## 🌍 Impact & Sustainability

### Economic Impact
- **Cost Reduction**: 15-30% potential reduction in water and fertilizer usage
- **Yield Improvement**: 7-15% potential yield improvement through optimized resource timing
- **Financial Access**: Connecting farmers to ₹10,000+ crore in underutilized agricultural subsidies

### Environmental Sustainability
- **Water Conservation**: Optimized irrigation reduces water waste
- **Reduced Chemical Use**: Targeted application of fertilizers and pesticides
- **Climate Resilience**: Better planning for changing weather patterns
- **Sustainable Practices**: Promoting soil health and biodiversity

### Scalability
- **Technology Stack**: Cloud-based architecture allows easy scaling
- **Minimal Infrastructure**: Accessible via smartphones without special equipment
- **Knowledge Transfer**: Built-in educational components to overcome adoption barriers
- **Adaptable Design**: Works with various crop types and farming methods

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Python 3.7+ (for Earth Engine scripts)
- Google Earth Engine account (for satellite data processing)

### Quick Start
1. **Clone the repository:**
   ```bash
   git clone https://github.com/sujal-pawar/SmartAgri.git
   cd SmartAgri
   ```

2. **Set up the backend:**
   ```bash
   cd server
   npm install
   ```

3. **Set up the frontend:**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the development environment:**
   ```bash
   # Terminal 1: Start the backend server
   cd server
   node server.js
   
   # Terminal 2: Start the frontend development server
   cd client
   npm run dev
   ```

5. **Access the application:**
   Open your browser and navigate to http://localhost:5173

---
