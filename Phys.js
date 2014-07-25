/*jshint strict: false */
/*global console */

var predict;
if(Phys){
	predict = Phys.predict;
}

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
			
			return function Phys_proto_simulate(t) {
				if (t < 0) { throw "Invalid time; must be >= 0."; }
				else if (t > 0) {
					v = this.velocity; a = this.acceleration;
					if (a) {
						v1 = v + (a * t);
						this.position += ((v + v1) / 2) * t;
						this.velocity = v1;
					}
					else if (v) {
						this.position += v * t;
					}
				}

				return this;
			};
		})()
	};
	
	Phys.forceToAcceleration = function(mass, force) {
		return force / mass;
	};

	if(predict){
		Phys.predict = predict;
	}
	predict = undefined;
	
	return Phys;
})();

if(undefined !== this.module){this.module.exports = Phys;}
