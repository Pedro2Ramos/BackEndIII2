import petModel from '../dao/models/Pet.js';

export default class PetService {
    constructor() {
        this.model = petModel;
    }

    async createMany(pets) {
        try {
            return await this.model.insertMany(pets);
        } catch (error) {
            throw new Error(`Error creating pets: ${error}`);
        }
    }
} 