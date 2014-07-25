var console = require("../Console"),
	Test = require("./index.js");
	
var Phys = require("../Phys.js");
Phys.predict = require("../Phys.predict.js");

var decimals = 10;

function test(
	name, method,
	input, getResult, testMessage,
	getSimResult, getSimExpected, simMessage
) {
	var phys, result, simResult, data;
	console.group(name+" Tests");
		for(var i=0, l=input.length; i<l; i++){
			c = input[i];
			console.group(method+"(new Phys("+c[0]+", "+c[1]+", "+c[2]+"), "+c[3]+")");
			phys = new Phys(c[0], c[1], c[2]);
			data = [phys].concat(c.slice(3));
			result = getResult.apply(this, data);
			if(compare(result,c[4])){
				Test.expect(true);
				if(getSimResult && result || (result===0)){
					data.splice(1,0,result);
					console.log(result);
					simResult = getSimResult.apply(this, data);
					simExpected = getSimExpected.apply(this, data);
					Test.expect(compare(simResult, simExpected), "Simulation: "+(simMessage?simMessage+": ":"")+JSON.stringify(simResult)+" (result) != "+JSON.stringify(simExpected)+" (expected)");
				}
			}
			else{
				Test.expect(false, (testMessage?testMessage+": ":"")+JSON.stringify(result)+" (result) != "+JSON.stringify(c[4])+" (expected)");
			}
			console.groupEnd();
		}
	console.groupEnd();
}
function compare(a, b) {
	return (
		(a===b) ||
		(
			((typeof a) + (typeof b) === "numbernumber") &&
			(a.toFixed(decimals) === b.toFixed(decimals))
		)
	);
}

console.group("Phys.predict");
console.group(".time");
test(
	".byPosition", "Phys.predict.time.byPosition",
	(function() { // input
		var input = [
			[0,1,0, 5, 5],
			[0,-1,0, 5, null],
			// https://www.khanacademy.org/science/physics/two-dimensional-motion/two-dimensional-projectile-mot/v/launching-and-landing-on-different-elevations
			[25,71.87719590425635,-9.8, 9, 14.888138154688914],
			[0,1,1, 17.5, 5],
			/*
			[19.656599390921283,18.26321041517341,-784, 20, 0.00503651394],
			[0,2,-1, 1, 0.5857864376269049]
			//*/
		];
		
		/*
		for(var i=0, t, v0; i<10; i++){
			t = Math.random() * 100;
			v0 = (t/2) * -9.8 * -1;
			input.push([0, v0, -9.8, 0, t]);
		}
		//*/

		return input;
	})(),
	function getResult(phys, target) {
		return Phys.predict.time.byPosition(phys, target);
	},
	null, // testMessage
	function getSimResult(phys, result){
		return phys.simulate(result).position;
	},
	function getSimExpected(phys, result, target){
		return target;
	},
	null // simMessage
)
console.groupEnd();
console.groupEnd();



/*
(function() { // 
	function test(position, velocity, acceleration, newPosition, expected) {
		var phys = new Phys(position, velocity, acceleration);
		var result = Phys.predict.time.byPosition(phys, newPosition);

		console.group("Phys.predict.time.byPosition(new Phys(" + position + ", " + velocity + ", " + acceleration + "), " + newPosition + ")");
			var success = (
				(result === result) ||
				(
					(typeof result === "number") && (!isNaN(result)) &&
					(result.toFixed(decimals) === expected.toFixed(decimals))
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
	test.throwBall = function(t) {
		var v0 = (t/2) * -9.8 * -1
		test(0, v0, -9.8, 0, t);
	}

	console.groupCollapsed("Phys.predict.time.byPosition");
		test(0,1,0, 5, 5);
		test(0,-1,0, 5, null);

		// https://www.khanacademy.org/science/physics/two-dimensional-motion/two-dimensional-projectile-mot/v/launching-and-landing-on-different-elevations
		test(25,71.87719590425635,-9.8, 9, 14.888138154688914);
		test(0,1,1, 17.5, 5);
		//(-18.26321041517341 + sqrt(abs((18.26321041517341 * 18.26321041517341) - (2 * -784 * (19.656599390921283 - 20))))) / -784
		//debugger;

		test(19.656599390921283,18.26321041517341,-784, 20, 0.00503651394);
		test(0,2,-1, 1, 0.5857864376269049);

		for(var i=0; i<10; i++){
			test.throwBall(Math.random()*100);
		}
	console.groupEnd();		
})();

(function() { // time byVelocity
	function test(p, v, a, target, expected) {
		console.group("Phys.predict.time.byVelocity(new Phys(" + p + ", " + v + ", " + a + "), " + target + ")");
			var phys = new Phys(p,v,a);
			var result = Phys.predict.time.byVelocity(phys, target);
			var success = (
				(result===expected) ||
				(
					(typeof result === "number") &&
					(result.toFixed(decimals) === expected.toFixed(decimals))
				)
			);

			if(success && (expected!=null)){
				console.log("simulating...");
				var simulated = phys.simulate(result).velocity;
				success = success && (
					(simulated===target) ||
					(
						(typeof simulated === "number") &&
						(simulated.toFixed(decimals) === target.toFixed(decimals))
					)
				);
			}

			if(!success){
				throw "Test Failed: Incorrect result; expected "+expected+", got "+result;
			}
			else{
				console.log("==", result, "expected:", expected);
			}
		console.groupEnd();
	}

	console.group("Phys.predict.time.byVelocity");
		test(0,1,1, 2, 1);
		test(0,1,0, 2, null);
		test(0,1,-1, 2, null);

		test(0,1,1, 0, null);
		test(0,1,0, 0, null);
		test(0,1,-1, 0, 1);
	console.groupEnd();
})();

(function() { // position byTime
	function test(p, v, a, target, expected) {
		console.group("Phys.predict.position.byTime(new Phys(" + p + ", " + v + ", " + a + "), " + target + ")");
			var phys = new Phys(p,v,a);
			var result = Phys.predict.position.byTime(phys, target);
			var success = (
				(result===expected) ||
				(
					(typeof result === "number") && (typeof expected === "number") && 
					(result.toFixed(decimals) === expected.toFixed(decimals))
				)
			);

			if(success && (expected!=null) && (result>=0)){
				console.log("simulating...");
				var simulated = phys.simulate(target).position;
				success = success && (
					(simulated===target) ||
					(
						(typeof simulated === "number") &&
						(simulated.toFixed(decimals) === expected.toFixed(decimals))
					)
				);
				if(!success){
					throw "Simulation Test Failed: expected "+target+", got "+simulated;
				}
			}

			if(!success){
				throw "Test Failed: Incorrect result; expected "+expected+", got "+result;
			}
			else{
				console.log("==", result, "expected:", expected);
			}
		console.groupEnd();
	}

	console.group("Phys.predict.position.byTime");
		test(0,0,0, 0, null);
		test(0,0,0, -1, null);

		test(0,1,0, 1, 1);
		test(0,-1,0, 1, -1);

		test(0,0,1, 1, 0.5);
		test(0,0,-1, 1, -0.5);
	console.groupEnd();
})();
//*/