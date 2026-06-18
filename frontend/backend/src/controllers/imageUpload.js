const cloudinary = require("../utils/cloudinary");
const Problem = require('../models/problem')
const User = require('../models/user')
const Submission = require('../models/submission')

const getUserProfileData = async (req, res) => {
    try {
        const userId = req.result._id; // Extracted via your userAuth middleware

        // 1. Fetch total counts of problems platform-wide by difficulty
        const platformStats = await Problem.aggregate([
            {
                $group: {
                    _id: "$difficulty",
                    count: { $sum: 1 }
                }
            }
        ]);

        let totalPlatformProblems = 0;
        const totalByDifficulty = { easy: 0, medium: 0, hard: 0 };

        platformStats.forEach(stat => {
            if (stat._id && totalByDifficulty[stat._id.toLowerCase()] !== undefined) {
                totalByDifficulty[stat._id.toLowerCase()] = stat.count;
                totalPlatformProblems += stat.count;
            }
        });

        // 2. Fetch current user data
        const user = await User.findById(userId).select('firstName lastName emailId profilePic');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 3. Find unique correct (accepted) problem IDs solved by this user
        const solvedProblemIds = await Submission.distinct("problemId", {
            userId: userId,
            status: "accepted"
        });

        // 4. Fetch details of those unique solved problems to categorize by difficulty
        const solvedProblemsDetails = await Problem.find({
            _id: { $in: solvedProblemIds }
        }).select('difficulty');

        const userSolvedStats = { easy: 0, medium: 0, hard: 0 };
        solvedProblemsDetails.forEach(prob => {
            if (prob.difficulty && userSolvedStats[prob.difficulty.toLowerCase()] !== undefined) {
                userSolvedStats[prob.difficulty.toLowerCase()]++;
            }
        });

        const totalUserSolved = solvedProblemIds.length;
        const totalSubmissions = await Submission.countDocuments({ userId });

        // 5. Calculate Leaderboard Ranking dynamically across all users
        // Group all submissions by user where status is accepted to find unique problems solved per user
        const leaderboard = await Submission.aggregate([
            { $match: { status: "accepted" } },
            { $group: { _id: "$userId", uniqueSolved: { $addToSet: "$problemId" } } },
            { $project: { _id: 1, solvedCount: { $size: "$uniqueSolved" } } },
            { $sort: { solvedCount: -1 } }
        ]);

        // Find current user's position in the list
        let rank = leaderboard.findIndex(item => item._id.toString() === userId.toString()) + 1;

        // If the user hasn't solved any problems yet, place them at the end
        if (rank === 0) {
            const totalUsersCount = await User.countDocuments();
            rank = totalUsersCount;
        }

        const recentSubmissions = await Submission.find({ userId })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate({ path: 'problemId', select: 'title' })
            .select('status runtime createdAt problemId');

        return res.status(200).json({
            name: `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`,
            email: user.emailId,
            profilePic: user.profilePic || "",
            rank: rank,
            totalSubmissions,
            recentSubmissions: recentSubmissions.map((submission) => ({
                title: submission.problemId?.title || 'Unknown Problem',
                status: submission.status,
                runtime: submission.runtime,
                createdAt: submission.createdAt
            })),
            solvedStats: {
                totalSolved: totalUserSolved,
                totalPlatform: totalPlatformProblems,
                easySolved: userSolvedStats.easy,
                easyTotal: totalByDifficulty.easy,
                mediumSolved: userSolvedStats.medium,
                mediumTotal: totalByDifficulty.medium,
                hardSolved: userSolvedStats.hard,
                hardTotal: totalByDifficulty.hard
            }
        });

    } catch (error) {
        console.error("Profile Query Failure:", error);
        return res.status(500).json({ message: "Failed to fetch dynamic profile metrics" });
    }
};

// Update profile photo metadata endpoint
const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.result._id;
        console.log(req.file);
        if (!req.file) {
            return res.status(400).json({ message: "No image file received." });
        }
    
        const uploadFromBuffer = () => {
            console.log('Hello')
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'thinkcode_profiles',
                        // upload_preset: 'thinkcode_preset',
                        resource_type: 'image'
                    },
                    (error, result) => {
                        if (result) resolve(result);
                        else {
                            console.error("Cloudinary Error Detail:", error);
                            reject(error);
                        }
                    }
                );
                // Write the pure uncompressed memory buffer straight out to Cloudinary
                stream.end(req.file.buffer);
            });
        };
        console.log('Hello')

        const cloudinaryResult = await uploadFromBuffer();
        console.log(cloudinaryResult)
        const secureUrl = cloudinaryResult.secure_url;
        // 2. Commit the cloud asset destination url to MongoDB
        await User.findByIdAndUpdate(userId, { profilePic: secureUrl });

        return res.status(200).json({
            message: "Upload successful!",
            profilePic: secureUrl
        });

    } catch (error) {
        console.error("Multipart routing failure:", error);
        return res.status(500).json({ message: "File processing or upload pipeline crashed" });
    }
};

module.exports = { getUserProfileData, updateProfilePicture }