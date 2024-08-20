//デバッグのフラグ
const DEBUG = true;

let drawCount = 0;
let fps = 0;
let life = 50;
let enemy = 0;
let setEnemy = 5;
let titleOr = true;
let gamemode = "normal";
let background = "black";
let stars = "yellow";
let enemynum = 50;
let wait = 0;
let lastTime = Date.now();

// スムージング
const SMOOTHING = false;

//ゲームスピード(ms)
const GAME_SPEED = 1000 / 60;

//スリープ
const sleep = (waitTime) =>
  new Promise((resolve) => setTimeout(resolve, waitTime));

//bgm
var bgm = new Audio("魔王魂 旧ゲーム音楽 戦闘曲メドレー02.mp3");

//画面サイズ
const SCREEN_W = 300;
const SCREEN_H = 320;

//キャンバスサイズ
const CANVAS_W = SCREEN_W * 2;
const CANVAS_H = SCREEN_H * 2;

//フィールドサイズ
const FIELD_W = SCREEN_W * 2;
const FIELD_H = SCREEN_H * 2;

//星の数
const STAR_MAX = 300;

//キャンバス
let can = document.getElementById("can");
let con = can.getContext("2d");
can.width = CANVAS_W;
can.height = CANVAS_H;
con.mozimageSmoothingEnagbled = SMOOTHING;
con.webkitimageSmoothingEnabled = SMOOTHING;
con.msimageSmoothingEnabled = SMOOTHING;
con.imageSmoothingEnabled = SMOOTHING;
let con2 = can.getContext("2d");

//フィールド（仮想画面）
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");
vcan.width = FIELD_W;
vcan.height = FIELD_H;

//カメラの座標
let camera_x = 0;
let camera_y = 0;

//星の実体
let star = [];

//キーボードの状態
let key = [];

//オブジェクト達
let teki = [];
let teta = [];
let tama = [];
let expl = [];
let jiki = new Jiki();
//teki[0]= new Teki( 75, 200<<8,200<<8, 0,0);

//ファイルを読み込み
let spriteImage = new Image();
spriteImage.src = "sprite.png";
let syukatsuImage = new Image();
syukatsuImage.src = "syukatsu_man.png";
let javaImage = new Image();
javaImage.src = "java.png";

//ゲーム初期化
function gameInit() {
  for (let i = 0; i < STAR_MAX; i++) star[i] = new Star();
  setInterval(gameLoop, GAME_SPEED);
  // 本気でやりたい時は requestAnimationFrameを使いましょう
}

//オブジェクトをアップデート
function updateObj(obj) {
  for (let i = obj.length - 1; i >= 0; i--) {
    obj[i].update();
    if (obj[i].kill) obj.splice(i, 1);
  }
}

//オブジェクトを描画
function drawObj(obj) {
  for (let i = 0; i < obj.length; i++) obj[i].draw();
}

//移動の処理
function updateAll() {
  updateObj(star);
  updateObj(tama);
  updateObj(teta);
  updateObj(teki);
  updateObj(expl);
  jiki.update();
}

//描画の処理
function drawAll() {
  //描画の処理
  vcon.fillStyle = jiki.damage ? "red" : background;
  vcon.fillRect(camera_x, camera_y, SCREEN_W, SCREEN_H);

  drawObj(star);
  drawObj(tama);
  jiki.draw();
  drawObj(teta);
  drawObj(teki);
  drawObj(expl);

  // 自機の範囲 0 ～ FIELD_W
  // カメラの範囲 0 ～ (FIELD_W-SCREEN_W)

  camera_x = ((jiki.x >> 8) / FIELD_W) * (FIELD_W - SCREEN_W);
  camera_y = ((jiki.y >> 8) / FIELD_H) * (FIELD_H - SCREEN_H);

  //仮想画面から実際のキャンバスにコピー

  con.drawImage(
    vcan,
    camera_x,
    camera_y,
    SCREEN_W,
    SCREEN_H,
    0,
    0,
    CANVAS_W,
    CANVAS_H
  );
}

//情報の表示
function putInfo() {
  if (DEBUG) {
    drawCount++;
    if (lastTime + 1000 <= Date.now()) {
      fps = drawCount;
      drawCount = 0;
      lastTime = Date.now();
    }

    con.font = "20px 'Impact'";
    con.fillStyle = "white";
    con.fillText("FPS :" + fps, 20, 20);
    /*     con.fillText("Tama:" + tama.length, 20, 40);
    con.fillText("Teki:" + teki.length, 20, 60);
    con.fillText("Teta:" + teta.length, 20, 80); */
    con.fillText("ライフ:" + life / 10, 20, 40);
    con.fillText("倒した敵:" + enemy, 20, 60);
  }
}

