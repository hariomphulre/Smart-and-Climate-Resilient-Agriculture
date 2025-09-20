const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'], // Allow requests from various development URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Configure multer for image uploads with plant name-based storage
const diseaseUploadDir = path.join(__dirname, 'crop_imgs', 'disease');
const diseaseResultsDir = path.join(__dirname, 'detect_results', 'disease');

// Ensure folders exist
if (!fs.existsSync(diseaseUploadDir)) fs.mkdirSync(diseaseUploadDir, { recursive: true });
if (!fs.existsSync(diseaseResultsDir)) fs.mkdirSync(diseaseResultsDir, { recursive: true });

// Multer diskStorage - use temporary filename first
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, diseaseUploadDir);
  },
  filename: (req, file, cb) => {
    // Use temporary filename with timestamp
    const tempName = `temp_${Date.now()}.png`;
    cb(null, tempName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Serve static files for detection results
app.use('/detect_results', express.static(path.join(__dirname, 'detect_results')));
app.use('/crop_imgs', express.static(path.join(__dirname, 'crop_imgs')));

// Create directory for field coordinates if it doesn't exist
const fieldCoordsDir = path.join(__dirname, 'Field_co-ordinates');
if (!fs.existsSync(fieldCoordsDir)) {
  fs.mkdirSync(fieldCoordsDir, { recursive: true });
}

// Directory for disease detection results is already created above

// API endpoint for plant disease detection
app.post('/api/upload-disease-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    // Get plant name from request body
    const plantName = req.body.plantName || 'unknown_plant';
    const sanitizedPlantName = plantName.toLowerCase().replace(/\s+/g, '_');
    
    // Create the final filename with plant name
    const finalFilename = `${sanitizedPlantName}.png`;
    const finalPath = path.join(diseaseUploadDir, finalFilename);
    
    // Rename the temporary file to the plant name
    fs.renameSync(req.file.path, finalPath);
    
    console.log(`Image uploaded and renamed successfully: ${finalPath}`);

    // Create result filename with plant name
    const resultFilename = `${sanitizedPlantName}.png`;
    const resultImagePath = path.join(diseaseResultsDir, resultFilename);

    // Simulate disease detection processing
    setTimeout(() => {
      try {
        // Copy uploaded image to result path as demo processed output
        fs.copyFileSync(finalPath, resultImagePath);
        console.log('Disease detection completed, result saved to:', resultImagePath);
      } catch (error) {
        console.error('Error creating result image:', error);
      }
    }, 1000);

    const mockDiseaseInfo = {
      name: 'Analysis Complete',
      description: 'The leaf image has been processed successfully. Check the result image for detailed analysis.',
      treatment: 'Based on the analysis, consider the following: 1) Ensure proper watering schedule, 2) Check for pest infestation, 3) Apply appropriate organic fungicides if needed, 4) Maintain proper soil nutrition levels.',
      confidence: '87%'
    };

    return res.status(200).json({
      success: true,
      message: 'Image uploaded and analyzed successfully',
      diseaseInfo: mockDiseaseInfo,
      resultImagePath: `/detect_results/disease/${resultFilename}`,
      uploadedAs: finalFilename
    });

  } catch (error) {
    console.error('Error processing disease detection:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during disease detection: ' + error.message
    });
  }
});

// API endpoint to save field coordinates
app.post('/api/fields', (req, res) => {
  try {
    console.log('Received field data request:', req.body);
    const fieldData = req.body;
    
    // Validate required fields
    if (!fieldData.name || !fieldData.location || !fieldData.crop || !fieldData.coordinates || fieldData.coordinates.length < 3) {
      console.log('Validation failed:', { 
        name: !!fieldData.name, 
        location: !!fieldData.location, 
        crop: !!fieldData.crop,
        coordinates: fieldData.coordinates ? fieldData.coordinates.length : 0 
      });
      
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid field data. Name, location, crop, and at least 3 coordinates are required.' 
      });
    }
    
    // Create a filename based on field name with unique ID
    const sanitizedName = fieldData.name.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
    const filename = `${sanitizedName}_${fieldData.id}.json`;
    const filePath = path.join(fieldCoordsDir, filename);
    
    console.log('Saving field data to:', filePath);
    
    // Write the field data to a JSON file
    fs.writeFileSync(filePath, JSON.stringify(fieldData, null, 2));
    console.log('Field data saved successfully');
    
    return res.status(201).json({
      success: true,
      message: 'Field data saved successfully',
      filename: filename
    });
    
  } catch (error) {
    console.error('Error saving field data:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Server error while saving field data: ${error.message}`
    });
  }
});

// API endpoint to get all saved fields
app.get('/api/fields', (req, res) => {
  try {
    const files = fs.readdirSync(fieldCoordsDir);
    
    // Read each JSON file and extract field data
    const fields = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(fieldCoordsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
      });
    
    return res.status(200).json({
      success: true,
      fields: fields
    });
    
  } catch (error) {
    console.error('Error getting fields:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while getting fields'
    });
  }
});

