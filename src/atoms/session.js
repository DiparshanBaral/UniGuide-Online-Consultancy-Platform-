import { atom } from 'jotai';

// Get the session from localStorage if it exists
const storedSession = JSON.parse(localStorage.getItem('session'));

// Define the session atom with an initial value from localStorage
export const sessionAtom = atom(storedSession || null);