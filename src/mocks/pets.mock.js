import { faker } from '@faker-js/faker';

export const generatePet = () => {
    return {
        name: faker.animal.dog(),
        specie: faker.helpers.arrayElement(['dog', 'cat']),
        birthDate: faker.date.past(),
        adopted: false,
        owner: null
    };
}; 