// API endpoint to get a specific field by ID
app.get('/api/fields/:id', (req, res) => {
  try {
    const fieldId = req.params.id;
    const files = fs.readdirSync(fieldCoordsDir);
    
    // Find the file that contains the field ID
    const fieldFile = files.find(file => file.includes(fieldId) && file.endsWith('.json'));
    
    if (!fieldFile) {
      return res.status(404).json({
        success: false,
        message: 'Field not found'
      });
    }
    
    // Read the field data from the file
    const filePath = path.join(fieldCoordsDir, fieldFile);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fieldData = JSON.parse(fileContent);
    
    return res.status(200).json({
      success: true,
      field: fieldData
    });
    
  } catch (error) {
    console.error('Error getting field:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while getting field'
    });
  }
});

// Delete a field
app.delete('/api/fields/:id', (req, res) => {
  try {
    const fieldId = req.params.id;
    const files = fs.readdirSync(fieldCoordsDir);
    
    // Find the file that contains the field ID
    const fieldFile = files.find(file => file.includes(fieldId) && file.endsWith('.json'));
    
    if (!fieldFile) {
      return res.status(404).json({
        success: false,
        message: 'Field not found'
      });
    }
    
    // Delete the file
    const filePath = path.join(fieldCoordsDir, fieldFile);
    fs.unlinkSync(filePath);
    
    return res.status(200).json({
      success: true,
      message: 'Field deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting field:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting field'
    });
  }
});

// API endpoint to update manipal.json with coordinates from a selected field
app.post('/api/update-manipal', (req, res) => {
  try {
    const { fieldId } = req.body;
    
    if (!fieldId) {
      return res.status(400).json({
        success: false,
        message: 'Field ID is required'
      });
    }
    
    // Find the field file
    const files = fs.readdirSync(fieldCoordsDir);
    const fieldFile = files.find(file => file.includes(fieldId) && file.endsWith('.json'));
    
    if (!fieldFile) {
      return res.status(404).json({
        success: false,
        message: 'Field not found'
      });
    }
    
    // Read the field data from the file
    const filePath = path.join(fieldCoordsDir, fieldFile);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fieldData = JSON.parse(fileContent);
    
    if (!fieldData.coordinates || fieldData.coordinates.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Field has invalid or insufficient coordinates'
      });
    }
    
    // Transform the coordinates to the required format for manipal.json
    // Format: { "1": [longitude, latitude], "2": [longitude, latitude], ... }
    const manipalCoordinates = {};
    
    fieldData.coordinates.forEach((coord, index) => {
      // The field has coordinates in { lat, lng } format
      // We need to convert to [longitude, latitude]
      manipalCoordinates[(index + 1).toString()] = [coord.lng, coord.lat];
    });
    
    // Write to manipal.json in the field_corrdinates folder
    const manipalPath = path.join(__dirname, 'field_corrdinates', 'manipal.json');
    fs.writeFileSync(manipalPath, JSON.stringify(manipalCoordinates, null, 2));
    
    return res.status(200).json({
      success: true,
      message: 'manipal.json updated successfully',
      coordinates: manipalCoordinates
    });
    
  } catch (error) {
    console.error('Error updating manipal.json:', error);
    return res.status(500).json({
      success: false,
      message: `Server error while updating manipal.json: ${error.message}`
    });
  }
});

