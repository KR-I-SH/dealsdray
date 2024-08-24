const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const multer = require('multer');
require('dotenv').config();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const PORT = 5000;
const app = express();
app.use(express.json());
app.use(cors()); 

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/dealsdray', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

app.use(bodyParser.json());

// MongoDB schema and model for t_login
const loginSchema = new mongoose.Schema({
    f_sno: Number,
    f_userName: { type: String, unique: true, required: true },
    f_Pwd: { type: String, required: true }
});

const Login = mongoose.model('t_login', loginSchema);

// Registration route
app.post('/api/register', async (req, res) => {
    const { f_userName, f_Pwd } = req.body;

    try {
        // Hash the password
        const hashedPwd = await bcrypt.hash(f_Pwd, 10);

        // Create new user
        const newUser = new Login({
            f_userName,
            f_Pwd: hashedPwd,
            f_sno: await Login.countDocuments() + 1 // Incrementing f_sno
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { f_userName, f_Pwd } = req.body;

    try {
        // Find the user by username
        const user = await Login.findOne({ f_userName });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' }); // Simplified error message
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(f_Pwd, user.f_Pwd);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' }); // Simplified error message
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        // Return token
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Protect routes with verifyToken middleware
app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route' });
});


//module.exports = router;

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
            return cb(new Error('Only JPG/PNG files are allowed'), false);
        }
        cb(null, true);
    }
});

app.use('/uploads', express.static('uploads'));

// Define the Employee schema and model
const employeeSchema = new mongoose.Schema({
    f_Id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    f_Name: { type: String, required: true },
    f_Email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ },
    f_Mobile: { type: String, required: true, match: /^\d+$/ },
    f_Designation: { type: String, required: true },
    f_gender: { type: String, required: true },
    f_Course: [String],
    f_Image: String,
    f_Createdate: { type: Date, default: Date.now }
});

const Employee = mongoose.model('t_Employee', employeeSchema);

// CRUD Operations

// Fetch all employees
app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Insert a new employee with server-side validation
app.post('/employees', upload.single('f_Image'), async (req, res) => {
    const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;

    try {
        const existingEmployee = await Employee.findOne({ f_Email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const employee = new Employee({
            f_Name,
            f_Email,
            f_Mobile,
            f_Designation,
            f_gender,
            f_Course: f_Course.split(','), 
            f_Image: req.file ? req.file.path : null
        });

        const savedEmployee = await employee.save();
        res.status(201).json(savedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//fetch by id
app.get('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).send('Server error');
    }
});

//update by id
app.put('/employees/:id', upload.single('f_Image'), async (req, res) => {
    try {
        const id = req.params.id;
        const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;
        const f_Image = req.file ? req.file.path : undefined;

        const updatedEmployee = await Employee.findByIdAndUpdate(id, {
            f_Name,
            f_Email,
            f_Mobile,
            f_Designation,
            f_gender,
            f_Course: f_Course ? f_Course.split(',') : [], // Assuming f_Course is passed as a comma-separated string
            f_Image
        }, { new: true });

        if (!updatedEmployee) {
            return res.status(404).send('Employee not found');
        }

        res.json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).send('Server error');
    }
});

// Delete an employee by id
app.delete('/employees/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//pagation
app.get('/employees', async (req, res) => {
    try {
        const { search = '', page = 1, limit = 4 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const query = {
            $or: [
                { f_Name: { $regex: search, $options: 'i' } },
                { f_Email: { $regex: search, $options: 'i' } }
            ]
        };

        const total = await Employee.countDocuments(query);
        const employees = await Employee.find(query).skip(skip).limit(parseInt(limit));
        
        res.json({ employees, total });
    } catch (error) {
        res.status(500).send('Server error');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});