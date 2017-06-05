 /* Magic Mirror
  * Module: MMM-Oneliner
  *
  * By John Wade
  * MIT Licensed.
  */
 Module.register("MMM-Oneliner", {
     defaults: {
	updateInterval: 12 * 60 * 1000, // every 12 hours
        useHeader: true,
        maxWidth: "20%"        
    },
     
     getStyles: function() {
         return ["MMM-Oneliner.css"];
     },

     // Define start sequence.
     start: function() {
         Log.info("Starting: " + this.name);
          this.sendSocketNotification('CONFIG', this.config);
         this.joke = [];
         this.scheduleUpdate();
     },

     getDom: function() {
     	
         var wrapper = document.createElement("div");
         wrapper.style.maxWidth = this.config.maxWidth;
 
         joke = this.joke;

         if (this.config.useHeader != false) {
         	var header = document.createElement("header");
            header.classList.add("xsmall", "dimmed", "header");
            header.innerHTML = "Your Daily One-Liner";
            wrapper.appendChild(header);
        }
         
         var jokeList = document.createElement("div");
         jokeList.classList.add("wrapper", "xsmall");
         jokeList.innerHTML = joke;
         wrapper.appendChild(jokeList);
				 
         return wrapper;
     },

   processJoke: function(data) {
        this.today = data.Today;
        this.joke = data.body;
        this.loaded = true;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getJoke();
        }, this.config.updateInterval);
        this.getJoke(this.config.initialLoadDelay);
    },

    getJoke: function() {
        this.sendSocketNotification('GET_JOKE');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "JOKE_RESULT") {
            this.processJoke(payload);
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },








 });
