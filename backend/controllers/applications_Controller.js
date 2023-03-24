const express = require("express");
const Application = require('../models/applicationModel')
const mongoose = require('mongoose')

require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const app = express();
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });
  const openai = new OpenAIApi(configuration);
  
const getSummary = async(req,res) => {
    try {
          const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `DO NOT remove any HTML tags in the req.body.data\n\n Summarize based on the headings that appear: "Duties will include", "Requirements", "about", "about the company", "What you bring to the table:", "How we are hiring for this role", ", "About the job", "skills", "benifits", "technical skills", "Your Role and Responsibilities".\n\n`
          + (req.body.data) + '\n\n\nA:',
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 1,
        });
        return res.status(200).json({
          success: true,
          data: response.data.choices[0].text,
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: error.response
            ? error.response.data
            : "There was an issue on the server",
        });
      }

    }

  const getInterviewQuestions = async(req,res) => {
      try {
          const response = await openai.createCompletion({
              model: "text-davinci-003",
              prompt: "Create a list of " + req.body.number + 
              " questions for a "+ req.body.interviewType + " position." +
              "Ensure that they are technical questions and test concepts.",
              temperature: 0.5,
              max_tokens: 2000,
              top_p: 1.0,
              frequency_penalty: 0.0,
              presence_penalty: 0.0,
          });
          console.log(response.data.choices[0])
          var temp = "Hello, it's great to meet you. Thank you for taking the time to speak with us today " +
          "We're really excited to learn more about your background, experience, and skills. Without further a do, let's begin\n"+ 
          response.data.choices[0].text.replace(/^\s+/, '') + "\n" +
          "Thank you for taking the time to interview with us today. We appreciate your interest in this position"  + 
          "and your thoughtful responses to our questions. Do you have any questions for us before we wrap up?"
        
          return res.status(200).json({
            success: true,
            data: temp,
          });
        
        } catch (error) {
          console.log(error)
          return res.status(400).json({
            success: false,
            error: error.response
              ? error.response.data
              : "There was an issue on the server",
          });
        }
  }

  const addApplication = async(req,res) => {
    const {jobTitle, positionType, company, dateApplied, applicationDeadline, link, jobDescription} = req.body
    
    date_applied = dateApplied ? new Date(dateApplied): ""
    application_Deadline = applicationDeadline ? new Date(applicationDeadline): ""

    // add doc to db
    try{
        const application = await Application.create({jobTitle, positionType, company, date_applied, application_Deadline, link, jobDescription})
        res.status(200).json(application)
    } catch(error){
        res.status(400).json({error:error.message})

    }
  }

  const getApplications = async(req,res) => {deleteApplication
    try {
      const applications = await Application.find().sort({ updatedAt: -1 });;
      return res.status(200).json({ success: true, data: applications });
    } catch (error) {
      console.error(error);
      return res.status(404).json({ success: false, error: 'Not Found' });
    }
    
  }
  const deleteApplication = async(req,res) => {
    try {
      const {id} = req.params
      if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'})
      }
      const application = await Application.findOneAndDelete({_id: id})
      if(!application){
          return res.status(404).json({error: "No such Application"})
      }
      console.log(application)
      res.status(200).json(application)
    }
    catch(error){
      console.error(error)
      return res.status(404).json({ success: false, error: 'Not Found' });
    }
    
  }
  const updateApplication = async(req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such Application'})
    }
    const application = await Application.findOneAndUpdate({_id: id}, {...req.body})
    if(!application){
        return res.status(404).json({error: "No such Application"})
    }
    res.status(200).json(application)
  }
    
// get a single workout
const getWorkout = async (req,res) => { 
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'})
    }
    const workout = await Workout.findById(id)
    if(!workout){
        return res.status(404).json({error: "No such workout"})
    }
    res.status(200).json(workout)

}
//create new workout
const createWorkout = async(req,res) =>{
    const{title, load, reps} = req.body
    // add doc to db
    try{
        const workout = await Workout.create({title, load, reps})
        res.status(200).json(workout)
    } catch(error){
        res.status(400).json({error:error.message})

    }
    res.json({mssg: 'POST a new workout'})
}

//delete a workout
const deleteWorkout = async(req,res) =>{
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'})
    }
    const workout = await Workout.findOneAndDelete({_id: id})
    if(!workout){
        return res.status(404).json({error: "No such workout"})
    }
    res.status(200).json(workout)
}
//update a workout
const updateWorkout = async(req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'})
    }
    const workout = await Workout.findOneAndUpdate({_id: id}, {...req.body})
    if(!workout){
        return res.status(404).json({error: "No such workout"})
    }
    res.status(200).json(workout) 
}

module.exports = {
    getSummary,
    getInterviewQuestions,
    addApplication,
    getApplications,
    deleteApplication,
    updateApplication
}