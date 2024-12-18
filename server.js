const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // เพิ่มบรรทัดนี้

// สร้างแอป Express
const app = express();
app.use(cors()); // ใช้ CORS middleware
app.use(bodyParser.json());

// เชื่อมต่อกับ MongoDB
mongoose.connect('mongodb://127.0.0.1/queue_management', { useNewUrlParser: true, useUnifiedTopology: true });

// สร้าง Schema และ Model สำหรับคิว
const queueSchema = new mongoose.Schema({
    name: String,
    timestamp: { type: Date, default: Date.now }
});
const Queue = mongoose.model('Queue', queueSchema);

// สร้าง route สำหรับเพิ่มคิว
app.post('/queue', async (req, res) => {
    const queueItem = new Queue(req.body);
    await queueItem.save();
    res.send(queueItem);
});

// สร้าง route สำหรับลบคิว
app.delete('/queue/:id', async (req, res) => {
    try {
        const result = await Queue.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send('Item not found');
        }
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// ปรับปรุง route สำหรับดึงข้อมูลคิวพร้อมการเรียงลำดับตามเวลา
app.get('/queue', async (req, res) => {
    const queue = await Queue.find().sort({ timestamp: 1 }); // เรียงลำดับจากน้อยไปมาก (จากเก่าไปใหม่)
    res.send(queue);
});

// เริ่มเซิร์ฟเวอร์
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
