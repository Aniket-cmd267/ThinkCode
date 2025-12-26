const json ={
    "title": "Add Two Numbers",
    "description": "Write a program that takes two integers as input and returns their sum.",
    "difficulty": "easy",
    "tags": "array",
    "visibleTestCases": [
        {
            "input": "2 3",
            "output": "5",
            "explanation": "2 + 3 equals 5"
        },
        {
            "input": "-1 5",
            "output": "4",
            "explanation": "-1 + 5 equals 4"
        }
    ],
    "hiddenTestCases": [
        {
            "input": "10 20",
            "output": "30"
        },
        {
            "input": "100 250",
            "output": "350"
        }
    ],
    "startCode": [
        {
            "language": "C++",
            "initialCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    // Read input here\n    cout << a + b;\n    return 0;\n}"
        },
        {
            "language": "Java",
            "initialCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Read input here\n    }\n}"
        },
        {
            "language": "JavaScript",
            "initialCode": "const readline = require('readline');\n\n// Complete input handling here"
        }
    ],
    "referenceSolution": [
        {
            "language": "C++",
            "completeCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b;\n    return 0;\n}"
        },
        {
            "language": "Java",
            "completeCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}"
        },
        {
            "language": "JavaScript",
            "completeCode": "const input = require('fs').readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\nconsole.log(a + b);"
        }
    ]
}


// #include<iostream>
// using namespace std;

// int main(){
//     int a,b;
//     cin>>a>>b;
//     cout<<a+b;
//     return 0;
// }

// const input = require('fs').readFileSync(0, 'utf-8').trim();
// const [a, b] = input.split(' ').map(Number);
// console.log(a + b);


// const user = await User.findById(req.user._id)
//       .populate({
//         path: 'problemSolved',
//         select: 'title difficulty tags createdAt', // Select needed fields
//       });






userSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
      await mongoose.model('submission').deleteMany({ userId: doc._id });
    }
});


submissionSchema.index({userId:1,problemId:1});

const redisClient = require('./redisClient');

const submitCodeRateLimiter = async (req, res, next) => {
  const userId = req.result._id; 
  const redisKey = `submit_cooldown:${userId}`;

  try {
    // Check if user has a recent submission
    const exists = await redisClient.exists(redisKey);
    
    if (exists) {
      return res.status(429).json({
        error: 'Please wait 10 seconds before submitting again'
      });
    }

    // Set cooldown period
    await redisClient.set(redisKey, 'cooldown_active', {
      EX: 10, // Expire after 10 seconds
      NX: true // Only set if not exists
    });

    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = submitCodeRateLimiter;



const twoSumProblem = {
    title: "Two Sum",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    difficulty: "easy",
    tags: "arrays",
    visibleTestCases: [
        {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        },
        {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
            explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
        }
    ],
    hiddenTestCases: [
        {
            input: "nums = [3,3], target = 6",
            output: "[0,1]"
        },
        {
            input: "nums = [1,5,10,25,3], target = 28",
            output: "[3,4]"
        },
        {
            input: "nums = [-1,-2,-3,-4,-5], target = -8",
            output: "[2,4]"
        }
    ],
    startCode: [
        {
            language: "javascript",
            initialCode: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};"
        },
        {
            language: "cpp",
            initialCode: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};"
        }
    ],
    referenceSolution: [
        {
            language: "javascript",
            completeCode: "var twoSum = function(nums, target) {\n const map = new Map();\n for (let i = 0; i < nums.length; i++) {\n const complement = target - nums[i];\n if (map.has(complement)) {\n return [map.get(complement), i];\n }\n map.set(nums[i], i);\n }\n};"
        }
    ],
    constraints: {
        inputConstraints: "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9. Only one valid answer exists.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
    },
    problemCreator: "658af1234567890abcdef123" // Example ObjectId
};



module.exports = {getLanguageById,submitBatch,submitToken};

// 


// {
//     "title": "Subtract Two Numbers",
//     "description": "Write a program that takes two integers as input and returns the result of the first number minus the second number (a - b).",
//     "difficulty": "easy",
//     "tags": "array",
//     "visibleTestCases": [
//         {
//             "input": "10 5",
//             "output": "5",
//             "explanation": "10 - 5 equals 5"
//         },
//         {
//             "input": "2 10",
//             "output": "-8",
//             "explanation": "2 - 10 equals -8"
//         }
//     ],
//     "hiddenTestCases": [
//         {
//             "input": "0 0",
//             "output": "0"
//         },
//         {
//             "input": "-5 -5",
//             "output": "0"
//         },
//         {
//             "input": "100 250",
//             "output": "-150"
//         }
//     ],
//     "startCode": [
//         {
//             "language": "C++",
//             "initialCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    // Read input and print subtraction here\n    return 0;\n}"
//         },
//         {
//             "language": "Java",
//             "initialCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Read input and print subtraction here\n    }\n}"
//         },
//         {
//             "language": "JavaScript",
//             "initialCode": "// Use fs.readFileSync(0) to read from stdin\nconst input = require('fs').readFileSync(0, 'utf-8');"
//         }
//     ],
//     "referenceSolution": [
//         {
//             "language": "C++",
//             "completeCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    if(cin >> a >> b) {\n        cout << a - b;\n    }\n    return 0;\n}"
//         },
//         {
//             "language": "Java",
//             "completeCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int a = sc.nextInt();\n            int b = sc.nextInt();\n            System.out.print(a - b);\n        }\n    }\n}"
//         },
//         {
//             "language": "JavaScript",
//             "completeCode": "const input = require('fs').readFileSync(0, 'utf-8').trim();\nconst parts = input.split(/\\s+/);\nif (parts.length >= 2) {\n    const a = parseInt(parts[0]);\n    const b = parseInt(parts[1]);\n    process.stdout.write((a - b).toString());\n}"
//         }
//     ]
// }