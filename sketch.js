let sh = new shape([], [])
let epics = [];
let n = 2;
let XY = [];
let speed = 300;
let iter_for_replay = 1
let state = "drawing";
let allslider = [];
let sh_deque = [];
let sh_index = 1;


function setup() {
  canvasWidth = windowWidth * .89;
  canvasHeight = windowHeight;

  canvas = createCanvas(canvasWidth, canvasHeight);

  // Da fare
  // speed, , iter_for_replay, shape replay


  const leftButton = document.createElement('button');
  leftButton.textContent = '\u25C0';
  document.body.appendChild(leftButton);
  

  const rightButton = document.createElement('button');
  rightButton.textContent = '\u25B6';
  document.body.appendChild(rightButton);
  
  // Posiziona i bottoni
  leftButton.style.position = 'absolute';
  leftButton.style.left =  canvasWidth + 'px';
  leftButton.style.top = windowHeight*.6 + 'px';
  
  rightButton.style.position = 'absolute';
  rightButton.style.left = canvasWidth + 80 + 'px'; 
  rightButton.style.top = windowHeight*.6 + 'px';
  

  const indexText = document.createElement('p');
  indexText.textContent = sh_index + ''; 
  indexText.style.position = 'absolute';

  indexText.style.left = canvasWidth + 60 + 'px';
  indexText.style.top = windowHeight*.6 + 'px';

  document.body.appendChild(indexText);


  // Aggiungi event listener per i bottoni
  leftButton.addEventListener('click', () => {;
    sh_index -= 1
    sh_index = max(sh_index, 1)
    indexText.textContent = sh_index + ""
    sh = new shape(sh_deque[sh_index-1].arrX, sh_deque[sh_index-1].arrY)
  });
  
  rightButton.addEventListener('click', () => {
    sh_index += 1
    sh_index = min(sh_index, 5)
    indexText.textContent = sh_index + "" 
    sh = new shape(sh_deque[sh_index-1].arrX, sh_deque[sh_index-1].arrY)
  });

  slider = createSlider(0, 300, n); 
  slider.position((canvasWidth / 2) - slider.width, 0);

  sliderSpeed = createSlider(1, 1000, speed); 
  sliderSpeed.position(canvasWidth, windowHeight*.2);
  speedText = createP("Speed: " + speed);
  speedText.position((1+0.02)*canvasWidth , windowHeight*.23);
  


  sliderIter = createSlider(1, 10, iter_for_replay); 
  sliderIter.position(canvasWidth , windowHeight*.4);
  iterText = createP("Replay Iterations: " + iter_for_replay);
  iterText.position(canvasWidth, windowHeight*.43);


  
  slider.text = "n = " + (slider.value() * 2 + 1)
  textAlign(CENTER, CENTER);
  textSize(20);

  allslider = [slider]
  for(let i = 0; i <= 4; i++){
    sh_deque.push(new shape([], []))
  }
}


function draw() {
  if(frameCount % (iter_for_replay*speed) == 0){
    XY = []
  }
  mx = mouseX-width/2
  my =  -mouseY+height/2
  checkState()
  background(0);

  n = slider.value();
  iter_for_replay = sliderIter.value()
  speed = sliderSpeed.value()

  speedText.html("Speed: " + speed);
  iterText.html("Replay Iterations: " + iter_for_replay);


  // Disegna il testo centrato sotto lo slider
  slider.style('width', `20%`)
  fill(0);stroke(255, 100, 0);strokeWeight(3);noFill();
  text(`n = ${n*2+1}`, width / 2, height - 30);


 
  translate(width/2, height/2)
  scale(1, -1);
  stroke(200, 100);strokeWeight(1)
  line(0,-height/2 ,0, height/2)
  line(-width/2, 0, width/2, 0)
  stroke(255, 100);strokeWeight(5);noFill();
  switch(state){
    
    case "fourier":
        var pos = [0, 0]
        for(let i = 0; i < epics.length; i++){
            if(i == epics.length-1){
            stroke(0, 255, 0)
            }else{
            stroke(255, 100)
            }
            pos = epics[i].show(pos[0], pos[1])
            epics[i].update(speed)
        }
        XY.push(pos)
        beginShape()
        stroke(0, 255, 0)
        XY.forEach((pos) => {
            vertex(pos[0], pos[1])
        })
        endShape()
        break;

    default:
      stroke(255, 0, 0);
      sh.show();
      break; 
  }
}


function checkState(){
	allslider.forEach((s) => {
      if(
          mouseX > s.position().x &&
          mouseX < s.position().x + s.width &&
          mouseY > s.position().y &&
          mouseY < s.position().y + s.height &&
          state !== "swiping" &&
          state !== "fourier"){
            state = "settings"
          }
	   if(!(
			mouseX > s.position().x &&
			mouseX < s.position().x + s.width &&
			mouseY > s.position().y &&
			mouseY < s.position().y + s.height) && state === "settings"){
				state = "drawing"
			}
    })
}

function mousePressed(){
	if(state === "drawing"){
		if(abs(mx) <= width/2 && abs(my) <= height/2)
		sh.add(mx, my)
	}
}

function mouseReleased(){
    if(state === "swiping" || state === "settings"){
        state = "drawing"
    }
} 

function mouseDragged(){
  if(state === "drawing" || state === "swiping"){
    sh.add(mx, my)
    sh.show()
    state = "swiping"
  }
}

function keyPressed(){
  if(key === "f"){
    let fs = fullscreen();
    fullscreen(!fs);
  }
  if(key === "c"){
    sh.clean()
    epics = []
    XY = []
    state = "drawing"
  }
  if(key === "b"){
    if(state === "fourier"){
      return
    }
    let fourier = ft(sh, n)
    sh_deque.unshift({...sh})
    sh_deque.pop()

    fourier.forEach((vec, frequency) => {
      console.log(vec)
      let raggio = sqrt(vec[0]*vec[0] + vec[1]*vec[1])
      let omega = (frequency-n) * TWO_PI
      let phi = atan2(vec[1], vec[0])
      epics.push(new cerchio(raggio, omega, phi))
    })
    epics.sort((a, b) => b.raggio - a.raggio);
    frameCount = 0
    state = "fourier"
    XY = []  
  }
}
