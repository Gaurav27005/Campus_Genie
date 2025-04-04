const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Add this with your other require statements
const auth = require('./middleware/auth');

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

// Add this line near your other route imports
const marketplaceRoutes = require('./routes/marketplace');

// Add this line with your other app.use statements
app.use('/api/marketplace', marketplaceRoutes);

// Make sure you have this line to serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect('mongodb+srv://campuskagenie:viratkolhi@campusgenie.6l16gcz.mongodb.net/test', {
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

// Item Schema - Update collection name to 'lostandfound'
// Item Schema
const itemSchema = new mongoose.Schema({
    type: String,
    title: String,
    description: String,
    location: String,
    date: Date,
    contact: String,
    image: {
        data: Buffer,
        contentType: String
    },
    status: {
        type: String,
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'lostandfound' }); // Collection name remains 'lostandfound'

const Item = mongoose.model('Item', itemSchema);

// Routes
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        
        // Convert binary image data to base64 for client-side display
        const processedItems = items.map(item => {
            const itemObj = item.toObject();
            
            try {
                if (itemObj.image && itemObj.image.data) {
                    // Ensure we're working with a Buffer
                    const buffer = Buffer.isBuffer(itemObj.image.data) 
                        ? itemObj.image.data 
                        : Buffer.from(itemObj.image.data);
                    
                    if (buffer.length > 0) {
                        const base64 = buffer.toString('base64');
                        itemObj.image = `data:${itemObj.image.contentType || 'image/jpeg'};base64,${base64}`;
                        console.log(`Processed image: ${buffer.length} bytes, base64 length: ${base64.length}`);
                    } else {
                        console.log('Empty buffer detected');
                        itemObj.image = '/Assets/placeholder.jpeg';
                    }
                } else {
                    console.log('No image data found');
                    itemObj.image = '/Assets/placeholder.jpeg';
                }
            } catch (error) {
                console.error('Error processing image:', error);
                itemObj.image = '/Assets/placeholder.jpeg';
            }
            
            return itemObj;
        });
        
        res.json(processedItems);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Handle file upload
app.post('/api/items/upload', upload.single('image'), async (req, res) => {
    try {
        let imageData = null;
        
        // Check if a file was uploaded
        if (req.file) {
            try {
                // Read file from disk and prepare for MongoDB storage
                const imgData = fs.readFileSync(req.file.path);
                
                if (imgData && imgData.length > 0) {
                    imageData = {
                        data: imgData,
                        contentType: req.file.mimetype
                    };
                    console.log(`Successfully read image: ${req.file.originalname}, Size: ${imgData.length} bytes`);
                } else {
                    console.error('Empty image file');
                }
                
                // Remove the file from uploads folder after reading
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error('Error reading uploaded file:', error);
            }
        }
        
        // If no valid image was uploaded, use placeholder
        if (!imageData || !imageData.data || imageData.data.length === 0) {
            try {
                const placeholderPath = path.join(__dirname, 'Assets', 'placeholder.jpeg');
                if (fs.existsSync(placeholderPath)) {
                    const imgData = fs.readFileSync(placeholderPath);
                    imageData = {
                        data: imgData,
                        contentType: 'image/jpeg'
                    };
                    console.log('Using placeholder image');
                } else {
                    console.error('Placeholder image not found at:', placeholderPath);
                }
            } catch (error) {
                console.error('Error loading placeholder:', error);
            }
        }
        
        // Create new item with the image data
        const newItem = new Item({
            type: req.body.type,
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            date: req.body.date,
            contact: req.body.contact,
            image: imageData,
            status: 'active'
        });
        
        await newItem.save();
        
        // Convert binary image data to base64 for response
        const itemObj = newItem.toObject();
        if (itemObj.image && itemObj.image.data) {
            const base64 = Buffer.from(itemObj.image.data).toString('base64');
            itemObj.image = `data:${itemObj.image.contentType};base64,${base64}`;
        }
        
        res.status(201).json(itemObj);
    } catch (err) {
        console.error('Error saving item:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// User Schema
// Remove these lines from server.js
// const userSchema = new mongoose.Schema({...});
// const User = mongoose.model('User', userSchema);

// Add this line at the top with your other requires
const User = require('./models/User');

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword
        });
        
        await user.save();
        
        // Create JWT token
        const token = jwt.sign(
            { userId: user.id },
            'your_jwt_secret', // Replace with a real secret in production
            { expiresIn: '1h' }
        );
        
        res.status(201).json({ 
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { userId: user.id },
            'your_jwt_secret', // Replace with a real secret in production
            { expiresIn: '1h' }
        );
        
        res.json({ 
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
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

// Serve static files
app.use(express.static(path.join(__dirname)));

// Catch-all route to serve index.html - THIS SHOULD BE LAST
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});