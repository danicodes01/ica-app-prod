import { IPlanet } from '@/types/models/planet';
import { Types } from 'mongoose';

export const planets: IPlanet[] = [
  {
    name: 'Mission Control',
    type: 'missionControl',
    description:
      'Begin your intergalactic journey by mastering JavaScript fundamentals!',
    requiredXP: 0,
    order: 1,
    stations: [
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Variables & Strings',
        description: 'Learn to declare and work with variables.',
        order: 1,
        xpReward: 50,
        currencyReward: 100,
        challenge: {
          instructions:
            'Declare a variable called `playerName` and assign it your name as a string.',
          initialCode: '// Declare your variable here',
          type: 'variables',
          testCases: [
            {
              input: null,
              expectedOutput: {
                playerName: { type: 'string' },
              },
              description: 'The playerName variable should be a string.',
            },
          ],
        },
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Objects',
        description: 'Master creating and working with objects.',
        order: 2,
        xpReward: 75,
        currencyReward: 150,
        challenge: {
          instructions:
            'Create an object named `spaceship` with two properties: `name` (string) and `speed` (number).',
          initialCode: '// Create your spaceship object here',
          type: 'variables',
          testCases: [
            {
              input: null,
              expectedOutput: {
                spaceship: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    speed: { type: 'number' },
                  },
                },
              },
              description:
                'The spaceship object should have a name (string) and speed (number) property.',
            },
          ],
        },
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Arrays',
        description: 'Learn to work with arrays.',
        order: 3,
        xpReward: 75,
        currencyReward: 150,
        challenge: {
          instructions:
            'Create an array called `planetsVisited` and populate it with the names of three planets as strings.',
          initialCode: '// Create your array here',
          type: 'variables',
          testCases: [
            {
              input: null,
              expectedOutput: {
                planetsVisited: {
                  type: 'array',
                  length: 3,
                  elementType: 'string',
                },
              },
              description:
                'The planetsVisited array should contain exactly 3 strings.',
            },
          ],
        },
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Object Updates',
        description: 'Practice updating object properties.',
        order: 4,
        xpReward: 100,
        currencyReward: 200,
        challenge: {
          instructions:
            'Create a spaceship object with an initial speed of 5000, then update its speed to 7500.',
          initialCode: `// First create your spaceship object
// Then update its speed`,
          type: 'variables',
          testCases: [
            {
              input: null,
              expectedOutput: {
                spaceship: {
                  type: 'object',
                  properties: {
                    speed: { type: 'number', value: 7500 },
                  },
                },
              },
              description:
                'The spaceship object should have a speed property equal to 7500.',
            },
          ],
        },
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Functions',
        description: 'Learn to create and use functions.',
        order: 5,
        xpReward: 150,
        currencyReward: 300,
        challenge: {
          instructions:
            'Write a function named `greetPlayer` that takes a name parameter and returns a greeting message in the format: "Hello, {name}! Welcome aboard!"',
          initialCode: '// Write your function here',
          type: 'function',
          testCases: [
            {
              input: ['John'],
              expectedOutput: 'Hello, John! Welcome aboard!',
              description:
                'The function should return the correct greeting message.',
            },
            {
              input: ['Sarah'],
              expectedOutput: 'Hello, Sarah! Welcome aboard!',
              description: 'The function should work with different names.',
            },
          ],
        },
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Advanced Functions',
        description: 'Combine arrays and functions.',
        order: 6,
        xpReward: 200,
        currencyReward: 400,
        challenge: {
          instructions:
            'Write a function named `addPlanet` that takes two parameters: an array of planets and a new planet name. The function should add the new planet to the array and return the updated array.',
          initialCode: '// Write your function here',
          type: 'function',
          testCases: [
            {
              input: [['Earth', 'Mars'], 'Venus'],
              expectedOutput: ['Earth', 'Mars', 'Venus'],
              description:
                'The function should add the new planet to the array.',
            },
            {
              input: [['Mercury'], 'Saturn'],
              expectedOutput: ['Mercury', 'Saturn'],
              description:
                'The function should work with different arrays and planets.',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'SYNTAXIA',
    type: 'syntaxia',
    description: 'Master loops, functions, and control flow.',
    requiredXP: 650, 
    order: 2,
    stations: [
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Function Parameters',
        description:
          'Learn to write functions that take parameters and return values.',
        order: 1,
        xpReward: 150,
        currencyReward: 300,
        challenge: {
          instructions:
            'Write a function named `calculateFuel` that takes the `distance` (in lightyears) as a parameter and returns the fuel required, assuming 500 units of fuel are needed per lightyear.',
          initialCode: '// Write your calculateFuel function here',
          type: 'function',
          testCases: [
            {
              input: [2],
              expectedOutput: 1000,
              description: 'Should calculate fuel for 2 lightyears',
            },
            {
              input: [5],
              expectedOutput: 2500,
              description: 'Should calculate fuel for 5 lightyears',
            },
          ],
        },
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'For Loop Basics',
        description: 'Master basic for loops and console output.',
        order: 2,
        xpReward: 175,
        currencyReward: 350,
        challenge: {
          instructions:
            'Write a function named `countToTen` that uses a for loop to log the numbers from 1 to 10 to the console.',
          initialCode: '// Write your countToTen function here',
          type: 'function',
          testCases: [
            {
              input: [],
              expectedOutput: undefined,
              description: 'Should log numbers 1 through 10',
            },
          ],
        },
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Functions with Loops',
        description: 'Combine functions and loops for repeated operations.',
        order: 3,
        xpReward: 200,
        currencyReward: 400,
        challenge: {
          instructions:
            'Write a function named `repeatMessage` that takes a `message` and a `times` parameter. Use a loop to print the message to the console the specified number of times.',
          initialCode: '// Write your repeatMessage function here',
          type: 'function',
          testCases: [
            {
              input: ['Hello', 3],
              expectedOutput: undefined,
              description: 'Should print "Hello" 3 times',
            },
          ],
        },
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Array Loops',
        description: 'Learn to iterate through arrays using loops.',
        order: 4,
        xpReward: 225,
        currencyReward: 450,
        challenge: {
          instructions:
            'Write a function named `listPlanets` that takes an array of planet names as a parameter and logs each planet to the console.',
          initialCode: '// Write your listPlanets function here',
          type: 'function',
          testCases: [
            {
              input: [['Earth', 'Mars', 'Venus']],
              expectedOutput: undefined,
              description: 'Should log each planet name',
            },
          ],
        },
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Object Iteration',
        description: 'Practice iterating over object properties.',
        order: 5,
        xpReward: 250,
        currencyReward: 500,
        challenge: {
          instructions:
            'Write a function named `logPlanetDistances` that takes an object where the keys are planet names and the values are distances in lightyears. Log each planet and its distance to the console in the format "planetName: distance lightyears".',
          initialCode: '// Write your logPlanetDistances function here',
          type: 'function',
          testCases: [
            {
              input: [{ Earth: 0, Mars: 1.5, Venus: 0.7 }],
              expectedOutput: undefined,
              description: 'Should log each planet and its distance',
            },
          ],
        },
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Nested Loops',
        description: 'Master the concept of nested loops.',
        order: 6,
        xpReward: 300,
        currencyReward: 600,
        challenge: {
          instructions:
            'Write a function named `printGrid` that takes a number `n` as a parameter and logs an `n x n` grid of `*` to the console.',
          initialCode: '// Write your printGrid function here',
          type: 'function',
          testCases: [
            {
              input: [3],
              expectedOutput: undefined,
              description: 'Should print a 3x3 grid of stars',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'CHROMANOVA',
    type: 'chromanova',
    description: 'Master functions and problem-solving.',
    requiredXP: 450,
    order: 3,
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
          instructions:
            'Write a function named `calculateArea` that accepts two parameters, `width` and `height`, and returns their product.',
          initialCode: '// Define your calculateArea function here',
          type: 'function',
          testCases: [
            {
              input: [5, 3],
              expectedOutput: 15,
              description:
                'The function should return the area of a rectangle with width 5 and height 3.',
            },
            {
              input: [2, 4],
              expectedOutput: 8,
              description:
                'The function should return the area of a rectangle with width 2 and height 4.',
            },
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
          instructions:
            'Write a function named `filterEvenNumbers` that takes an array of numbers as input and returns a new array containing only the even numbers.',
          initialCode: '// Define your filterEvenNumbers function here',
          type: 'function',
          testCases: [
            {
              input: [1, 2, 3, 4, 5, 6],
              expectedOutput: [2, 4, 6],
              description:
                'The function should return an array of even numbers from the input array.',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'QUANTUMCORE',
    type: 'quantumCore',
    description:
      'Where quantum algorithms and data science solve complex problems',
    requiredXP: 675,
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
          instructions:
            'Write a recursive function named `fibonacci` that takes a number `n` and returns the nth Fibonacci number.',
          initialCode: '// Define your fibonacci function here',
          type: 'algorithm',
          testCases: [
            {
              input: 6,
              expectedOutput: 8,
              description:
                'The function should return the 6th Fibonacci number, which is 8.',
            },
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
          instructions:
            'Write a function named `bubbleSort` that sorts an array of numbers in ascending order using the bubble sort algorithm.',
          initialCode: 'function bubbleSort(arr) {\n  // Your code here\n}',
          type: 'algorithm',
          testCases: [
            {
              input: [64, 34, 25, 12, 22, 11, 90],
              expectedOutput: [11, 12, 22, 25, 34, 64, 90],
              description:
                'The function should correctly sort the array [64, 34, 25, 12, 22, 11, 90] in ascending order.',
            },
          ],
        },
      },
    ],
  },
];

export default planets;
