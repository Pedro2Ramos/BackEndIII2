import userModel from '../dao/models/User.js';

export default class UserService {
    constructor() {
        this.model = userModel;
    }

    async createMany(users) {
        try {
            return await this.model.insertMany(users);
        } catch (error) {
            throw new Error(`Error creating users: ${error}`);
        }
    }
} 