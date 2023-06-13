import { setupServer } from 'msw/node';
import { rest } from 'msw';

const API_URL = "https://localhost:7187/api/Builder/"

const server = setupServer(
    rest.get(API_URL + 'Races', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(['Dwarf', 'Elf'])
        );
    }),
    rest.get(API_URL + 'Subraces/Dwarf', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(['Hill Dwarf', 'Mountain Dwarf'])
        );
    }),
    rest.get(API_URL + 'Classes', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(['Barbarian', 'Rogue'])
        );
    }),
    rest.get(API_URL + 'Subraces/', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(['Hill Dwarf', 'Mountain Dwarf'])
        );
    }),
    rest.get(API_URL + 'RollStat', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(10)
        );
    }),
    rest.get(API_URL + 'Subclasses/Barbarian', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(['Path of the Zealot', 'Path of the Totem Warrior'])
        );
    }),
    rest.get(API_URL + 'Subclasses/', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(['Path of the Zealot', 'Path of the Totem Warrior'])
        );
    }),
    rest.get(API_URL + 'GetProficiencies/Barbarian', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                "Animal Handling",
                "Athletics",
                "Intimidation",
                "Nature",
                "Perception",
                "Survival"
              ])
        );
    }),
    rest.get(API_URL + 'GetProficiencyAmount/Barbarian', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(2)
        );
    }),
    rest.get(API_URL + 'GetProficiencies/', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                "Animal Handling",
                "Athletics",
                "Intimidation",
                "Nature",
                "Perception",
                "Survival"
              ])
        );
    }),
    rest.get(API_URL + 'GetProficiencyAmount/', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(2)
        );
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export { server };