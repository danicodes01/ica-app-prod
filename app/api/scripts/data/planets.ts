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
    description: 'Master advanced array methods and data transformation.',
    requiredXP: 1300, 
    order: 3,
    stations: [
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'forEach Method',
        description: 'Learn to iterate over arrays using forEach.',
        order: 1,
        xpReward: 250,
        currencyReward: 500,
        challenge: {
          instructions: 'Write a function named `logCrewMembers` that takes an array of crew member names and logs each name to the console using the forEach method.',
          initialCode: '// Write your logCrewMembers function here',
          type: 'function',
          testCases: [
            {
              input: [['John', 'Sarah', 'Mike']],
              expectedOutput: null,
              description: 'Should log each crew member name'
            }
          ]
        }
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Filter Method',
        description: 'Practice filtering arrays based on conditions.',
        order: 2,
        xpReward: 300,
        currencyReward: 600,
        challenge: {
          instructions: 'Write a function named `filterLargePlanets` that takes an array of planet objects, each with a `name` and `size` property, and returns an array of planets where `size` is greater than 10,000.',
          initialCode: '// Write your filterLargePlanets function here',
          type: 'function',
          testCases: [
            {
              input: [[
                { name: 'Jupiter', size: 15000 },
                { name: 'Mars', size: 5000 },
                { name: 'Saturn', size: 12000 }
              ]],
              expectedOutput: [
                { name: 'Jupiter', size: 15000 },
                { name: 'Saturn', size: 12000 }
              ],
              description: 'Should return only planets with size > 10000'
            }
          ]
        }
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Map Method',
        description: 'Transform array elements using map.',
        order: 3,
        xpReward: 350,
        currencyReward: 700,
        challenge: {
          instructions: 'Write a function named `getPlanetNames` that takes an array of planet objects (each with a `name` property) and returns an array of planet names.',
          initialCode: '// Write your getPlanetNames function here',
          type: 'function',
          testCases: [
            {
              input: [[
                { name: 'Mars', distance: 2 },
                { name: 'Venus', distance: 1 }
              ]],
              expectedOutput: ['Mars', 'Venus'],
              description: 'Should extract only the planet names'
            }
          ]
        }
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Reduce Method',
        description: 'Learn to use reduce for array calculations.',
        order: 4,
        xpReward: 400,
        currencyReward: 800,
        challenge: {
          instructions: 'Write a function named `calculateTotalDistance` that takes an array of distances (in lightyears) and returns the total distance.',
          initialCode: '// Write your calculateTotalDistance function here',
          type: 'function',
          testCases: [
            {
              input: [[1.5, 2.7, 3.2]],
              expectedOutput: 7.4,
              description: 'Should sum all distances'
            }
          ]
        }
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Nested Arrays',
        description: 'Master working with nested array structures.',
        order: 5,
        xpReward: 450,
        currencyReward: 900,
        challenge: {
          instructions: 'Write a function named `printStarSystems` that takes an array of star systems, where each star system is an array of planet names, and logs each planet\'s name grouped by its star system.',
          initialCode: '// Write your printStarSystems function here',
          type: 'function',
          testCases: [
            {
              input: [[['Earth', 'Mars'], ['Alpha', 'Beta']]],
              expectedOutput: null,
              description: 'Should log planets grouped by star system'
            }
          ]
        }
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Array Sorting',
        description: 'Learn to sort complex array structures.',
        order: 6,
        xpReward: 500,
        currencyReward: 1000,
        challenge: {
          instructions: 'Write a function named `sortPlanetsByDistance` that takes an array of planet objects, each with a `name` and `distance` property, and returns the array sorted by `distance` in ascending order.',
          initialCode: '// Write your sortPlanetsByDistance function here',
          type: 'function',
          testCases: [
            {
              input: [[
                { name: 'Mars', distance: 2 },
                { name: 'Venus', distance: 1 },
                { name: 'Jupiter', distance: 5 }
              ]],
              expectedOutput: [
                { name: 'Venus', distance: 1 },
                { name: 'Mars', distance: 2 },
                { name: 'Jupiter', distance: 5 }
              ],
              description: 'Should sort planets by distance'
            }
          ]
        }
      }
    ]
  },
  {
    name: 'QUANTUMCORE',
    type: 'quantumCore',
    description: 'Master advanced algorithms and data structures.',
    requiredXP: 3550, 
    order: 4,
    stations: [
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Recursive Factorial',
        description: 'Learn recursive problem-solving with factorial calculation.',
        order: 1,
        xpReward: 500,
        currencyReward: 1000,
        challenge: {
          instructions: 'Write a function named `calculateFactorial` that takes a number `n` and returns its factorial using recursion.',
          initialCode: '// Write your calculateFactorial function here',
          type: 'function',
          testCases: [
            {
              input: [5],
              expectedOutput: 120,
              description: 'Should calculate 5! = 120'
            },
            {
              input: [0],
              expectedOutput: 1,
              description: 'Should handle 0! = 1'
            }
          ]
        }
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Binary Search',
        description: 'Implement efficient searching algorithm.',
        order: 2,
        xpReward: 600,
        currencyReward: 1200,
        challenge: {
          instructions: 'Write a function named `binarySearch` that takes a sorted array of numbers and a target number. Return the index of the target number, or -1 if it is not found.',
          initialCode: '// Write your binarySearch function here',
          type: 'function',
          testCases: [
            {
              input: [[1, 2, 3, 4, 5, 6], 4],
              expectedOutput: 3,
              description: 'Should find index 3 for target 4'
            },
            {
              input: [[1, 2, 3, 4, 5], 6],
              expectedOutput: -1,
              description: 'Should return -1 for missing target'
            }
          ]
        }
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Merge Sort',
        description: 'Implement the merge sort algorithm.',
        order: 3,
        xpReward: 700,
        currencyReward: 1400,
        challenge: {
          instructions: 'Write a function named `mergeSort` that takes an array and returns it sorted in ascending order using the merge sort algorithm. You can define helper functions if needed.',
          initialCode: '// Write your mergeSort and any helper functions here',
          type: 'function',
          testCases: [
            {
              input: [[64, 34, 25, 12, 22, 11, 90]],
              expectedOutput: [11, 12, 22, 25, 34, 64, 90],
              description: 'Should sort array in ascending order'
            }
          ]
        }
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'BFS Traversal',
        description: 'Learn breadth-first graph traversal.',
        order: 4,
        xpReward: 800,
        currencyReward: 1600,
        challenge: {
          instructions: 'Write a function named `bfsTraversal` that takes an adjacency list representing a graph and a starting node. Return an array of nodes visited in BFS order.',
          initialCode: '// Write your bfsTraversal function here',
          type: 'function',
          testCases: [
            {
              input: [{ 'A': ['B', 'C'], 'B': ['D'], 'C': ['D'], 'D': [] }, 'A'],
              expectedOutput: ['A', 'B', 'C', 'D'],
              description: 'Should traverse graph in BFS order'
            }
          ]
        }
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'DFS Traversal',
        description: 'Master depth-first graph traversal.',
        order: 5,
        xpReward: 900,
        currencyReward: 1800,
        challenge: {
          instructions: 'Write a function named `dfsTraversal` that takes an adjacency list representing a graph and a starting node. Return an array of nodes visited in DFS order.',
          initialCode: '// Write your dfsTraversal function here',
          type: 'function',
          testCases: [
            {
              input: [{ 'A': ['B', 'C'], 'B': ['D'], 'C': ['D'], 'D': [] }, 'A'],
              expectedOutput: ['A', 'B', 'D', 'C'],
              description: 'Should traverse graph in DFS order'
            }
          ]
        }
      },
      {
        _id: new Types.ObjectId(),
        stationId: new Types.ObjectId(),
        name: 'Dynamic Programming',
        description: 'Solve optimization problems using dynamic programming.',
        order: 6,
        xpReward: 1000,
        currencyReward: 2000,
        challenge: {
          instructions: 'Write a function named `longestIncreasingSubsequence` that takes an array of numbers and returns the length of the longest increasing subsequence.',
          initialCode: '// Write your longestIncreasingSubsequence function here',
          type: 'function',
          testCases: [
            {
              input: [[10, 9, 2, 5, 3, 7, 101, 18]],
              expectedOutput: 4,
              description: 'Should find length of longest increasing subsequence'
            }
          ]
        }
      }
    ]
  },
];

export default planets;
