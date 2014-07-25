var indent = 0, pre = "", tab = "|";
console.indent = (function() {
	return function(tabs) {
		if(tabs>0){
			indent+=tabs;
			while(tabs>0){
				pre+=(pre?" ":"")+tab;
				tabs--;
			}
		}
		else if(tabs<0){
			indent+=tabs;
			pre=pre.substring(0,pre.length+(tabs*2));
		}
		else if(tabs===0){
			indent = 0;
			pre="";
		}
		//console.log(pre.length);
	};
})();

console.group = console.groupCollapsed = function(name) {
	//console.log(!!indent);
	console.log(
		((indent===0)?"\n":"")+
		"+ "+name
	);
	console.indent(1);
};
console.groupEnd = function() {
	console.indent(-1);
};

function patch(method) {
	var original = console[method];
	console[method] = function() {
		if(pre){Array.prototype.unshift.call(arguments, pre);}
		return original.apply(this, arguments);
	};
}
["log", "warn", "error"].forEach(patch)

if(module){module.exports = console;}

/*
console.log("0");
console.indent(1);
	console.log("1");
	console.indent(1);
		console.log("2");
	console.indent(-1);
	console.log("1");
console.indent(-1);
console.log("0");

console.group("group1");
	console.log("1");
	console.group("group2");
		console.log("2");
	console.groupEnd();
	console.log("1");
console.groupEnd();
//*/