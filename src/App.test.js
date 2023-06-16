import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { server } from './setupServer';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const API_URL = "https://localhost:7187/api/Builder/"

console.error = jest.fn().mockImplementation((warning) => {
    if (warning.includes('contentEditable')) {
        return;
    }
    console.error(warning);
});

describe('App component', () => {
    test('renders race dropdown', () => {
        render(<App />);
        const raceDropdown = screen.getByLabelText('Race:');
        expect(raceDropdown).toBeInTheDocument();
    });

    test('selects a race and renders subrace dropdown', async () => {
        render(<App />);
        const raceDropdown = screen.getByLabelText('Race:');

        fireEvent.click(raceDropdown);

        await waitFor(() => {
            expect(screen.getByText('Dwarf', { selector: 'option' })).toBeInTheDocument();
        })

        fireEvent.change(raceDropdown, { target: { value: 'Dwarf' } });

        const subraceDropdown = await screen.findByLabelText('Subrace:');
        expect(subraceDropdown).toBeInTheDocument();
    });

    test('renders class dropdown', () => {
        render(<App />);
        const classDropdown = screen.getByLabelText('Class:');
        expect(classDropdown).toBeInTheDocument();
    });

    test('selects a class and renders subclass dropdown', async () => {
        render(<App />);
        const classDropdown = screen.getByLabelText('Class:');

        fireEvent.click(classDropdown);

        await waitFor(() => {
            expect(screen.getByText('Barbarian', { selector: 'option' })).toBeInTheDocument();
        })

        fireEvent.change(classDropdown, { target: { value: 'Barbarian' } });

        const subclassDropdown = await screen.findByLabelText('Subclass:');
        expect(subclassDropdown).toBeInTheDocument();
    });

    test('rolls stats and displays rolled values', async () => {
        render(<App />);
        const rollStatsButton = screen.getByRole('button', { name: 'Roll stats' });

        fireEvent.click(rollStatsButton);
        const rolledStats = await screen.findAllByTestId('rolled-stat');
        expect(rolledStats).toHaveLength(6);
    });

    test('selects class and checks if proficiencies are displayed correctly', async () => {
        render(<App />);
        const classDropdown = screen.getByLabelText('Class:');

        fireEvent.click(classDropdown);

        await waitFor(() => {
            expect(screen.getByText('Barbarian', { selector: 'option' })).toBeInTheDocument();
        })

        fireEvent.change(classDropdown, { target: { value: 'Barbarian' } });

        const allowedProficiencies = ["Animal Handling (Wis)", "Athletics (Str)", "Intimidation (Cha)", "Nature (Int)", "Perception (Wis)", "Survival (Wis)"];

        const proficiencyCheckboxes = screen.getAllByTestId('proficiency-checkbox');

        proficiencyCheckboxes.forEach((checkbox) => {
            const proficiencyName = checkbox.getAttribute('data-testid');

            if (allowedProficiencies.includes(proficiencyName)) {
                expect(checkbox).toBeEnabled();
            } else {
                expect(checkbox).toBeDisabled();
            }
        });
    });

    test('selects class and the max amount of proficiencies, then checks if selecting more proficiencies is allowed', async () => {
        render(<App />);
        const classDropdown = screen.getByLabelText('Class:');

        fireEvent.click(classDropdown);

        await waitFor(() => {
            expect(screen.getByText('Barbarian', { selector: 'option' })).toBeInTheDocument();
        })

        fireEvent.change(classDropdown, { target: { value: 'Barbarian' } });

        const proficiencyCheckboxes = screen.getAllByTestId('proficiency-checkbox');

        const chosenProficiencies = ["Athletics (Str)", "Perception (Wis)"];

        fireEvent.click(proficiencyCheckboxes.find((checkbox) => checkbox.value === chosenProficiencies[0]));
        fireEvent.click(proficiencyCheckboxes.find((checkbox) => checkbox.value === chosenProficiencies[1]));

        proficiencyCheckboxes.forEach((checkbox) => {
            const proficiencyName = checkbox.getAttribute('data-testid');

            if (chosenProficiencies.includes(proficiencyName)) {
                expect(checkbox).toBeEnabled();
            } else {
                expect(checkbox).toBeDisabled();
            }
        });
    });

    test('checks if proficiency checkboxes all start disabled when no class has been selected', async () => {
        render(<App />);
        const proficiencyCheckboxes = screen.getAllByTestId('proficiency-checkbox');
        proficiencyCheckboxes.forEach((checkbox) => {
            expect(checkbox).toBeDisabled();
        });
    });
}); 