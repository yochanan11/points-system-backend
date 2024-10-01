const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // ודא שיש לך קובץ .env עם ה-URI של MongoDB

const app = express();
app.use(cors());
app.use(express.json());

// חיבור ל-MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
        console.log(`Connected to MongoDB, database name: ${mongoose.connection.name}`);
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// הגדרת ה-Schema של הסטודנטים
const studentSchema = new mongoose.Schema({
    studentId: Number, // מזהה ייחודי לתלמיד
    firstName: String, // שם פרטי
    lastName: String, // שם משפחה
    branch: String, // סניף
    points: Number, // נקודות
    bonus: Number, // בונוס
    studentComments: String // הערות על התלמיד
}, { collection: 'students' });

const Student = mongoose.model('Student', studentSchema);

// API לקבלת כל התלמידים
app.get('/api/students', async (req, res) => {
    console.log('Incoming request: /api/students');
    try {
        const students = await Student.find();
        console.log('Students from database:', students);
        res.json(students);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: error.message });
    }
});

// API לעדכון בונוס של תלמיד
app.post('/api/students/update-bonus', async (req, res) => {
    const { studentId, bonus } = req.body;
    console.log(`Incoming request: /api/students/update-bonus for studentId ${studentId}`);
    try {
        const student = await Student.findOne({ studentId });
        if (student) {
            student.bonus += bonus;
            await student.save();
            res.json({ message: 'Bonus updated successfully' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error updating bonus:', error);
        res.status(500).json({ message: error.message });
    }
});

// API לקבלת תלמיד לפי studentId
app.get('/api/students/:studentId', async (req, res) => {
    const { studentId } = req.params;
    console.log(`Incoming request: /api/students/${studentId}`);
    try {
        const student = await Student.findOne({ studentId: parseInt(studentId) });
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: error.message });
    }
});

// API לעדכון ניקוד של תלמיד
app.post('/api/students/update-score', async (req, res) => {
    const { studentId, points } = req.body;
    console.log(`Incoming request: /api/students/update-score for studentId ${studentId}`);
    try {
        const student = await Student.findOne({ studentId });
        if (student) {
            student.points += points;
            await student.save();
            res.json({ message: 'Score updated successfully' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error updating score:', error);
        res.status(500).json({ message: error.message });
    }
});

// הפעלת השרת
module.exports = app;
