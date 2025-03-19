import { Router } from 'express';
import { generatePet } from '../mocks/pets.mock.js';
import { generateUser } from '../mocks/users.mock.js';
import UserService from '../services/users.service.js';
import PetService from '../services/pets.service.js';

const router = Router();
const userService = new UserService();
const petService = new PetService();

router.get('/api/mocks/mockingpets', (req, res) => {
    try {
        const pets = [];
        for(let i = 0; i < 100; i++) {
            pets.push(generatePet());
        }
        res.json({ status: 'success', payload: pets });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});


router.get('/api/mocks/mockingusers', (req, res) => {
    try {
        const users = [];
        for(let i = 0; i < 100; i++) {
            users.push(generateUser());
        }
        res.json({ status: 'success', payload: users });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});


router.post('/generateData', async (req, res) => {
    try {
        const { users: userCount, pets: petCount } = req.body;
        
        if (!userCount || !petCount) {
            return res.status(400).json({ 
                status: 'error', 
                error: 'Must provide users and pets counts' 
            });
        }

        const users = Array.from({ length: parseInt(userCount) }, () => generateUser());
        const pets = Array.from({ length: parseInt(petCount) }, () => generatePet());
        
        const insertedUsers = await userService.createMany(users);
        const insertedPets = await petService.createMany(pets);
        
        res.json({ 
            status: 'success', 
            payload: {
                users: insertedUsers,
                pets: insertedPets
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

export default router; 