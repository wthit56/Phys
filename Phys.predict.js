if(!Phys){var Phys = {};}
Phys.predict = {
    time: {
        byPosition: (function() {
            var p, pd, v, a, tosqrt, sqrt,
				$1, $2;

            return function Phys_predict_time_byPosition(phys, position) {
                p = phys.position; v = phys.velocity; a = phys.acceleration;

                if (
                    ((position > p) && (v <= 0) && (a <= 0)) ||
                    ((position < p) && (v >= 0) && (a >= 0))
                ) { return null; }
                else if (a) {
					if(p===position){
						sqrt = (v < 0) ? -v : v;
						
						return (
							((a < 0) === (v < 0))
								? null
								: (a<0)
									? (-v - sqrt) / a
									: (-v + sqrt) / a
						);
					}
					else{
						tosqrt = ((v * v) - (2 * a * (p - position)));
						
						sqrt = (
							(tosqrt === 0)
							? 0
							: Math.sqrt(
								tosqrt < 0 ? -tosqrt : tosqrt
							)
						);
						
						$1 = (-v + sqrt) / a, $2 = (-v - sqrt) / a;
						
						return (
							($1 <= 0)
								? ($2 <= 0) ? null : $2
								: ($2 <= 0)
									? $1
									: ($1 < $2) ? $1 : $2
						);
					}
                }
                else if (v) {
                    return ((position - p) / v);
                }
            };
        })(),

        byVelocity: function(phys, velocity) {
            var v=phys.velocity, a=phys.acceleration;
            if(
                ((v<velocity)&&(a>0))||
                ((v>velocity) && (a<0))
            ){return (velocity-v)/a;}
            else{return null;}
        }
    },

    position: {
        byTime: function(phys, time) {
            if(isNaN(time) || (time<=0)){return null;}
            else{
                var v=phys.velocity, a=phys.acceleration;
                return (phys.position + (v*time) + (a*time*time/2));
            }
        }
    }
};

if(undefined !== this.module){module.exports = Phys.predict;}