// API endpoint to get soil and land data for a field
app.get('/api/soil/:fieldId', (req, res) => {
  try {
    const fieldId = req.params.fieldId;
    
    // Here we would typically fetch soil data from a database based on the field ID
    // For now, we'll generate realistic mock data with some randomness but consistency
    
    // Use the field ID as a seed for randomness to ensure the same field gets consistent data
    const fieldSeed = fieldId ? fieldId.toString().split('').reduce((a, b) => a + b.charCodeAt(0), 0) : Math.floor(Math.random() * 1000);
    const randomWithSeed = (min, max, seed = fieldSeed) => {
      const x = Math.sin(seed++) * 10000;
      const r = x - Math.floor(x);
      return min + (max - min) * r;
    };
    
    // Generate values based on the field seed
    const phValue = parseFloat((6.5 + randomWithSeed(-0.5, 1.0)).toFixed(1));
    const nitrogenValue = parseFloat((randomWithSeed(40, 60)).toFixed(1));
    const phosphorusValue = parseFloat((randomWithSeed(25, 40)).toFixed(1));
    const potassiumValue = parseFloat((randomWithSeed(150, 200)).toFixed(1));
    const organicMatterValue = parseFloat((randomWithSeed(2.0, 3.5)).toFixed(1));
    
    const soilData = {
      soilType: ['Clay Loam', 'Sandy Loam', 'Silt Loam', 'Loamy Sand', 'Clay'][Math.floor(randomWithSeed(0, 5))],
      ph: phValue,
      // Primary macronutrients (NPK)
      nitrogen: nitrogenValue,
      phosphorus: phosphorusValue,
      potassium: potassiumValue,
      // Secondary macronutrients
      calcium: parseFloat((randomWithSeed(1000, 1500)).toFixed(1)),
      magnesium: parseFloat((randomWithSeed(45, 65)).toFixed(1)),
      sulfur: parseFloat((randomWithSeed(10, 20)).toFixed(1)),
      // Micronutrients
      zinc: parseFloat((randomWithSeed(1, 3)).toFixed(1)),
      iron: parseFloat((randomWithSeed(15, 25)).toFixed(1)),
      manganese: parseFloat((randomWithSeed(5, 10)).toFixed(1)),
      copper: parseFloat((randomWithSeed(1, 2)).toFixed(1)),
      boron: parseFloat((randomWithSeed(0.5, 1.0)).toFixed(2)),
      molybdenum: parseFloat((randomWithSeed(0.1, 0.2)).toFixed(2)),
      // Physical properties
      organicMatter: organicMatterValue,
      cec: parseFloat((randomWithSeed(12, 17)).toFixed(1)), // Cation Exchange Capacity
      waterCapacity: parseFloat((randomWithSeed(0.15, 0.25)).toFixed(2)),
      soilTemperature: parseFloat((randomWithSeed(20, 25)).toFixed(1)),
      soilCompaction: parseFloat((randomWithSeed(1.1, 1.3)).toFixed(1)),
      // Soil composition
      sandPercentage: Math.floor(randomWithSeed(30, 40)),
      siltPercentage: Math.floor(randomWithSeed(35, 45)),
      clayPercentage: Math.floor(randomWithSeed(20, 30)),
      // Historical data
      history: [
        {
          date: '2025-02-15',
          ph: parseFloat((phValue - 0.2).toFixed(1)),
          organicMatter: parseFloat((organicMatterValue - 0.3).toFixed(1)),
          nitrogen: parseFloat((nitrogenValue - 5).toFixed(1))
        },
        {
          date: '2024-08-10',
          ph: parseFloat((phValue - 0.4).toFixed(1)),
          organicMatter: parseFloat((organicMatterValue - 0.6).toFixed(1)),
          nitrogen: parseFloat((nitrogenValue - 8).toFixed(1))
        }
      ],
      // Recommendations based on soil test
      recommendations: [
        {
          nutrient: 'Nitrogen',
          current: `${nitrogenValue} kg/ha`,
          recommendation: `Apply ${Math.max(0, Math.round(60 - nitrogenValue))} kg/ha of nitrogen-rich fertilizer before next planting`,
          fertilizers: ['Urea (46-0-0)', 'Ammonium Nitrate (34-0-0)']
        },
        {
          nutrient: 'Phosphorus',
          current: `${phosphorusValue} kg/ha`,
          recommendation: `Apply ${Math.max(0, Math.round(40 - phosphorusValue))} kg/ha of phosphatic fertilizer to improve root development`,
          fertilizers: ['Triple Superphosphate (0-46-0)', 'DAP (18-46-0)']
        },
        {
          nutrient: 'Potassium',
          current: `${potassiumValue} kg/ha`,
          recommendation: `Apply ${Math.max(0, Math.round(200 - potassiumValue))} kg/ha of potassium fertilizer for drought resistance`,
          fertilizers: ['Potassium Chloride (0-0-60)', 'Potassium Sulfate (0-0-50)']
        }
      ],
      // pH management
      phManagement: phValue < 5.5 ? {
        action: 'Increase pH',
        amount: '50 kg/ha',
        material: 'agricultural lime',
        benefit: 'Improve nutrient availability and microbial activity'
      } : phValue > 7.5 ? {
        action: 'Decrease pH',
        amount: '30 kg/ha',
        material: 'elemental sulfur',
        benefit: 'Improve nutrient availability, especially phosphorus and micronutrients'
      } : null,
      // Soil management practices
      managementPractices: [
        {
          practice: 'Apply Organic Matter',
          description: 'Add compost or manure to improve soil structure and water retention',
          priority: 'high',
          schedule: 'Fall 2025'
        },
        {
          practice: 'Implement Crop Rotation',
          description: 'Alternate different crop families to prevent nutrient depletion',
          priority: 'medium',
          schedule: 'Next planting season'
        },
        {
          practice: 'Use Cover Crops',
          description: 'Plant legumes or grasses during off-seasons to prevent erosion',
          priority: 'high',
          schedule: 'After harvest'
        }
      ],
      // Metadata
      lastUpdated: new Date().toISOString(),
      source: 'SmartAgri Soil Analysis API'
    };
    
    return res.status(200).json({
      success: true,
      data: soilData
    });
  } catch (error) {
    console.error('Error getting soil data:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while getting soil data'
    });
  }
});

// Serve static files from public directory for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

const traderRoutes = require('./TraderRoutes/Trader.js');

app.use("/api/trader", traderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
