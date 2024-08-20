//
//misc.js  その他いろいろ、共通関数
//

//星クラス
class Star {
  constructor() {
    this.x = rand(0, FIELD_W) << 8;
    this.y = rand(0, FIELD_H) << 8;
    this.vx = 0;
    this.vy = rand(30, 200);
    this.sz = rand(1, 2);
  }

  draw() {
    let x = this.x >> 8;
    let y = this.y >> 8;

    if (
      x < camera_x ||
      x >= camera_x + SCREEN_W ||
      y < camera_y ||
      y >= camera_y + SCREEN_H
    )
      return;

    vcon.fillStyle = rand(0, 2) != 0 ? stars : stars;
    vcon.fillRect(x, y, this.sz, this.sz);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y > FIELD_H << 8) {
      this.y = 0;
      this.x = rand(0, FIELD_W) << 8;
    }
  }
}

//キャラクターのベースクラス
class CharaBase {
  constructor(snum, x, y, vx, vy) {
    this.sn = snum;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.kill = false;
    this.count = 0;
  }

  update() {
    this.count++;

    this.x += this.vx;
    this.y += this.vy;

    if (
      this.x < 0 ||
      this.x > FIELD_W << 8 ||
      this.y < 0 ||
      this.y > FIELD_H << 8
    )
      this.kill = true;
  }

  draw() {
    drawSprite(this.sn, this.x, this.y);
  }
}

class CharaBase2 {
  constructor(snum, x, y, vx, vy) {
    this.sn = snum;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.kill = false;
    this.count = 0;
  }

  update() {
    this.count++;

    this.x += this.vx;
    this.y += this.vy;

    if (
      this.x < 0 ||
      this.x > FIELD_W << 8 ||
      this.y < 0 ||
      this.y > FIELD_H << 8
    )
      this.kill = true;
  }

  draw() {
    drawSprite3(this.sn, this.x, this.y);
  }
}

//爆発のクラス
class Expl extends CharaBase {
  draw() {
    this.sn = 16 + (this.count >> 2);
    if (this.sn == 27) {
      this.kill = true;
      return;
    }
    super.draw();
  }
}

//もっと派手な爆発
function explosion(x, y, vx, vy) {
  expl.push(new Expl(0, x, y, vx, vy));
  for (let i = 0; i < 10; i++) {
    let evx = vx + (rand(-10, 10) << 6);
    let evy = vy + (rand(-10, 10) << 6);
    expl.push(new Expl(i, x, y, evx, evy));
  }
}

//キーボードが押されたとき
document.onkeydown = function (e) {
  key[e.keyCode] = true;
};

//キーボードが離されたとき
document.onkeyup = function (e) {
  key[e.keyCode] = false;
};

//スプライトを描画する
function drawSprite(snum, x, y) {
  let sx = sprite[snum].x;
  let sy = sprite[snum].y;
  let sw = sprite[snum].w;
  let sh = sprite[snum].h;

  let px = (x >> 8) - sw / 2;
  let py = (y >> 8) - sh / 2;

  if (
    px + sw < camera_x ||
    px >= camera_x + SCREEN_W ||
    py + sh < camera_y ||
    py >= camera_y + SCREEN_H
  )
    return;

  vcon.drawImage(spriteImage, sx, sy, sw, sh, px, py, sw, sh);
}

//スプライトを描画する
function drawSprite2(x, y) {
  let sx = 0;
  let sy = 0;
  let sw = 21;
  let sh = 41;

  let px = (x >> 8) - sw / 2;
  let py = (y >> 8) - sh / 2;

  if (
    px + sw < camera_x ||
    px >= camera_x + SCREEN_W ||
    py + sh < camera_y ||
    py >= camera_y + SCREEN_H
  )
    return;

  vcon.drawImage(syukatsuImage, sx, sy, sw, sh, px, py, sw, sh);
}

//スプライトを描画する
function drawSprite3(x, y) {
  let sx = 0;
  let sy = 0;
  let sw = 20;
  let sh = 20;

  let px = (x >> 8) - sw / 2;
  let py = (y >> 8) - sh / 2;

  if (
    px + sw < camera_x ||
    px >= camera_x + SCREEN_W ||
    py + sh < camera_y ||
    py >= camera_y + SCREEN_H
  )
    return;

  vcon.drawImage(javaImage, sx, sy, sw, sh, px, py, sw, sh);
}

//整数のランダムを作る
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//当たり判定
function checkHit(x1, y1, r1, x2, y2, r2) {
  // 円同士の当たり判定
  let a = (x2 - x1) >> 8;
  let b = (y2 - y1) >> 8;
  let r = r1 + r2;

  return r * r >= a * a + b * b;
}

function music() {
  if (enemy < setEnemy && life > 0) {
    bgm.loop = true;
    bgm.play();
  }
}
