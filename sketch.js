// 學習歷程數據
const assignments = [
  { week: "Week 1", title: "程式起點：基礎幾何", url: "https://p5js.org/examples/hello-p5-js.html" },
  { week: "Week 2", title: "色彩與變數", url: "https://p5js.org/examples/color-brightness.html" },
  { week: "Week 3", title: "For 迴圈的規律", url: "https://p5js.org/examples/interaction-follow-3d-mouse.html" },
  { week: "Week 4", title: "物件導向的思考", url: "https://p5js.org/examples/objects-array-of-objects.html" },
  { week: "Week 5", title: "陣列與群體動畫", url: "https://p5js.org/examples/animate-bouncy-bubbles.html" },
  { week: "Week 6", title: "互動介面設計", url: "https://p5js.org/examples/interaction-reach-1.html" },
  { week: "Week 7", title: "多媒體整合", url: "https://p5js.org/examples/image-load-and-display-image.html" },
  { week: "Midterm", title: "生長的脈絡", url: "" }
];

let frameElements = [];
let plants = [];

function setup() {
  createCanvas(400, 400);
  let canvas = createCanvas(windowWidth * 0.4, windowHeight);
  canvas.parent('canvas-container');

  // 技術結合點：p5.dom (createElement)
  // 動態生成 HTML 畫框標籤
  for (let i = 0; i < assignments.length; i++) {
    let frame = createElement('div', assignments[i].week);
    frame.parent('canvas-container');
    frame.addClass('gallery-frame');
    
    // 點擊事件處理
    frame.mousePressed(() => {
      document.getElementById('content-frame').src = assignments[i].url;
      document.getElementById('week-title').innerText = `${assignments[i].week}: ${assignments[i].title}`;
    });
    
    frameElements.push({
      elt: frame,
      baseX: width * 0.2 + (i % 2) * (width * 0.4),
      baseY: 100 + i * 80
    });
  }

  // 初始化裝飾：數位盆栽
  for (let i = 0; i < 3; i++) {
    plants.push(new DigitalPlant(random(50, width - 50), height - 60));
  }
}

function draw() {
  background(220);
  background(20);

  // 視角切換：計算視差位移 (Parallax)
  let moveX = map(mouseX, 0, width, 30, -30);
  
  // 繪製畫廊空間 (利用 vertex 營造透視感)
  drawGallerySpace(moveX);
  
  // 更新與顯示畫框位置
  for (let f of frameElements) {
    // 畫框隨滑鼠反向移動，產生 3D 空間感
    f.elt.position(f.baseX + moveX, f.baseY);
    f.elt.size(80, 60);
  }

  // 繪製數位盆栽 (裝飾與主題結合)
  for (let p of plants) {
    p.display(moveX);
  }
}

function drawGallerySpace(offsetX) {
  let horizonY = height * 0.2;
  
  // 地板 (地板顏色隨透視點偏移)
  fill(40);
  beginShape();
  vertex(0, height);
  vertex(width, height);
  vertex(width * 0.8 + offsetX, horizonY);
  vertex(width * 0.2 + offsetX, horizonY);
  endShape(CLOSE);

  // 牆面 (遠向透視)
  fill(60);
  beginShape();
  vertex(width * 0.2 + offsetX, horizonY);
  vertex(width * 0.8 + offsetX, horizonY);
  vertex(width, 0);
  vertex(0, 0);
  endShape(CLOSE);
  
  // 牆線
  stroke(100);
  line(width * 0.2 + offsetX, horizonY, 0, height);
  line(width * 0.8 + offsetX, horizonY, width, height);
}

class DigitalPlant {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.segments = 15;
    this.len = random(40, 80);
  }

  display(offsetX) {
    push();
    translate(this.x + offsetX * 0.5, this.y); // 盆栽也有視差，但較輕微
    
    // 繪製盆子
    fill(100, 80, 60);
    rect(-15, 0, 30, 20);
    
    // 繪製數位藤蔓 (vertex loop)
    noFill();
    stroke(0, 255, 100, 150);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < this.segments; i++) {
      let ty = map(i, 0, this.segments, 0, -this.len);
      let tx = sin(frameCount * 0.05 + i * 0.2) * 10;
      vertex(tx, ty);
    }
    endShape();
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth * 0.4, windowHeight);
}
