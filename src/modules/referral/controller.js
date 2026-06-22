const service = require("./service");

exports.getStats = async (req,res)=>{

    const data = await service.getStats(req.user.id);

    res.json({
        status:true,
        data
    });
};

exports.getHistory = async (req,res)=>{

    const data = await service.getHistory(req.user.id);

    res.json({
        status:true,
        data
    });
};