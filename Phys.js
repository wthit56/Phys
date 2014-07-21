/*jshint strict: false */
/*global console */

var Phys = (function(test) {
	"use strict";

	function Phys(position, velocity, acceleration) {
		this.position = +position || 0;
		this.velocity = +velocity || 0;
		this.acceleration = +acceleration || 0;
	}
	Phys.prototype = {
		simulate: (function() {
			var v, v1, a;
			
			return function Phys_proto_prototype(t) {
				if (t < 0) { throw "Invalid time; must be >= 0."; }

				a = this.acceleration; v = this.velocity;
				if (a) {
					v1 = v + (a * t);
					this.position += ((v + v1) / 2) * t;
					v = this.velocity = v1;
				}
				else if (v) {
					this.position += v * t;
				}

				return this;
			};
		})()
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
					
					/*
						p	pos	v	a
						1	2	1	1	/
						1	2	1	0	/
						1	2	0	1	/
						1	2	1	-1	?
						1	2	-1	1	?
						1	2	0	0	X
						1	2	-1	0	X
						1	2	0	-1	X
						1	2	-1	-1	X
						
						2	1	1	1	X
						2	1	1	0	X
						2	1	0	1	X
						2	1	1	-1	?
						2	1	-1	1	?
						2	1	0	0	X
						2	1	-1	0	/
						2	1	0	-1	/
						2	1	-1	-1	/
					*/
					
					/*
					return (
						(
							((p < position) && ((v > 0) || (a > 0))) ||
							((p > position) && ((v < 0) || (a < 0)))
						)
							?
								a ? (
									
								) :
								v ? ((position - p) / v) : null
							: null
					);
					*/
					
					if (
						((position > p) && (v <= 0) && (a <= 0)) ||
						((position < p) && (v >= 0) && (a >= 0))
					) { return null; }
					else if (a) {
						sqrt = ((v * v) - (2 * a * (p - position)));
						sqrt = Math.sqrt(
							sqrt < 0 ? -sqrt : sqrt
						);
						
						return (
							(
								-v +
								(sqrt * (
									(
										((a < 0) && (v > sqrt)) ||
										((a > 0) && (v <= sqrt))
									) ? 1 : -1
								))
							) / a
						) || null;
					}
					else if (v) {
						return ((position - p) / v);
					}
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
		
		console.group("Phys.predict.time.byPosition(new Phys(" + position + ", " + velocity + ", " + acceleration + "), " + newPosition + ")");
			var success = (
				(result === result) ||
				(
					(typeof result === "number") && (!isNaN(result)) &&
					(result.toFixed(10) === expected.toFixed(10))
				)
			);
			
			if(!success){
				throw result + " expected " + expected;
			}
			
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
	
	console.group("Phys.predict.time.byPosition");
		// https://www.khanacademy.org/science/physics/two-dimensional-motion/two-dimensional-projectile-mot/v/launching-and-landing-on-different-elevations
		testPrediction(0,1,0, 5, 5);
		testPrediction(0,-1,0, 5, null);

		testPrediction(25,71.87719590425635,-9.8, 9, 14.888138154688914);
		testPrediction(0,1,1, 17.5, 5);
		//(-18.26321041517341 + sqrt(abs((18.26321041517341 * 18.26321041517341) - (2 * -784 * (19.656599390921283 - 20))))) / -784
		//debugger;
		
		testPrediction.throwBall(10);
		
		testPrediction(19.656599390921283,18.26321041517341,-784, 20, 0.00503651394);
		testPrediction(0,2,-1, 1, 0.5857864376269049);
		

		for(var i=0; i<10; i++){
			testPrediction.throwBall(Math.random()*100);
		}
	console.groupEnd();
}
//test();