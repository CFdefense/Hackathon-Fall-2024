import express from 'express';
import routes from './routes/index.js';


const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Include routes
app.use('/', routes);

// Route setup
app.get('/', (req, res) => {
    res.send('Hello, Node.js!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

