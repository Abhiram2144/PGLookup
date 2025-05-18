const college = require('../models/college');

const getColleges = async (req, res) => {
    try {
        const colleges = await college.find();
        res.status(200).json({colleges:colleges, message:"Fetched "});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getCollegeById = async (req, res) => {
    const { collegeid } = req.params.clgid;
    try {
        const college = await college.findById(collegeid);
        if(!college)
        {
            return res.status(404).json({ message: "College not found" });
        }
        res.status(200).json(college);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const createCollege = async (req, res) => {
    const { cityName, collegeName, collegeAddress } = req.body;
    const clg = await college.findOne({ collegeName });
    if(clg)
    {
        return res.status(400).json({ message: "College already exists" });
    }
    const newCollege = new college({ cityName, collegeName, collegeAddress });
    try {
        await newCollege.save();
        res.status(201).json({college: newCollege, message: "College created successfully"});
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const updateCollege = async (req, res) => 
{
    const clgid = req.params.clgid;
    const { cityName, collegeName, collegeAddress } = req.body;
    const college = await college.findById(clgid);
    if(!college)
    {
        return res.status(404).json({ message: "College not found" });
    }
    try {
        await college.updateOne({_id: clgid}, { cityName, collegeName, collegeAddress });
        res.status(200).json({college: college, message: "College updated successfully"});
    } catch (error) {
        res.status(409).json({ message: error.message });
    }

}

const deleteCollege = async (req, res) => 
{
    const clgid = req.params.clgid;
    const college = await college.findById(clgid);
    if(!college)
    {
        return res.status(404).json({ message: "College not found" });
    }
    try {
        await college.deleteOne({_id: clgid});
        res.status(200).json({college: college, message: "College deleted successfully"});
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

module.exports = { getColleges, getCollegeById, createCollege, updateCollege, deleteCollege };