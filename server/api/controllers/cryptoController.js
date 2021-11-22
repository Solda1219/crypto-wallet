'use strict';


var mongoose = require('mongoose'),
 TopTokens = mongoose.model('TopTokens');

exports.read_topToken_history = function(req, res) {
  TopTokens.find({}, function(err, topTokens) {
    if (err)
      res.send(err);
    res.json(topTokens);
  });
};




exports.create_topToken_history = function(req, res) {
  var new_task = new TopTokens(req.body);
  new_task.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.make_history_data = function(data) {
    var new_data= new TopTokens(data);
    new_data.save(function(err, topTokens){
        if(err){
            console.log(err);
        }
        else{
            TopTokens.find({}, function(err, topTokens){
                if(err)
                    console.log(err);
                for(var i= 0; i<topTokens.length-1; i++){
                    if(new_data.updated_at- topTokens[i].updated_at> 24 * 60 * 60 * 1000){
                        TopTokens.remove({_id: topTokens[i]._id});
                    }
                }
            });
        }
    });
};

exports.read_a_task = function(req, res) {
  TopTokens.findById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.update_a_task = function(req, res) {
  TopTokens.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.delete_a_task = function(req, res) {


  TopTokens.remove({
    _id: req.params.taskId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};

exports.delTopTokenHistory = function(req, res) {
    TopTokens.deleteMany({}, function(err, topTokens){
        if (err)
            res.send(err);
        res.json({message: "Delted All History"});
    });
}