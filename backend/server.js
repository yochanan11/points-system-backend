const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// חיבור ל-MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// הגדרת ה-Schema של הסניפים
const branchSchema = new mongoose.Schema({
    branchName: String
});

const Branch = mongoose.model('Branch', branchSchema);

// הגדרת ה-Schema של הסטודנטים עם branchId
const studentSchema = new mongoose.Schema({
    studentId: Number,
    firstName: String,
    lastName: String,
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    totalPoints: { type: Number, default: 0 },
    studentComments: String
}, { collection: 'students' });

const Student = mongoose.model('Student', studentSchema);

// API לקבלת כל התלמידים עם פרטי הסניף
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find().populate('branchId', 'branchName');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API לעדכון בונוס של תלמיד (מתעדכן כ-totalPoints)
app.post('/api/students/update-bonus', async (req, res) => {
    const { studentId, bonus } = req.body;
    try {
        const student = await Student.findOne({ studentId });
        if (student) {
            student.totalPoints += bonus;
            await student.save();
            res.json({ message: 'Bonus updated successfully' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API לקבלת תלמיד לפי studentId עם פרטי הסניף
app.get('/api/students/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await Student.findOne({ studentId: parseInt(studentId) }).populate('branchId', 'branchName');
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API לעדכון ניקוד של תלמיד (הוספת נקודות לסך הכל)
app.post('/api/students/update-score', async (req, res) => {
    const { studentId, points } = req.body;
    try {
        const student = await Student.findOne({ studentId });
        if (student) {
            if (student.totalPoints + points < 0) {
                return res.status(400).json({ message: 'אין מספיק נקודות' });
            }
            student.totalPoints += points;
            await student.save();
            res.json({ message: 'Score updated successfully' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API לאיפוס נקודות של תלמיד
app.post('/api/students/reset-score', async (req, res) => {
    const { studentId } = req.body;
    try {
        const student = await Student.findOne({ studentId });
        if (student) {
            student.totalPoints = 0;
            await student.save();
            res.json({ message: 'Score reset successfully' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API להוספת תלמיד חדש
app.post('/api/students', async (req, res) => {
    const { studentId, firstName, lastName, branchId, totalPoints, studentComments } = req.body;
    try {
        const newStudent = new Student({
            studentId,
            firstName,
            lastName,
            branchId,
            totalPoints,
            studentComments,
        });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: 'Error adding student.', error: error.message });
    }
});

// API לעדכון פרטי תלמיד
app.put('/api/students/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const { firstName, lastName, branchId, totalPoints } = req.body;
    try {
        const student = await Student.findOne({ studentId: parseInt(studentId) });
        if (student) {
            student.firstName = firstName;
            student.lastName = lastName;
            student.branchId = branchId;
            student.totalPoints = totalPoints;
            await student.save();
            res.json({ message: 'Student updated successfully', student });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API למחיקת תלמיד לפי studentId
app.delete('/api/students/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await Student.findOneAndDelete({ studentId: parseInt(studentId) });
        if (student) {
            res.json({ message: 'Student deleted successfully' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// API לקבלת כל הסניפים
app.get('/api/branches', async (req, res) => {
    try {
        const branches = await Branch.find();
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching branches.', error: error.message });
    }
});
// הפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
