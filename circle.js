class Circle {
    constructor(game, x, y, radius) {
        Object.assign(this, { game, x, y, radius });
    };

    update() {
      
    };

    draw(ctx) {
        if (document.getElementById("circles").checked) {
            ctx.beginPath();
            ctx.strokeStyle = "Red";
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
        }
    };

};
