/*jshint strict: false */
/*global console */

var Phys = (function(){
	"use strict";

	function Phys(position, velocity, acceleration){
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
			byPosition: function(phys, position) {
				// p = ((v + (v + a * t)) / 2) * t;
				// p = (tv + tv + att) / 2
				// p = (2tv + att) / 2
				// p = tv + (att / 2)
				// tv + (att / 2) - p = 0
				// (a / 2) t^2 + v t + -p
				// (-v +- sqrt(-v*-v - 4*(a/2)*(-p))) / 2(a/2)
				var p=phys.position, v=phys.velocity, a=phys.acceleration;
				if(a){
					// p = delta position
					// t = delta time
					// (a / 2)(t ^ 2) + (v * t) - p

					// (-B +- sqrt(B^2 - 4AC)) / 2AC
					// (-v +- sqrt(v^2 - 4(a/2)(-p))) / 2(a/2)

					//console.log(A+"(t^2) + "+B+"t + "+C);

					return (
						(-v +
							(((a < 0) ? -1 : 1) * Math.sqrt(
								(v * v) - (2 * a * (phys.position - position))
							))
						)
						/ a
					);

					/*var A = a/2, B = v, C = phys.position - position;
					return (
						(-B + ((A<0?-1:1) * Math.sqrt((B*B)  - (4 * A * C))))
						/ (2 * A)
					);*/
				}
				else if(v){
					if(position!==p){
						if(position>p){
							if(v>0){return ((position-p)/v);}
						}
						else{
							if(v<0){return ((position-p)/v);}
						}
					}
				}
			}
		}
	};
	
	
	console.groupCollapsed("Phys.predict.time.byPosition");
		function test(position, velocity, acceleration, newPosition, expected) {
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

		// https://www.khanacademy.org/science/physics/two-dimensional-motion/two-dimensional-projectile-mot/v/launching-and-landing-on-different-elevations
		test(25, 90 * Math.sin(53 * (Math.PI / 180)), -9.8, 9, 14.888138154688914);
		test(0, 1, 0, 5, 5);
		test(0, 1, 1, 17.5, 5);
	
	
		function throwBall(t) {
			var v0 = (t/2) * -9.8 * -1
			test(0, v0, -9.8, 0, t);
		}
		for(var i=0; i<10; i++){
			throwBall(Math.random()*100);
		}
	
	console.groupEnd();
	
	return Phys;
})();