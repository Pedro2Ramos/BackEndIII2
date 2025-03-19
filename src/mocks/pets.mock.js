import { faker } from '@faker-js/faker';

export const generatePet = () => {
    return {
        name: faker.person.firstName(),
        specie: faker.helpers.arrayElement(['perro', 'gato']),
        birthDate: faker.date.past().toISOString(),
        adopted: faker.datatype.boolean(),
        owner: null,
        image: faker.image.url()
    };
}; 