const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // ודא שיש לך קובץ .env עם ה-URI של MongoDB

const app = express();
app.use(cors());
app.use(express.json());

// חיבור ל-MongoDB
mongoose.connect(process.env.MONGO_URI)
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
    totalPoints: { type: Number, default: 0 }, // סך כל הנקודות הכוללות
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

// API לעדכון בונוס של תלמיד (מתעדכן כ-totalPoints)
app.post('/api/students/update-bonus', async (req, res) => {
    const { studentId, bonus } = req.body;
    console.log(`Incoming request: /api/students/update-bonus for studentId ${studentId}`);
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

// API לעדכון ניקוד של תלמיד (הוספת נקודות לסך הכל)
app.post('/api/students/update-score', async (req, res) => {
    const { studentId, points } = req.body;
    console.log(`Incoming request: /api/students/update-score for studentId ${studentId}`);
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
        console.error('Error updating score:', error);
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

// הפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
