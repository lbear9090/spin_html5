STATUS_IDLE = 0;
STATUS_SPIN = 1;
class Main extends Phaser.Scene {
    constructor() {
        super('Main')
    }

    preload(){
        
    }
    
    create() {
        this.createBackground();
        this.status = STATUS_IDLE;
    }

    createBackground(){
        this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
        this.wheel = this.add.sprite(G_WIDTH/2, G_HEIGHT/2, 'wheel');
        this.add.sprite(G_WIDTH/2, G_HEIGHT/2, 'ring');
        var fontCounter = { font: '150px '+Utils.text['FONT'], fill: '#FFFFFF', stroke: '#000', strokeThickness: 5 };
		this.add.text(G_WIDTH / 2, 300, "La Juste Frise", fontCounter).setOrigin(0.5, 0.5);

        this.buttonStart = new Button(G_WIDTH/2, 1600, 'play', this.onPlay, this, "static");

    }

    spin(){
        var destAngle = Math.random() * 360;
        this.tweens.add({targets: this.wheel, angle: 360*6 + (destAngle), duration: 10000, ease: 'Cubic.Out', onComplete: () => {
            this.status = STATUS_IDLE;
            var result = Math.floor(destAngle / 36);
            this.buttonStart.visible = true;
        }});
    }

    onPlay(){
        if(this.status == STATUS_IDLE){
            this.status = STATUS_SPIN
            this.buttonStart.visible = false;
            this.spin();
        }
    }
}