import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const generateUser = () => {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync('coder123', 10), 
        role: faker.helpers.arrayElement(['user', 'admin']),
        pets: [] 
    };
}; 