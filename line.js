class Line {
    constructor(game) {
        this.game = game;

        this.points = [];
    };

    slope() {
        var slope;

        if (this.points[1].x !== this.points[0].x)
            slope = (this.points[1].y - this.points[0].y) / (this.points[1].x - this.points[0].x);
        else
            slope = false;

        return slope;
    };

    yInt() {
        if (this.points[0].x === this.points[1].x) return this.points[0].x === 0 ? 0 : false;
        if (this.points[0].y === this.points[1].y) return this.points[0].y;
        return this.points[0].y - this.slope() * this.points[0].x;
    };

    xInt() {
        if (this.points[0].y === this.points[1].y) return this.points[0].y === 0 ? 0 : false;
        if (this.points[0].x === this.points[1].x) return this.points[0].x;
        return (-1 * this.yInt())/ this.slope();
    };

    onSegment(x) {
        return (this.points[0].x <= x && x <= this.points[1].x);
    };

    collide(other) {
        if (this.slope() === other.slope()) return false;

        var intercept = {};
        intercept.x = (other.yInt() - this.yInt()) / (this.slope() - other.slope());
        intercept.y = this.slope() * intercept.x + this.yInt();

        return intercept;
    };

    update() {
        if (this.game.click && this.points.length < 2) {
            // make sure left most point is first
            if (this.points.length === 0 || this.game.click.x > this.points[0].x)
                this.points.push(this.game.click);
            else
                this.points.splice(0, 0, this.game.click);

            // if this line is completed create a new one
            if (this.points.length === 2) {
                this.game.addEntity(new Line(this.game));
            }

            // each click only handled once
            this.game.click = null;
        }
    };

    draw(ctx) {
        var mouse = this.game.mouse;
        switch (this.points.length) {
            case 0:
                if (mouse) {
                    ctx.strokeStyle = "Grey";
                    ctx.beginPath();
                    ctx.arc(mouse.x, mouse.y, 3, 0, 2 * Math.PI);
                    ctx.stroke();
                }
                break;
            case 1:
                ctx.strokeStyle = "Red";
                ctx.beginPath();
                ctx.arc(this.points[0].x, this.points[0].y, 2, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
      
                if (mouse) {
                    ctx.strokeStyle = "Grey";
                    ctx.beginPath();
                    ctx.moveTo(this.points[0].x, this.points[0].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.arc(mouse.x, mouse.y, 3, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                }
                break;
            case 2:
                ctx.strokeStyle = "Red";
                ctx.beginPath();
                ctx.arc(this.points[0].x, this.points[0].y, 3, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);
                ctx.lineTo(this.points[1].x, this.points[1].y);
                ctx.arc(this.points[1].x, this.points[1].y, 3, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();

                if (this.slope() < 0) {
                    ctx.setLineDash([5, 5]);
                    ctx.strokeStyle = "Grey";

                    ctx.beginPath();
                    if (this.yInt() <= this.game.surfaceHeight)
                        ctx.moveTo(0, this.yInt());
                    else
                        ctx.moveTo((this.game.surfaceHeight - this.yInt())/this.slope(), this.game.surfaceHeight);
                    ctx.lineTo(this.points[0].x, this.points[0].y);
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    if (this.xInt() <= this.game.surfaceWidth)
                        ctx.moveTo(this.xInt(), 0);
                    else
                        ctx.moveTo(this.game.surfaceWidth, this.game.surfaceWidth * this.slope() + this.yInt());
                    ctx.lineTo(this.points[1].x, this.points[1].y);
                    ctx.stroke();
                    ctx.closePath();

                    ctx.setLineDash([]);
                    ctx.beginPath();
                    if (this.yInt() <= this.game.surfaceHeight)
                        ctx.arc(0, this.yInt(), 3, 0, 2 * Math.PI);
                    else
                        ctx.arc((this.game.surfaceHeight - this.yInt()) / this.slope(), this.game.surfaceHeight, 3, 0, 2 * Math.PI);                    
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    if (this.xInt() <= this.game.surfaceWidth)
                        ctx.arc(this.xInt(), 0, 3, 0, 2 * Math.PI);
                    else
                        ctx.arc(this.game.surfaceWidth, this.game.surfaceWidth * this.slope() + this.yInt(), 3, 0, 2 * Math.PI);                    
                    ctx.stroke();
                    ctx.closePath();
                } else {
                    ctx.setLineDash([5, 5]);
                    ctx.strokeStyle = "Grey";

                    ctx.beginPath();
                    if (this.yInt() >= 0) {
                        ctx.moveTo(0, this.yInt());
                        ctx.lineTo(this.points[0].x, this.points[0].y);
                    } else {
                        if (this.game.surfaceWidth * this.slope() + this.yInt() <= this.game.surfaceHeight)
                            ctx.moveTo(this.game.surfaceWidth, this.game.surfaceWidth * this.slope() + this.yInt());
                        else
                            ctx.moveTo((this.game.surfaceHeight - this.yInt()) / this.slope(), this.game.surfaceHeight);
                        ctx.lineTo(this.points[1].x, this.points[1].y);
                    }
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    if (this.xInt() >= 0) {
                        ctx.moveTo(this.xInt(), 0);
                        ctx.lineTo(this.points[0].x, this.points[0].y);
                    } else {
                        ctx.moveTo(this.game.surfaceWidth, this.game.surfaceWidth * this.slope() + this.yInt());
                        ctx.lineTo(this.points[1].x, this.points[1].y);
                    }
                    ctx.stroke();
                    ctx.closePath();

                    ctx.setLineDash([]);
                    ctx.beginPath();
                    ctx.arc(0, this.yInt(), 3, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.beginPath();
                    ctx.arc(this.xInt(), 0, 3, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.beginPath();
                    ctx.arc(this.game.surfaceWidth, this.game.surfaceWidth * this.slope() + this.yInt(), 3, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.beginPath();
                    ctx.arc((this.game.surfaceHeight - this.yInt()) / this.slope(), this.game.surfaceHeight, 3, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                }

                for (var i = 0; i < this.game.entities.length && this.game.entities[i] !== this; i++) {
                    var ent = this.game.entities[i];
                    var xPoint = this.collide(ent);
                    ctx.strokeStyle = this.onSegment(xPoint.x) && ent.onSegment(xPoint.x) ? "Red" : "Grey";
                    ctx.beginPath();
                    ctx.arc(xPoint.x, xPoint.y, 2, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                }

                break;
        };
    };

};