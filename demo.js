var raf = function() { };
var raf = requestAnimationFrame;

var view = document.getElementById("view"),
	vctx = view.getContext("2d"),
	vw = view.width, vc = vw/2, vh = view.height;

var fullCircle = Math.PI * 2, radius = 20, clearPadding = 1;
var scale = 80, bounce = 0.5, atRest = false;

var ball = new Phys();
ball.onGround = vh - radius;
ball.bounce = 0.5;
ball.reset = function() {
	var scale = 80;
	ball.position = ball.onGround;
	ball.velocity=-7.5 * 80;
	ball.acceleration = 9.8 * 80;

	onGround.next();

	vctx.fillStyle="red";
};

var onGround = {
	next: function() {
		return (onGround.time = Phys.predict.time.byPosition(ball, ball.onGround));
	},
	time: null
};

ball.reset();

raf((function(){
	var prevFrame = null,
		nextFrame, deltaFrame, avgFrame = 1/60;

	var prevPos;
	var cutOffMovement = 1e-10;
	return function frame(timestamp) {
		if(prevFrame===null){
			prevFrame=timestamp;
		}

		nextFrame=timestamp;
		deltaFrame = (nextFrame - prevFrame)/1000;
		prevFrame=nextFrame;


		{ // update
			//console.log(onGround.time);
			if(onGround.time!==null){
				if(onGround.time<=deltaFrame){
					var i = 0, bounces = 0;
					prevPos = ball.position;
					onGround.next();
					while ((onGround.time!==null) && (onGround.time<=deltaFrame)) {
						if(++i>=100){
							console.log("stop iterating", i);
							onGround.time = null;
							ball.position = ball.onGround;
							break;
						}

						ball.simulate(onGround.time);

						if(ball.position>=ball.onGround){
							bounces++;
							ball.position = ball.onGround;
							ball.velocity = -ball.velocity * ball.bounce;
						}

						deltaFrame -= onGround.time;
						onGround.next();
					}
					if(i>1){console.log("iterations:", i, "bounces:", bounces);}
				}

				if(onGround.time>deltaFrame){
					ball.simulate(deltaFrame);
					ball.previousPosition = ball.position;
					onGround.time-=deltaFrame;
				}

				if(onGround.time===null){
					vctx.fillStyle="blue";
				}
			}
		}

		{ // render
			vctx.clearRect(0,0,vw,vh);

			vctx.beginPath();
			vctx.arc(vc, ball.position, radius, 0, fullCircle, true);
			vctx.fill();
		}

		raf(frame);
	};
})());

(function setupBounceInput() {
	var display = document.getElementById("bounce-display");

	var input = document.getElementById("bounce");
	input.addEventListener("input", update);
	input.addEventListener("change", update);
	function update() {
		if(ball.bounce!=input.value){
			display.innerText = input.value;
			ball.bounce=+input.value;
			if(onGround.time===null){
				ball.reset();
			}
		}
	}
})();

document.getElementById("relaunch").addEventListener("click", function(){
	if(onGround.time === null){
		ball.reset();
	}
	else{
		var oldPos = ball.position;
		ball.reset();
		var moveToPosition = Phys.predict.time.byPosition(ball, oldPos);
		ball.simulate(moveToPosition);
		onGround.next();
	}
});