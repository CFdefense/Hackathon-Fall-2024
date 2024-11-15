import { Router } from 'express';
const router = Router();

router.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});

export default router;
