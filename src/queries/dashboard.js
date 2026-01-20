const mongoose = require("mongoose");

exports.employeeDashboardPipeline = (userId) => {
    return [
        {
            $match: {
                assignedTo: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: {
                    $cond: [
                        { $in: ["$status", ["INPROGRESS", "COMPLETE", "HOLD", "TODO"]] },
                        "$status",
                        "QC"
                    ]
                },
                count: { $sum: 1 }
            }
        }
    ];
}

exports.projectDashboardPipeline = () => {
    return [
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ];
};

exports.clientDashboardPipeline = (userId) => {
    return [
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ];
};
