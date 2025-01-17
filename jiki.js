//
//jiki.js  自機関連
//
var musicAttack = new Audio("魔王魂  レトロ03.mp3");
var musicKill = new Audio("魔王魂  レトロ22.mp3");
var musicDamsage = new Audio("魔王魂  戦闘06.mp3");
//弾クラス
class Tama extends CharaBase {
  constructor(x, y, vx, vy) {
    super(5, x, y, vx, vy);
    this.r = 4;
  }

  update() {
    super.update();

    for (let i = 0; i < teki.length; i++) {
      if (!teki[i].kill) {
        if (checkHit(this.x, this.y, this.r, teki[i].x, teki[i].y, teki[i].r)) {
          teki[i].kill = true;
          this.kill = true;
          expl.push(
            new Expl(20, teki[i].x, teki[i].y, teki[i].vx >> 3, teki[i].vy >> 3)
          );
          //explosion(teki[i].x, teki[i].y, teki[i].vx, teki[i].vy);
          musicKill.play();
          enemy++;
          break;
        }
      }
    }
  }

  draw() {
    super.draw();
  }
}

//自機クラス
class Jiki {
  constructor() {
    this.x = (FIELD_W / 2) << 8;
    this.y = (FIELD_H / 2) << 8;
    this.speed = 512;
    this.anime = 0;
    this.reload = 0;
    this.relo2 = 0;
    this.r = 10;
    this.damage = 0;
  }

  //自機の移動
  update() {
    if (this.damage) {
      if (enemy < setEnemy && life > 0) {
        musicDamsage.play();
      }
      this.damage--;
      life = life - 1;
    }
    if (key[32] && this.reload == 0) {
      tama.push(new Tama(this.x + (4 << 8), this.y - (10 << 8), 0, -2000));
      tama.push(new Tama(this.x - (4 << 8), this.y - (10 << 8), 0, -2000));
      tama.push(new Tama(this.x + (8 << 8), this.y - (10 << 8), 80, -2000));
      tama.push(new Tama(this.x - (8 << 8), this.y - (10 << 8), -80, -2000));

      this.reload = 4;
      if (++this.relo2 == 4) {
        this.reload = 20;
        this.relo2 = 0;
      }
      musicAttack.play();
    }
    if (!key[32]) this.reload = this.relo2 = 0;

    if (this.reload > 0) this.reload--;

    if (key[37] && this.x > this.speed) {
      this.x -= this.speed;
      if (this.anime > -8) this.anime--;
    } else if (key[39] && this.x <= (FIELD_W << 8) - this.speed) {
      this.x += this.speed;
      if (this.anime < 8) this.anime++;
    } else {
      if (this.anime > 0) this.anime--;
      if (this.anime < 0) this.anime++;
    }

    if (key[38] && this.y > this.speed) this.y -= this.speed;

    if (key[40] && this.y <= (FIELD_H << 8) - this.speed) this.y += this.speed;
  }

  //描画
  draw() {
    //drawSprite(2 + (this.anime >> 2), this.x, this.y);
    drawSprite2(this.x, this.y);
  }
}
