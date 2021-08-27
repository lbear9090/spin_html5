var Utils = {};

Utils.Sfx = {
	manage: function(type, mode, game, button, label) {
		switch(mode) {
			case 'init': {
        Utils.Storage.initUnset('Utils-'+type, true);
        Utils.Sfx.status = Utils.Sfx.status || [];
        Utils.Sfx.status[type] = Utils.Storage.get('Utils-'+type);
        if(type == 'sound') {
          Utils.Sfx.sounds = [];
          Utils.Sfx.sounds['click'] = game.sound.add('sound-click');
        }
        else { // music
          if(!Utils.Sfx.music || !Utils.Sfx.music.isPlaying) {
            Utils.Sfx.music = game.sound.add('music-theme');
            Utils.Sfx.music.volume = 0.5;
          }
        }
				break;
			}
			case 'on': {
				Utils.Sfx.status[type] = true;
				break;
			}
			case 'off': {
				Utils.Sfx.status[type] = false;
				break;
			}
			case 'switch': {
				Utils.Sfx.status[type] =! Utils.Sfx.status[type];
				break;
			}
			default: {}
    }
    Utils.Sfx.update(type, button, label);

    if(type == 'music' && Utils.Sfx.music) {
      if(Utils.Sfx.status['music']) {
        if(!Utils.Sfx.music.isPlaying) {
          Utils.Sfx.music.play({loop:true});
        }
      }
      else {
        Utils.Sfx.music.stop();
      }
    }

    Utils.Storage.set('Utils-'+type, Utils.Sfx.status[type]);
	},
	play: function(audio) {
    if(audio == 'music') {
      if(Utils.Sfx.status['music'] && Utils.Sfx.music && !Utils.Sfx.music.isPlaying) {
        Utils.Sfx.music.play({loop:true});
      }
    }
    else { // sound
      if(Utils.Sfx.status['sound'] && Utils.Sfx.sounds && Utils.Sfx.sounds[audio]) {
        Utils.Sfx.sounds[audio].play();
      }
    }
  },
  update: function(type, button, label) {
    if(button) {
      if(Utils.Sfx.status[type]) {
        button.setTexture('button-'+type+'-on');
      }
      else {
        button.setTexture('button-'+type+'-off');
      }
    }
    if(label) {
      if(Utils.Sfx.status[type]) {
        label.setText(Utils.Lang.text[Utils.Lang.current][type+'-on']);
      }
      else {
        label.setText(Utils.Lang.text[Utils.Lang.current][type+'-off']);
      }
    }
  }
};
Utils.fadeOutIn = function(passedCallback, context) {
  context.cameras.main.fadeOut(250);
  context.time.addEvent({
    delay: 250,
    callback: function() {
      context.cameras.main.fadeIn(250);
      passedCallback(context);
    },
    callbackScope: context
  });  
}
Utils.fadeOutScene = function(sceneName, context) {
  context.cameras.main.fadeOut(250);
  context.time.addEvent({
      delay: 250,
      callback: function() {
        context.scene.start(sceneName);
      },
      callbackScope: context
  });
};

class Button extends Phaser.GameObjects.Image {
  constructor(x, y, texture, callback, scene, noframes) {
    super(scene, x, y, texture, 0);
    this.setInteractive({ useHandCursor: true });
    
    this.on('pointerup', function() {
      if(!noframes) {
        this.setFrame(1);
      }
    }, this);

    this.on('pointerdown', function() {
      if(!noframes) {
        this.setFrame(2);
      }
      callback.call(scene);
    }, this);

    this.on('pointerover', function() {
      if(!noframes) {
        this.setFrame(1);
      }
    }, this);

    this.on('pointerout', function() {
      if(!noframes) {
        this.setFrame(0);
      }
    }, this);

    scene.add.existing(this);
  }
};

Utils.Storage = {
	availability: function() {
		if(!(!(typeof(window.localStorage) === 'undefined'))) {
			console.log('localStorage not available');
			return null;
		}
	},
	get: function(key) {
		this.availability();
		try {
			return JSON.parse(localStorage.getItem(key));
		}
		catch(e) {
			return window.localStorage.getItem(key);
		}
	},
	set: function(key, value) {
		this.availability();
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
		}
		catch(e) {
			if(e == QUOTA_EXCEEDED_ERR) {
				console.log('localStorage quota exceeded');
			}
		}
	},
	initUnset: function(key, value) {
		if(this.get(key) === null) {
			this.set(key, value);
		}
	},
	getFloat: function(key) {
		return parseFloat(this.get(key));
	},
	setHighscore: function(key, value) {
		if(value > this.getFloat(key)) {
			this.set(key, value);
		}
	},
	remove: function(key) {
		this.availability();
		window.localStorage.removeItem(key);
	},
	clear: function() {
		this.availability();
		window.localStorage.clear();
	}
};

Utils.Lang = {
  current: 'en',
  options: ['en', 'pl'],
  parseQueryString: function(query) {
    var vars = query.split('&');
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (typeof query_string[pair[0]] === 'undefined') {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
      } else if (typeof query_string[pair[0]] === 'string') {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
        query_string[pair[0]] = arr;
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return query_string;
  },
  updateLanguage: function(lang) {
    var query = window.location.search.substring(1);
    var qs = Utils.Lang.parseQueryString(query);
    if(qs && qs['lang']) {
      console.log('LANG: '+qs['lang']);
      Utils.Lang.current = qs['lang'];
    } else {
      if(lang) {
        Utils.Lang.current = lang;
      }
      else {
        Utils.Lang.current = navigator.language;
      }
    }
    if(Utils.Lang.options.indexOf(Utils.Lang.current) == -1) {
      Utils.Lang.current = 'en';
    }
  },
  text: {
    'en': {

    },
    'pl': {

    }
  }
};

// Usage tracking - remember to replace with your own!
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = function() {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-30485283-26');
}
script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-30485283-26';
head.appendChild(script);