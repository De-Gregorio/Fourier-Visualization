class cerchio{
    constructor(raggio, omega, phi) {
      this.raggio = raggio;
      this.omega = omega;
      this.angle = phi;
    }
    
    show(X, Y){
      let x = this.raggio *   cos(this.angle) + X   
      let y = this.raggio *  sin(this.angle) + Y
      noFill(); strokeWeight(1)
      circle(X, Y, this.raggio * 2  )
      line(X, Y, x, y)
      return  [x, y]
    }
    
    update(speed){
      this.angle += this.omega / speed
    }  
  }
   
  class shape{
    constructor(arrX, arrY){
      this.arrX = arrX
      this.arrY = arrY
      if(arrX.length != arrY.length){
        throw new Error("arrX e arry non hanno la stessa lunghezza.");
      }
      else{
        this.L = this.arrX.length
      }
    }
    
    show(){
      strokeWeight(5)
      if(this.L != 0){ 
       point(this.arrX[0], this.arrY[0])
      }
      for(let i = 1; i < this.L; i++){
        strokeWeight(5)
        point(this.arrX[i], this.arrY[i])
        strokeWeight(1)
        line(this.arrX[i], this.arrY[i], this.arrX[i-1], this.arrY[i-1])
      }
    }
    
    add(x, y){
      this.arrY.push(y)
      this.arrX.push(x)
      this.L += 1
    }
    
    clean(){
      this.arrY = []
      this.arrX = []
      this.L = 0
    }
  }