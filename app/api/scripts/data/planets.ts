import { IPlanet } from '@/types/models/planet';
import { Types } from 'mongoose';

export const planets: IPlanet[] = [
  {
    name: 'Mission Control',
    type: 'missionControl',
    description: 'Begin your intergalactic journey!',
    requiredXP: 0,
    order: 1,
    stations: [
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Variables & Types',
        description: 'Master JavaScript variables and basic data types.',
        order: 1,
        xpReward: 50,
        currencyReward: 100,
        challenge: {
          instructions: 'Create a variable `age` and assign it the number 25, then create a variable `name` and assign it your name as a string.',
          initialCode: 'let age;\nlet name;',
          testCases: [
            { 
              input: null,
              expectedOutput: { age: 25, name: "string" }
            }
          ],
        },
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Arrays & Objects',
        description: 'Learn to work with complex data structures.',
        order: 2,
        xpReward: 75,
        currencyReward: 150,
        challenge: {
          instructions: 'Create an array called `fruits` with three string elements and an object called `person` with properties name and age.',
          initialCode: 'let fruits = [];\nlet person = {};',
          testCases: [
            { 
              input: null,
              expectedOutput: { 
                fruits: ["array-length-3"],
                person: { hasProperties: ["name", "age"] }
              }
            }
          ],
        },
      },
    ],
  },
  {
    name: 'Function Galaxy',
    type: 'chromanova',
    description: 'Master JavaScript functions and problem-solving.',
    requiredXP: 200,
    order: 2,
    stations: [
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Function Basics',
        description: 'Learn to write and use functions effectively.',
        order: 1,
        xpReward: 100,
        currencyReward: 200,
        challenge: {
          instructions: 'Write a function called `calculateArea` that takes width and height parameters and returns their product.',
          initialCode: 'function calculateArea(width, height) {\n  // Your code here\n}',
          testCases: [
            { 
              input: [5, 3],
              expectedOutput: 15
            },
            {
              input: [2, 4],
              expectedOutput: 8
            }
          ],
        },
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Array Methods',
        description: 'Master array methods and transformations.',
        order: 2,
        xpReward: 125,
        currencyReward: 250,
        challenge: {
          instructions: 'Write a function that filters an array to only include even numbers.',
          initialCode: 'function filterEvenNumbers(numbers) {\n  // Your code here\n}',
          testCases: [
            { 
              input: [1, 2, 3, 4, 5, 6],
              expectedOutput: [2, 4, 6]
            }
          ],
        },
      },
    ],
  },
  {
    name: 'Logic Lab',
    type: 'syntaxia',
    description: 'Explore conditional logic and control flow.',
    requiredXP: 500,
    order: 3,
    stations: [
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Conditional Logic',
        description: 'Master if statements and logical operators.',
        order: 1,
        xpReward: 150,
        currencyReward: 300,
        challenge: {
          instructions: 'Write a function that returns "fizz" for multiples of 3, "buzz" for multiples of 5, and "fizzbuzz" for multiples of both.',
          initialCode: 'function fizzBuzz(number) {\n  // Your code here\n}',
          testCases: [
            {
              input: 15,
              expectedOutput: "fizzbuzz"
            },
            {
              input: 3,
              expectedOutput: "fizz"
            }
          ],
        },
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Switch Statements',
        description: 'Learn to use switch statements effectively.',
        order: 2,
        xpReward: 175,
        currencyReward: 350,
        challenge: {
          instructions: 'Create a function that converts numerical grades to letter grades (A, B, C, D, F).',
          initialCode: 'function getLetterGrade(score) {\n  // Your code here\n}',
          testCases: [
            {
              input: 95,
              expectedOutput: "A"
            },
            {
              input: 72,
              expectedOutput: "C"
            }
          ],
        },
      },
    ],
  },
  {
    name: 'Algorithm Arena',
    type: 'quantumCore',
    description: 'Tackle advanced algorithms and data structures.',
    requiredXP: 1000,
    order: 4,
    stations: [
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Recursion',
        description: 'Master recursive problem-solving techniques.',
        order: 1,
        xpReward: 200,
        currencyReward: 400,
        challenge: {
          instructions: 'Write a recursive function to calculate the nth Fibonacci number.',
          initialCode: 'function fibonacci(n) {\n  // Your code here\n}',
          testCases: [
            {
              input: 6,
              expectedOutput: 8
            }
          ],
        },
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Sorting Algorithms',
        description: 'Implement and understand sorting algorithms.',
        order: 2,
        xpReward: 250,
        currencyReward: 500,
        challenge: {
          instructions: 'Implement bubble sort to sort an array of numbers in ascending order.',
          initialCode: 'function bubbleSort(arr) {\n  // Your code here\n}',
          testCases: [
            {
              input: [64, 34, 25, 12, 22, 11, 90],
              expectedOutput: [11, 12, 22, 25, 34, 64, 90]
            }
          ],
        },
      },
    ],
  },
];

export default planets;