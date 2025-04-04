const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        // Accept only image files
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, '/')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect('mongodb+srv://campuskagenie:viratkolhi@campusgenie.6l16gcz.mongodb.net/campusGenie', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Atlas Connected');
    console.log('Database:', mongoose.connection.name);
})
.catch(err => {
    console.log('MongoDB Connection Error:', err);
});

// Item Schema
const itemSchema = new mongoose.Schema({
    type: String,
    title: String,
    description: String,
    location: String,
    date: Date,
    contact: String,
    image: String,
    status: {
        type: String,
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'lostandfound' }); // Explicitly set collection name

const Item = mongoose.model('Item', itemSchema);

// Routes
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Handle file upload
app.post('/api/items/upload', upload.single('image'), async (req, res) => {
    try {
        let imagePath;
        
        // Check if a file was uploaded or a sample image was used
        if (req.file) {
            // Use the uploaded file path
            imagePath = `/uploads/${req.file.filename}`;
        } else if (req.body.imageUrl) {
            // Use the provided sample image URL
            imagePath = req.body.imageUrl;
        } else {
            // Use a default placeholder
            imagePath = '/Assets/placeholder.jpeg';
        }
        
        // Create new item with the image path
        const newItem = new Item({
            type: req.body.type,
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            date: req.body.date,
            contact: req.body.contact,
            image: imagePath,
            status: 'active'
        });
        
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        console.error('Error saving item:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Catch-all route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Add this route after your other routes
app.get('/api/debug', async (req, res) => {
    try {
        // Check database connection
        const connectionState = mongoose.connection.readyState;
        let connectionStatus;
        
        switch(connectionState) {
            case 0: connectionStatus = "Disconnected"; break;
            case 1: connectionStatus = "Connected"; break;
            case 2: connectionStatus = "Connecting"; break;
            case 3: connectionStatus = "Disconnecting"; break;
            default: connectionStatus = "Unknown";
        }
        
        // Count items in database
        const itemCount = await Item.countDocuments();
        
        // Get a sample of items (up to 5)
        const sampleItems = await Item.find().limit(5);
        
        // Check if the Item model is properly registered
        const modelNames = mongoose.modelNames();
        
        res.json({
            databaseConnection: {
                status: connectionStatus,
                url: mongoose.connection.host,
                database: mongoose.connection.name
            },
            items: {
                count: itemCount,
                sample: sampleItems
            },
            models: modelNames
        });
    } catch (err) {
        console.error('Debug error:', err);
        res.status(500).json({ error: err.message });
    }
});