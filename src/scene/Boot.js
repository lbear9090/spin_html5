class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }
    preload() {
        //Load assets of preload screen

        this.load.image('background', 'img/loader/preload_bg.png');
        // this.load.image('logo', 'img/loader/logo.png');
        this.load.image('preload_bar_bg', 'img/loader/preload_bar_bg.png');
        WebFont.load({ custom: { families: ['Berlin'], urls: ['fonts/BRLNSDB.css'] } });
    }
    create() {
        Utils.world = {
            width: this.cameras.main.width,
            height: this.cameras.main.height,
            centerX: this.cameras.main.centerX,
            centerY: this.cameras.main.centerY
        };
        Utils.Lang.updateLanguage('en');
        Utils.text = Utils.Lang.text[Utils.Lang.current];
        this.scene.start('Preloader');
    }
}