function GameMode() {
  if (gamemode == "easy") {
    con2.arc(140, 410, 20, (0 * Math.PI) / 180, (360 * Math.PI) / 180, false);
    con2.fillStyle = "yellow";
    con2.fill();
    con2.fillStyle = "black";
    con2.fillRect(200, 370, 400, 100);
    life = 50;
    setEnemy = 20;
    background = "lightblue";
    stars = "white";
    enemynum = 50;
  } else if (gamemode == "normal") {
    con2.arc(300, 410, 20, (0 * Math.PI) / 180, (360 * Math.PI) / 180, false);
    con2.fillStyle = "yellow";
    con2.fill();
    con2.fillStyle = "black";
    con2.fillRect(100, 370, 100, 100);
    con2.fillRect(420, 370, 100, 100);
    life = 30;
    setEnemy = 50;
    background = "darkblue";
    enemynum = 10;
    stars = "orange";
  } else if (gamemode == "hard") {
    con2.arc(470, 410, 20, (0 * Math.PI) / 180, (360 * Math.PI) / 180, false);
    con2.fillStyle = "yellow";
    con2.fill();
    con2.fillStyle = "black";
    con2.fillRect(40, 370, 400, 100);
    life = 50;
    setEnemy = 200;
    background = "black";
    stars = "yellow";
    enemynum = 1;
  }
}

function title() {
  con2.fillStyle = "black";
  con2.fillRect(0, 0, CANVAS_W, CANVAS_H);
  con2.fillStyle = "blue";
  con2.font = "100px 'ＭＳ ゴシック'";
  con2.fillText("内定ゲットだぜ！！", 110, 250, 400);
  con2.fillStyle = "white";
  con2.font = "20px 'ＭＳ ゴシック'";
  con2.fillText("「Enter」ボタンでスタート", 20, 620, 300);
  con2.fillText("数字の「1～3」で難易度を選択", 200, 300, 200);
  con2.fillText("Easy", 120, 350, 300);
  con2.fillText("Normal", 270, 350, 300);
  con2.fillText("Hard", 450, 350, 300);
  GameMode();
  if (key[49]) {
    gamemode = "easy";
  }
  if (key[50]) {
    gamemode = "normal";
  }
  if (key[51]) {
    gamemode = "hard";
  }

  if (key[13]) {
    titleOr = false;
  }
}

//クリア画面
function clear() {
  if (enemy >= setEnemy) {
    con.clearRect(0, 0, CANVAS_W, CANVAS_H);
    con2.fillStyle = "gold";
    con2.fillRect(0, 0, CANVAS_W, CANVAS_H);
    con2.fillStyle = "fuchsia";
    con2.font = "100px 'ＭＳ ゴシック'";
    con2.fillText("Clear", 180, 300, 300);
    con2.fillStyle = "black";
    con2.font = "20px 'ＭＳ ゴシック'";
    con2.fillText("おめでとうございます見事合格しました", 150, 330, 300);
    con2.fillText("「R」ボタンでタイトル", 20, 620, 300);
    bgm.pause();
    bgm.pause();
    musicAttack.pause();
    musicKill.pause();
    musicDamsage.pause();
    life = 10000;
  }
}

//ゲームオーバー画面
function gameover() {
  if (life <= 0) {
    con.clearRect(0, 0, CANVAS_W, CANVAS_H);
    con2.fillStyle = "black";
    con2.fillRect(0, 0, CANVAS_W, CANVAS_H);
    con2.fillStyle = "red";
    con2.font = "100px 'ＭＳ ゴシック'";
    con2.fillText("Gameover", 160, 300, 300);
    con2.fillStyle = "white";
    con2.font = "20px 'ＭＳ ゴシック'";
    con2.fillText("残念ながら不合格になりました", 170, 330, 300);
    con2.fillText("「R」ボタンでタイトル", 20, 620, 300);
    bgm.pause();
    musicAttack.pause();
    musicKill.pause();
    musicDamsage.pause();
    enemy = -10000;
  }
}

//ゲームループ
function gameLoop() {
  //テスト的に敵を出す
  if (titleOr) {
    title();
  } else {
    if (rand(0, enemynum) == 1)
      teki.push(new Teki(39, rand(0, FIELD_W) << 8, 0, 0, rand(300, 1200)));
    updateAll();
    drawAll();
    putInfo();
    music();
    if (key[82]) {
      window.location.reload();
    }
    clear();
    gameover();
  }
}

//オンロードでゲーム開始
window.onload = function () {
  gameInit();
};
[];
