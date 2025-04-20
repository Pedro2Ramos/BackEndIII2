import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import mongoose from 'mongoose';

describe('Adoption Router Tests', () => {
    let testPetId;
    let testUserId;
    let testAdoptionId;

    before(async () => {
        // Crear un usuario y una mascota de prueba
        const userResponse = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Test',
                last_name: 'User',
                email: 'test@example.com',
                password: 'password123'
            });
        testUserId = userResponse.body._id;

        const petResponse = await request(app)
            .post('/api/pets')
            .send({
                name: 'Test Pet',
                species: 'Dog',
                age: 2,
                description: 'Test pet description'
            });
        testPetId = petResponse.body._id;
    });

    after(async () => {
        // Limpiar la base de datos después de las pruebas
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    describe('POST /api/adoptions', () => {
        it('debería crear una nueva adopción con datos válidos', async () => {
            const adoptionData = {
                petId: testPetId,
                userId: testUserId,
                status: 'pending'
            };

            const response = await request(app)
                .post('/api/adoptions')
                .send(adoptionData);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('_id');
            expect(response.body.petId).to.equal(testPetId);
            expect(response.body.userId).to.equal(testUserId);
            expect(response.body.status).to.equal('pending');
            expect(response.body).to.have.property('createdAt');

            testAdoptionId = response.body._id;
        });

        it('debería retornar 400 si faltan campos requeridos', async () => {
            const invalidAdoption = {
                status: 'pending'
            };

            const response = await request(app)
                .post('/api/adoptions')
                .send(invalidAdoption);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error');
            expect(response.body.error).to.include('petId');
            expect(response.body.error).to.include('userId');
        });

        it('debería retornar 400 si el status no es válido', async () => {
            const invalidAdoption = {
                petId: testPetId,
                userId: testUserId,
                status: 'invalid_status'
            };

            const response = await request(app)
                .post('/api/adoptions')
                .send(invalidAdoption);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error');
        });
    });

    describe('GET /api/adoptions', () => {
        it('debería obtener todas las adopciones', async () => {
            const response = await request(app).get('/api/adoptions');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
            expect(response.body[0]).to.have.property('_id');
            expect(response.body[0]).to.have.property('petId');
            expect(response.body[0]).to.have.property('userId');
            expect(response.body[0]).to.have.property('status');
        });
    });

    describe('GET /api/adoptions/:id', () => {
        it('debería obtener una adopción por ID', async () => {
            const response = await request(app)
                .get(`/api/adoptions/${testAdoptionId}`);

            expect(response.status).to.equal(200);
            expect(response.body._id).to.equal(testAdoptionId);
            expect(response.body.petId).to.equal(testPetId);
            expect(response.body.userId).to.equal(testUserId);
            expect(response.body.status).to.equal('pending');
        });

        it('debería retornar 404 si la adopción no existe', async () => {
            const response = await request(app)
                .get('/api/adoptions/507f1f77bcf86cd799439011');

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('error');
        });
    });

    describe('PUT /api/adoptions/:id', () => {
        it('debería actualizar el estado de una adopción', async () => {
            const updateData = {
                status: 'approved'
            };

            const response = await request(app)
                .put(`/api/adoptions/${testAdoptionId}`)
                .send(updateData);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('approved');
        });

        it('debería retornar 400 si el nuevo estado no es válido', async () => {
            const updateData = {
                status: 'invalid_status'
            };

            const response = await request(app)
                .put(`/api/adoptions/${testAdoptionId}`)
                .send(updateData);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error');
        });
    });

    describe('DELETE /api/adoptions/:id', () => {
        it('debería eliminar una adopción', async () => {
            const response = await request(app)
                .delete(`/api/adoptions/${testAdoptionId}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message');

            // Verificar que fue eliminada
            const checkResponse = await request(app)
                .get(`/api/adoptions/${testAdoptionId}`);
            expect(checkResponse.status).to.equal(404);
        });
    });
}); 