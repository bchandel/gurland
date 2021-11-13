const router = require('express').Router();
const gener = require('./gener');


/*
* Route file to add all RestAPI end-point related to Geners
*/


const getAllGeners = async (req, res) => {
  try {
    let data = await gener.generService(req.db).getAllGeners();
    return res.status(200).json({success: true, data: data});
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const addGener = async (req, res) => {
  try {
    let data = await gener.generService(req.db).addGener(req.body);
    return res.status(200).json({success: true,  data: data});
  } catch (err) {
    
    if (err.message == "Gener validation failed: name: Path `name` is required.") {
      return res.status(500).send({ succes: false, message: 'Gener name is required field!' });
    }
    return res.status(500).json({success: false, message: err.message });
  }
};

const removeGenerByName = async (req, res) => {
  try {
    if(!req.params.name){
      return res.status(400).json({message: 'Bad request please provide Gener Name'});
    }
    let data = await gener.generService(req.db).removeGenerByName(req.params.name);
    if(data.deletedCount ==1 & data.ok){
      return res.status(200).json({succes: true,  message: `${req.params.name} Gener deleted!`});
    }
    return res.status(200).json({success: false,  data: data});
  } catch (err) {
    return res.status(500).json({success: false, message: err.message });
  }
};


router
  .post('/add-gener',addGener)
  .delete('/remove-gener/:name',removeGenerByName)
  .get('/get-all-geners', getAllGeners);
  
module.exports = router;
