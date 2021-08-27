class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }
    preload() {
		// var bg = this.add.sprite(Utils.world.centerX, Utils.world.centerY, 'preload_bg').setOrigin(0.5, 0.5);
		// bg.setScale(Utils.world.width / bg.width, Utils.world.height / bg.height);
        // var logo = this.add.sprite(Utils.world.centerX, Utils.world.centerY-100, 'logo');
        // logo.setOrigin(0.5, 0.5);
		// logo.setScale(0.5, 0.5);
		var loadingBg = this.add.sprite(Utils.world.centerX, Utils.world.centerY+100, 'preload_bar_bg');
		loadingBg.setOrigin(0.5, 0.5);

		var progress = this.add.graphics();
		this.load.on('progress', function (value) {
			progress.clear();
			progress.fillStyle(0xffde00, 1);
			progress.fillRect(loadingBg.x-(loadingBg.width*0.5)+20, loadingBg.y-(loadingBg.height*0.5)+10, 540 * value, 25);
		});

		var resources = {
			'image': [
				['bg', 'img/bg.jpg'],
				['ring', 'img/ring.png'],
				['wheel', 'img/wheel1.png'],
				['play', 'img/play.png'],
			],
			'spritesheet': [
				
			],
		};		

		for(var method in resources) {
			resources[method].forEach(function(args) {
				var loader = this.load[method];
				loader && loader.apply(this.load, args);
			}, this);
		};
    }
    create() {
		Utils.fadeOutScene('Main', this);
	}
}