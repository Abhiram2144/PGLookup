const Review = require('../models/review');
const Pg = require('../models/pg');

const createReview = async(req,res)=>{
    const uid = req.params.uid;
    const pgid = req.params.pgid;
    const {rating,reviewDescription} = req.body;
    const review = new Review({
        pgId:pgid,
        rating:rating,
        reviewDescription:reviewDescription,
        userId:uid
    });

    try{
        const savedReview = await review.save();
        const pg = await Pg.findOneAndUpdate({_id:pgid},{ $push: { reviews: savedReview._id } });  //add the id of the new review to

        res.status(200).send({review:savedReview,});
    }
    catch(err){
        res.json({message:err});
    }
}

const getReviews = async(req,res)=>{
    try{
        const reviews = await Review.findMany({include: [{model: User, as: 'user'}]});
        res.send({reviews:reviews},200);
    }
    catch(err){
        res.json({message:err});
    }
}

const getReviewById = async(req,res)=>{
    const rid = req.params.rid;
    try{
        const review = await Review.findOne({_id:rid},{include: [{model: User, as: 'user'}]});
        res.send({review:review},200);
    }
    catch(err){
        res.json({message:err});
    }
}

const deleteReview = async(req,res)=>{
    const rid = req.params.rid;
    try{
        const deletedReview = await Review.deleteOne({_id:rid});
        res.send({review:deletedReview},200);
    }
    catch(err){
        res.json({message:err});
    }
}

const editReview = async(req,res)=>{
    const rid = req.params.rid;
    const {rating,reviewDescription} = req.body;
    try{
        const updatedReview = await Review.updateOne({_id:rid},{rating:rating,reviewDescription:reviewDescription});
        res.send({review:updatedReview},200);
    }
    catch(err){
        res.json({message:err});
    }
}

module.exports = {createReview, getReviews, getReviewById, deleteReview, editReview};