var Test = (function() {
	var Test = {};

	Test.expect = function(expected, message) {
		if(expected){
			console.log("Test passed")
		}
		else{
			console.error("Test failed"+(message?": "+message : ""));
		}
	};
	
	Test.assertEquals = function(result, expected, message) {
		Test.expect(
			result===expected,
			(message?message+": ":"") +
				JSON.stringify(result) +" (result) !== " +
				JSON.stringify(expected)+" (expected)"
		);
	};

	Test.assertSimilar = function(result, expected, message) {
		Test.expect(
			similar(result, expected),
			(message?message+": ":"") +
				JSON.stringify(result)+" (result) is not similar to "+
				JSON.stringify(expected)+" (expected)"
		);
	};
	function similar(a, b) {
		if(a===b){return true;}
		
		for (var prop in a) {
			if(
				(typeof a[prop] !== "object") ||
				(a[prop] instanceof Function)
			) {
				if(a[prop]!==b[prop]){
					console.log("* !== "+prop, a[prop], b[prop]);
					return false;
				}
			}
			else{
				if(!similar(a[prop], b[prop])){
					console.log("* !similar "+prop);
					return false;
				}
			}
		}
		
		return true;
	}

	return Test;
})();

if(module){
	module.exports = Test;
}

/*
console.log("---expect---");
Test.expect(true);
Test.expect(true, "Fail message");
Test.expect(false);
Test.expect(false, "Fail message");

console.log("\n---assertEquals---");
Test.assertEquals(1,1);
Test.assertEquals(1,1, "1 = 1");
Test.assertEquals(1, 2);
Test.assertEquals(1, 2, "Failed message 2");

console.log("\n---assertSimilar---");
Test.assertSimilar({value:1}, {value:1}, "Message");
Test.assertSimilar({value:1}, {value:2}, "Message");
//*/
