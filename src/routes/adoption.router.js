import { Router } from 'express';
const router = Router();

// Mock database
let adoptions = [];

// GET all adoptions
router.get('/', async (req, res) => {
    try {
        res.status(200).json(adoptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET adoption by ID
router.get('/:id', async (req, res) => {
    try {
        const adoption = adoptions.find(a => a._id === req.params.id);
        if (!adoption) {
            return res.status(404).json({ error: 'Adoption not found' });
        }
        res.status(200).json(adoption);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST new adoption
router.post('/', async (req, res) => {
    try {
        const { petId, userId, status } = req.body;
        
        // Validate required fields
        if (!petId || !userId) {
            return res.status(400).json({ error: 'petId and userId are required' });
        }

        // Check if pet is already adopted
        const existingAdoption = adoptions.find(
            a => a.petId === petId && a.status === 'approved'
        );
        if (existingAdoption) {
            return res.status(400).json({ error: 'Pet is already adopted' });
        }

        // Check pending adoptions limit
        const pendingAdoptions = adoptions.filter(
            a => a.userId === userId && a.status === 'pending'
        );
        if (pendingAdoptions.length >= 3) {
            return res.status(400).json({ error: 'User has reached pending adoptions limit' });
        }

        const newAdoption = {
            _id: Math.random().toString(36).substr(2, 9),
            petId,
            userId,
            status: status || 'pending',
            createdAt: new Date()
        };

        adoptions.push(newAdoption);
        res.status(201).json(newAdoption);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update adoption
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'approved', 'rejected'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const adoptionIndex = adoptions.findIndex(a => a._id === req.params.id);
        if (adoptionIndex === -1) {
            return res.status(404).json({ error: 'Adoption not found' });
        }

        adoptions[adoptionIndex] = {
            ...adoptions[adoptionIndex],
            status,
            updatedAt: new Date()
        };

        res.status(200).json(adoptions[adoptionIndex]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE adoption
router.delete('/:id', async (req, res) => {
    try {
        const adoptionIndex = adoptions.findIndex(a => a._id === req.params.id);
        if (adoptionIndex === -1) {
            return res.status(404).json({ error: 'Adoption not found' });
        }

        adoptions = adoptions.filter(a => a._id !== req.params.id);
        res.status(200).json({ message: 'Adoption deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;