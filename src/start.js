var gameConfig = {
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: G_WIDTH,
		height: G_HEIGHT
	},
	// physics: {
    //     default: 'arcade',
    // },
	scene: [Boot, Preloader, Main],
}
game = new Phaser.Game(gameConfig);
window.focus();

// Usage tracking
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-30485283-26');