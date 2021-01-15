class Line {
    constructor(game) {
        this.game = game;
        this.intRadius = 3;

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

        var intersect = {};
        intersect.x = (other.yInt() - this.yInt()) / (this.slope() - other.slope());
        intersect.y = this.slope() * intersect.x + this.yInt();

        return intersect;
    };

    circleCollide(circle) {
        var slope = this.slope();
        var yInt = this.yInt();
        var a = 1 + slope * slope;
        var b = 2 * (slope * (yInt - circle.y) - circle.x);
        var c = circle.x * circle.x + (yInt - circle.y) * (yInt - circle.y) - circle.radius * circle.radius;

        var d = b * b - 4 * a * c;

        if (d === 0) {
            return [(-b + Math.sqrt(d)) / (2 * a)];
        } else if (d > 0) {
            return [(-b + Math.sqrt(d)) / (2 * a), (-b - Math.sqrt(d)) / (2 * a)];
        } 

        return [];
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
                    ctx.arc(mouse.x, mouse.y, this.intRadius, 0, 2 * Math.PI);
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
                    ctx.arc(mouse.x, mouse.y, this.intRadius, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                }
                break;
            case 2:
                ctx.strokeStyle = "Red";
                ctx.beginPath();
                ctx.arc(this.points[0].x, this.points[0].y, this.intRadius, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);
                ctx.lineTo(this.points[1].x, this.points[1].y);
                ctx.arc(this.points[1].x, this.points[1].y, this.intRadius, 0, 2 * Math.PI);
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
                        ctx.arc(0, this.yInt(), this.intRadius, 0, 2 * Math.PI);
                    else
                        ctx.arc((this.game.surfaceHeight - this.yInt()) / this.slope(), this.game.surfaceHeight, this.intRadius, 0, 2 * Math.PI);                    
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    if (this.xInt() <= this.game.surfaceWidth)
                        ctx.arc(this.xInt(), 0, this.intRadius, 0, 2 * Math.PI);
                    else
                        ctx.arc(this.game.surfaceWidth, this.game.surfaceWidth * this.slope() + this.yInt(), this.intRadius, 0, 2 * Math.PI);                    
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
                    ctx.arc(0, this.yInt(), this.intRadius, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.beginPath();
                    ctx.arc(this.xInt(), 0, this.intRadius, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.beginPath();
                    ctx.arc(this.game.surfaceWidth, this.game.surfaceWidth * this.slope() + this.yInt(), this.intRadius, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.beginPath();
                    ctx.arc((this.game.surfaceHeight - this.yInt()) / this.slope(), this.game.surfaceHeight, this.intRadius, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                }

                for (var j = 0; j < this.game.entities.length && this.game.entities[j] !== this; j++) {
                    var ent = this.game.entities[j];
                    if (ent instanceof Line) {
                        var xPoint = this.collide(ent);
                        ctx.strokeStyle = this.onSegment(xPoint.x) && ent.onSegment(xPoint.x) ? "Red" : "Grey";
                        ctx.beginPath();
                        ctx.arc(xPoint.x, xPoint.y, this.intRadius, 0, 2 * Math.PI);
                        ctx.stroke();
                        ctx.closePath();
                    } else if (ent instanceof Circle && document.getElementById("circles").checked) {
                        var xPoints = this.circleCollide(ent);
                        for (var i = 0; i < xPoints.length; i++) {
                            ctx.strokeStyle = this.onSegment(xPoints[i]) ? "Red" : "Grey";
                            ctx.beginPath();
                            ctx.arc(xPoints[i], this.slope() * xPoints[i] + this.yInt(), this.intRadius, 0, 2 * Math.PI);
                            ctx.stroke();
                            ctx.closePath();
                        }
                    }
                }

                break;
        };
    };

};
