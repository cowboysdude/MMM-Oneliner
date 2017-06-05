/* Magic Mirror
    * Module: MMM-Oneliner
    *
    * By Cowboysdude
    * MIT Licensed.
    */
const NodeHelper = require('node_helper');
var oneLinerJoke = require('one-liner-joke');
const fs = require('fs');


module.exports = NodeHelper.create({

    start: function() {
        this.joke = {
            timestamp: null,
            data: null
        };
        this.path = "modules/MMM-Oneliner/joke.json";
        if (fs.existsSync(this.path)) {
            var temp = JSON.parse(fs.readFileSync(this.path, 'utf8'));
            if (temp.timestamp === this.getDate()) {
                this.joke = temp;
            }
            
        }
        console.log("Starting module: " + this.name);
    },
    
    getJoke: function() {
          var getRandomJokeWithTag = oneLinerJoke.getRandomJokeWithTag(this.config.tag);
          
    console.log(getRandomJokeWithTag);
    this.sendSocketNotification('JOKE_RESULT', getRandomJokeWithTag);
    this.joke.timestamp = this.getDate();
    this.joke.data = getRandomJokeWithTag; 
    this.fileWrite();
    },
    
    fileWrite: function() {
        fs.writeFile(this.path, JSON.stringify(this.joke), function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The Joke file was saved!");
        });
    },
    
    getDate: function() {
        return (new Date()).toLocaleDateString();
    },
    
    socketNotificationReceived: function(notification, payload) {
    	 if (notification === "CONFIG") {
            this.config = payload;
			}
        if (notification === 'GET_JOKE') {
            if (this.joke.timestamp === this.getDate() && this.joke.data !== null) {
                this.sendSocketNotification('JOKE_RESULT', this.joke.data);
            } else {
                this.getJoke(payload);
            }
        }
    }
    
});