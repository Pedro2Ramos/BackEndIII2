import { Router } from 'express';
import { generatePet } from '../mocks/pets.mock.js';
import { generateUser } from '../mocks/users.mock.js';
import UserService from '../services/users.service.js';
import PetService from '../services/pets.service.js';

const router = Router();
const userService = new UserService();
const petService = new PetService();

router.get('/mockingpets', (req, res) => {
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

router.get('/mockingusers', (req, res) => {
    try {
        const users = [];
        for(let i = 0; i < 50; i++) {
            users.push(generateUser());
        }
        res.json({ status: 'success', payload: users });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.post('/generateData', async (req, res) => {
    try {
        const { users, pets } = req.body;
        
        if (!users || !pets) {
            return res.status(400).json({ 
                status: 'error', 
                error: 'Debe proporcionar la cantidad de users y pets' 
            });
        }

        const generatedUsers = Array.from({ length: parseInt(users) }, () => generateUser());
        const generatedPets = Array.from({ length: parseInt(pets) }, () => generatePet());
        
        const insertedUsers = await userService.createMany(generatedUsers);
        const insertedPets = await petService.createMany(generatedPets);
        
        res.json({ 
            status: 'success', 
            message: `Se han generado ${users} usuarios y ${pets} mascotas correctamente`,
            payload: {
                users: insertedUsers,
                pets: insertedPets
            }
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            error: 'Error al generar los datos: ' + error.message 
        });
    }
});

export default router; 