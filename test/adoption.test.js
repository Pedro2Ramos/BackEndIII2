import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Adoption Router Tests - Validación de Consigna', () => {
    let testPetId;
    let testUserId;
    let testAdoptionId;

    before(async () => {
        testPetId = "mockPetId";
        testUserId = "mockUserId";
    });

    describe('1. Tests Funcionales para adoption.router.js', () => {
        describe('GET /api/adoptions', () => {
            it('debería obtener todas las adopciones', async () => {
                const response = await request(app).get('/api/adoptions');
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an('array');
            });
        });

        describe('POST /api/adoptions', () => {
            it('debería crear una nueva adopción', async () => {
                const mockAdoption = {
                    petId: testPetId,
                    userId: testUserId,
                    status: "pending"
                };
                
                const response = await request(app)
                    .post('/api/adoptions')
                    .send(mockAdoption);
                    
                expect(response.status).to.equal(201);
                expect(response.body).to.have.property('_id');
                testAdoptionId = response.body._id;
            });

            it('debería validar campos requeridos', async () => {
                const invalidAdoption = {
                    // Falta petId y userId
                    status: "pending"
                };
                
                const response = await request(app)
                    .post('/api/adoptions')
                    .send(invalidAdoption);
                    
                expect(response.status).to.equal(400);
            });
        });

        describe('GET /api/adoptions/:id', () => {
            it('debería obtener una adopción por ID', async () => {
                const response = await request(app)
                    .get(`/api/adoptions/${testAdoptionId}`);
                expect(response.status).to.equal(200);
                expect(response.body._id).to.equal(testAdoptionId);
            });

            it('debería manejar IDs inválidos', async () => {
                const response = await request(app)
                    .get('/api/adoptions/invalid_id');
                expect(response.status).to.equal(400);
            });
        });

        describe('PUT /api/adoptions/:id', () => {
            it('debería actualizar el estado de una adopción', async () => {
                const updateData = {
                    status: "approved"
                };

                const response = await request(app)
                    .put(`/api/adoptions/${testAdoptionId}`)
                    .send(updateData);

                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('approved');
            });
        });

        describe('DELETE /api/adoptions/:id', () => {
            it('debería eliminar una adopción', async () => {
                const response = await request(app)
                    .delete(`/api/adoptions/${testAdoptionId}`);

                expect(response.status).to.equal(200);
                
                // Verificar que fue eliminada
                const checkResponse = await request(app)
                    .get(`/api/adoptions/${testAdoptionId}`);
                expect(checkResponse.status).to.equal(404);
            });
        });
    });

    describe('2. Reglas de Negocio', () => {
        it('no debería permitir adoptar una mascota ya adoptada', async () => {
            // Primera adopción
            const firstAdoption = await request(app)
                .post('/api/adoptions')
                .send({
                    petId: "pet123",
                    userId: "user1",
                    status: "approved"
                });

            // Intentar adoptar la misma mascota
            const secondAdoption = await request(app)
                .post('/api/adoptions')
                .send({
                    petId: "pet123",
                    userId: "user2",
                    status: "pending"
                });

            expect(secondAdoption.status).to.equal(400);
            expect(secondAdoption.body).to.have.property('error');
        });

        it('debería limitar el número de adopciones pendientes por usuario', async () => {
            const maxPendingAdoptions = 3;
            const adoptionPromises = [];

            // Intentar crear más adopciones que el límite permitido
            for (let i = 0; i < maxPendingAdoptions + 1; i++) {
                adoptionPromises.push(
                    request(app)
                        .post('/api/adoptions')
                        .send({
                            petId: `testPet${i}`,
                            userId: "limitTestUser",
                            status: "pending"
                        })
                );
            }

            const results = await Promise.all(adoptionPromises);
            const lastResponse = results[results.length - 1];

            expect(lastResponse.status).to.equal(400);
            expect(lastResponse.body).to.have.property('error');
        });
    });

    describe('3. Validación de Documentación', () => {
        it('debería tener documentación Swagger accesible', async () => {
            const response = await request(app).get('/api-docs');
            expect(response.status).to.equal(200);
        });

        it('debería incluir la documentación del módulo Users', async () => {
            const response = await request(app).get('/api-docs/swagger.json');
            expect(response.status).to.equal(200);
            expect(response.body.paths).to.have.property('/api/users');
            expect(response.body.components.schemas).to.have.property('User');
        });
    });

    describe('4. Validación de Docker', () => {
        it('debería tener un Dockerfile válido', async () => {
            const fs = require('fs');
            const dockerfileExists = fs.existsSync('./Dockerfile');
            expect(dockerfileExists).to.be.true;

            const dockerfileContent = fs.readFileSync('./Dockerfile', 'utf8');
            expect(dockerfileContent).to.include('FROM node');
            expect(dockerfileContent).to.include('WORKDIR /app');
            expect(dockerfileContent).to.include('COPY package*.json');
            expect(dockerfileContent).to.include('RUN npm install');
            expect(dockerfileContent).to.include('COPY . .');
            expect(dockerfileContent).to.include('CMD');
        });

        it('debería tener un README.md con el link a DockerHub', async () => {
            const fs = require('fs');
            const readmeContent = fs.readFileSync('./README.md', 'utf8');
            expect(readmeContent).to.include('docker.io/pedrodosramos/adoption-project');
        });
    });
}); 