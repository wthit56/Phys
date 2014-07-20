/*jshint strict: false */
/*global console */

var Phys = (function(test) {
	"use strict";

	function Phys(position, velocity, acceleration) {
		this.set.apply(this,arguments);
	}
	Phys.prototype = {
		set:function(position, velocity, acceleration){
			this.position = +position || 0;
			this.velocity = +velocity || 0;
			this.acceleration = +acceleration || 0;
			return this;
		},
		simulate: function (t) {
			// console.log("simulating", t);
			var a = this.acceleration;
			var v = this.velocity;
			if (a) {
				var v1 = v + (a * t);
				this.position += ((v + v1) / 2) * t;
				v = this.velocity = v1;
			} else if (v) {
				this.position += v * t;
			}

			return this;
		}
	};
	
	Phys.forceToAcceleration = function(mass, force) {
		return force / mass;
	};
	
	Phys.predict = {
		time: {
			byPosition: (function() {
				var p, v, a;
				var sqrt, $1, $2;
				return function Phys_predict_time_byPosition(phys, position) {
					p = phys.position; v = phys.velocity; a = phys.acceleration;
					
					if (
						((position > p) && (v <= 0) && (a <= 0)) ||
						((position < p) && (v >= 0) && (a >= 0))
					) { }
					else if (a) {
						sqrt = Math.sqrt(
							(v * v)
							- (2 * a * (p - position))
						);

						$1 = (-v + sqrt) / a; $2 = (-v - sqrt) / a;
						return (($1 > $2) ? $1 : $2);
					}
					else if (v) {
						return ((position - p) / v);
					}
					
					return null;
				};
			})()
		}
	};
		
	return Phys;
})();



function test() {
	function testPrediction(position, velocity, acceleration, newPosition, expected) {
		var phys = new Phys(position, velocity, acceleration);
		var result = Phys.predict.time.byPosition(phys, newPosition);
		var success = (result.toFixed(10) === expected.toFixed(10));
		console.group("Phys.predict.time.byPosition(new Phys(" + position + ", " + velocity + ", " + acceleration + "), " + newPosition + ")");
			console[success ? "log" : "error"](
				"==", result,
				"expected", expected
			);
			var decimals = 13;
			console.log(
				"simulation check:", phys.simulate(result).position,
				"expected:", newPosition
			);
		console.groupEnd();
	}
	testPrediction.throwBall = function(t) {
		var v0 = (t/2) * -9.8 * -1
		testPrediction(0, v0, -9.8, 0, t);
	}
	
	console.groupCollapsed("Phys.predict.time.byPosition");
		// https://www.khanacademy.org/science/physics/two-dimensional-motion/two-dimensional-projectile-mot/v/launching-and-landing-on-different-elevations
		testPrediction(25, 90 * Math.sin(53 * (Math.PI / 180)), -9.8, 9, 14.888138154688914);
		testPrediction(0, 1, 0, 5, 5);
		testPrediction(0, 1, 1, 17.5, 5);

		for(var i=0; i<10; i++){
			testPrediciton.throwBall(Math.random()*100);
		}
	console.groupEnd();
}
//test();