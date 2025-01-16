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
          instructions:
            'Create a variable `age` and assign it any number, then create a variable `name` and assign it your name as a string.',
          initialCode: '// Declare your variables here',
          type: 'variables',
          testCases: [
            {
              input: null,
              expectedOutput: {
                age: { type: 'number' },
                name: { type: 'string' },
              },
              description:
                'The `age` variable should be assigned a numeric value, and the `name` variable should hold a string representing a name.',
            },
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
          instructions:
            'Create an array or list named `fruits` containing three different strings. Then create an object or collection named `person` with the properties `name` (a string) and `age` (a number).',
          initialCode: '// Declare your variables here',
          type: 'variables',
          testCases: [
            {
              input: null,
              expectedOutput: {
                fruits: { type: 'array', length: 3, elementType: 'string' },
                person: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    age: { type: 'number' },
                  },
                },
              },
              description:
                'The `fruits` array should contain exactly three string elements, and the `person` object should include a `name` property with a string value and an `age` property with a numeric value.',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'SYNTAXIA',
    type: 'syntaxia',
    description: 'Explore conditional logic and control flow.',
    requiredXP: 125,
    order: 2,
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
          instructions:
          'Write a function named `fizzBuzz` that takes a number as input and returns "fizz" if the number is a multiple of 3, "buzz" if it is a multiple of 5, and "fizzbuzz" if it is a multiple of both.',        
          initialCode: '// Define your fizzBuzz function here',
          type: 'function',
          testCases: [
            {
              input: 15,
              expectedOutput: 'fizzbuzz',
              description: 'The function should return "fizzbuzz" for numbers that are multiples of both 3 and 5.',
            },
            {
              input: 3,
              expectedOutput: 'fizz',
              description: 'The function should return "fizz" for numbers that are multiples of 3 only.',
            },
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
          instructions:
          'Write a function named `getLetterGrade` that takes a numerical score as input and returns the corresponding letter grade: "A" for scores 90 and above, "B" for 80-89, "C" for 70-79, "D" for 60-69, and "F" for below 60.',        
          initialCode: '// Define your getLetterGrade function here',
          type: 'function',
          testCases: [
            {
              input: 95,
              expectedOutput: 'A',
              description: 'The function should return "A" for scores of 90 or higher.',
            },
            {
              input: 72,
              expectedOutput: 'C',
              description: 'The function should return "C" for scores between 70 and 79.',
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
              description: 'The function should return the area of a rectangle with width 5 and height 3.',
            },
            {
              input: [2, 4],
              expectedOutput: 8,
              description: 'The function should return the area of a rectangle with width 2 and height 4.',
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
              description: 'The function should return an array of even numbers from the input array.',
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
              description: 'The function should return the 6th Fibonacci number, which is 8.',
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
              description: 'The function should correctly sort the array [64, 34, 25, 12, 22, 11, 90] in ascending order.',
            },
          ],
        },
      },
    ],
  },
];

export default planets;
