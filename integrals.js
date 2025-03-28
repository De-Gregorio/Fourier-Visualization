function integrate(arr, n){
    let sommaR = 0;
    let sommaI = 0; 
    let step = 1 / arr.length
    let phi = 0
    for(t = 0; t < arr.length; t++){
      phi = -n*2*PI*t*step
      sommaR += arr[t] * cos(phi) * step;
      sommaI += arr[t] * sin(phi) * step
    }
    return [sommaR, sommaI]; // scale 1 / L 
  }
  
  function calc_C(sh, n){
    let X_integral = integrate(sh.arrX, n)
    let Y_integral = integrate(sh.arrY, n)
    a = X_integral[0] - Y_integral[1]
    b = X_integral[1] + Y_integral[0]
    return [a, b]
  }
  
  function ft(sh, n_epicicles){
    let epicicles = []
    for(let n = -n_epicicles; n <= n_epicicles; n++){
      epicicles.push(calc_C(sh, n))
    }   
    return epicicles
  }