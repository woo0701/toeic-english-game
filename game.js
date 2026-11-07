const STAGES = [
  {
    name: '辦公室日常', tag: 'OFFICE',
    questions: [
      { sentence: 'Please _____ the attached report before the meeting.', answer: 'review', choices: ['review', 'attend', 'repair'], hint: '會議前需要先看過附件中的報告。' },
      { sentence: 'Could you _____ a message for Ms. Chen?', answer: 'leave', choices: ['leave', 'lend', 'arrive'], hint: '這裡是請對方幫忙把訊息轉交給某人。' },
    ],
  },
  {
    name: '商務旅行', tag: 'TRAVEL',
    questions: [
      { sentence: 'Please arrive at the gate _____ thirty minutes before departure.', answer: 'at least', choices: ['at least', 'instead', 'although'], hint: '想想登機前，抵達時間通常要預留多少提前量。' },
      { sentence: 'The flight was delayed _____ heavy rain.', answer: 'because of', choices: ['because of', 'despite', 'beside'], hint: '後半句說明延誤的天氣原因；判斷兩者是因果還是讓步關係。' },
    ],
  },
  {
    name: '人才招募', tag: 'CAREERS',
    questions: [
      { sentence: 'Applicants are asked to _____ a résumé with the application.', answer: 'submit', choices: ['submit', 'attend', 'install'], hint: '這裡是履歷與申請文件的常見搭配，表示把文件交給公司。' },
      { sentence: 'The new manager has extensive _____ in sales.', answer: 'experience', choices: ['experience', 'experienced', 'expenses'], hint: '句子談的是工作資歷，這個位置需要名詞。' },
    ],
  },
  {
    name: '訂單與出貨', tag: 'ORDERS',
    questions: [
      { sentence: 'We will _____ your order within two business days.', answer: 'process', choices: ['process', 'attend', 'replace'], hint: '主詞是訂單；想想公司收到訂單後會先進行什麼程序。' },
      { sentence: 'The items are currently _____, but will arrive next week.', answer: 'out of stock', choices: ['out of stock', 'on schedule', 'in advance'], hint: '商品目前無法立即供貨，不過預計下週就會到。' },
    ],
  },
  {
    name: '會議與行程', tag: 'MEETINGS',
    questions: [
      { sentence: 'The meeting has been _____ until Friday.', answer: 'postponed', choices: ['postponed', 'enclosed', 'improved'], hint: '行程往後挪到週五，留意這裡使用完成式被動語態。' },
      { sentence: 'Please let us know whether you can _____ the conference.', answer: 'attend', choices: ['attend', 'intend', 'arrange'], hint: '句子詢問能否出席，找一個可以直接搭配活動名稱的動詞。' },
    ],
  },
];

const ui = {
  nav: document.querySelector('#stage-nav'),
  stageNumber: document.querySelector('#stage-number'),
  stageName: document.querySelector('#stage-name'),
  questionCount: document.querySelector('#question-count'),
  questionText: document.querySelector('#question-text'),
  questionHint: document.querySelector('#question-hint'),
  score: document.querySelector('#score'),
  worldTitle: document.querySelector('#world-title'),
  overlay: document.querySelector('#game-overlay'),
  overlaySymbol: document.querySelector('#overlay-symbol'),
  overlayKicker: document.querySelector('#overlay-kicker'),
  overlayTitle: document.querySelector('#overlay-title'),
  overlayCopy: document.querySelector('#overlay-copy'),
  startButton: document.querySelector('#start-button'),
  toast: document.querySelector('#toast'),
};

let stageIndex = 0;
let questionIndex = 0;
let score = 0;
let started = false;
let toastTimer;

function buildStageNav() {
  ui.nav.innerHTML = STAGES.map((stage, index) => `
    <div class="stage-chip" data-stage="${index}">
      <span class="chip-number">${String(index + 1).padStart(2, '0')}</span>
      <span class="chip-copy"><strong>${stage.name}</strong><small>${stage.tag}</small></span>
    </div>`).join('');
}

function updateStageNav() {
  [...ui.nav.children].forEach((chip, index) => {
    chip.classList.toggle('active', index === stageIndex && started);
    chip.classList.toggle('complete', index < stageIndex || (!isPlaying() && started && stageIndex >= STAGES.length));
  });
}

function isPlaying() {
  return started && stageIndex < STAGES.length;
}

function updateQuestion() {
  const stage = STAGES[stageIndex];
  const question = stage.questions[questionIndex];
  ui.stageNumber.textContent = String(stageIndex + 1).padStart(2, '0');
  ui.stageName.textContent = `${stage.name} · ${stage.tag}`;
  ui.questionCount.textContent = `第 ${questionIndex + 1} 題 / ${stage.questions.length}`;
  ui.questionText.textContent = question.sentence;
  ui.questionHint.textContent = question.hint;
  ui.worldTitle.textContent = `${stage.tag} / WORD RUNNER`;
  updateStageNav();
}

function updateScore() {
  ui.score.textContent = String(score).padStart(2, '0');
}

function showToast(message, kind) {
  window.clearTimeout(toastTimer);
  ui.toast.textContent = message;
  ui.toast.className = `toast show ${kind}`;
  toastTimer = window.setTimeout(() => ui.toast.classList.remove('show'), 1050);
}

function showFinish() {
  started = false;
  stageIndex = STAGES.length;
  updateStageNav();
  ui.stageNumber.textContent = '★';
  ui.stageName.textContent = 'MISSION COMPLETE';
  ui.questionCount.textContent = '五關挑戰完成';
  ui.questionText.textContent = '太棒了！你完成所有多益任務。';
  ui.questionHint.textContent = `本次得分 ${score} 分。按下方按鈕，再挑戰一次吧！`;
  ui.worldTitle.textContent = 'TOEIC QUEST / COMPLETE';
  ui.overlaySymbol.textContent = '★';
  ui.overlayKicker.textContent = 'ALL STAGES CLEAR';
  ui.overlayTitle.textContent = '闖關完成！';
  ui.overlayCopy.textContent = `你的最終分數是 ${score} 分。再玩一輪，挑戰更高分數吧！`;
  ui.startButton.innerHTML = '再玩一次 <span aria-hidden="true">↻</span>';
  ui.overlay.classList.remove('hidden');
}

function showGame() {
  ui.overlaySymbol.textContent = '✦';
  ui.overlayKicker.textContent = 'READY, RUNNER?';
  ui.overlayTitle.textContent = '準備好出發了嗎？';
  ui.overlayCopy.textContent = '用方向鍵移動、按空白鍵跳躍。碰到正確答案卡，就能前往下一題。';
  ui.startButton.innerHTML = '開始闖關 <span aria-hidden="true">→</span>';
}

buildStageNav();

const GAME_WIDTH = 960;
const GAME_HEIGHT = 480;
const WORLD_WIDTH = 1740;
const LANES = [
  { x: 355, platformY: 350 },
  { x: 865, platformY: 292 },
  { x: 1375, platformY: 340 },
];

class WordRunnerScene extends Phaser.Scene {
  constructor() {
    super('WordRunner');
    this.choiceItems = [];
    this.locked = true;
    this.feedback = null;
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, GAME_HEIGHT);
    this.physics.world.pause();
    this.drawWorld();
    this.createPlayerTexture();
    this.player = this.physics.add.sprite(90, 390, 'runner');
    this.player.setDepth(5);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(30, 48).setOffset(17, 24);
    this.player.setDragX(900);
    this.player.setMaxVelocity(285, 800);
    this.platforms = this.physics.add.staticGroup();

    LANES.forEach((lane, index) => {
      const platform = this.add.rectangle(lane.x, lane.platformY, 238, 18, 0xffffff).setStrokeStyle(2, 0xffffff, 0.9);
      platform.setDepth(2);
      this.physics.add.existing(platform, true);
      this.platforms.add(platform);
      const lip = this.add.rectangle(lane.x, lane.platformY - 6, 72, 4, index === 1 ? 0xffc85c : 0x38cdb3).setDepth(3);
      const support = this.add.rectangle(lane.x, lane.platformY + 44, 126, 54, 0x7ca7c9, 0.14).setDepth(1);
      support.setScale(1, 1);
      this.add.circle(lane.x, lane.platformY + 75, 3, 0x84aecd, 0.35).setDepth(1);
      void lip;
    });

    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.platforms);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('A,D,W');
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, GAME_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.09, 0);
    this.cameras.main.setDeadzone(210, 0);
    this.input.keyboard.enabled = false;
  }

  drawWorld() {
    this.add.rectangle(WORLD_WIDTH / 2, GAME_HEIGHT / 2, WORLD_WIDTH, GAME_HEIGHT, 0xc9e8f7).setDepth(-10);
    this.add.circle(805, 76, 28, 0xffe8a8).setScrollFactor(0.2).setDepth(-8);

    // Distant, softly colored office buildings give each run a little depth.
    for (let x = 22; x < WORLD_WIDTH; x += 185) {
      const h = 64 + ((x * 13) % 48);
      this.add.rectangle(x + 56, 420 - h / 2, 112, h, 0x9ac4db, 0.42).setDepth(-5);
      for (let row = 0; row < 3; row++) {
        this.add.rectangle(x + 28 + row * 28, 420 - h / 2 + 15, 7, 9, 0xf7fcff, 0.56).setDepth(-4);
        this.add.rectangle(x + 28 + row * 28, 420 - h / 2 + 34, 7, 9, 0xf7fcff, 0.56).setDepth(-4);
      }
    }
    for (let x = 110; x < WORLD_WIDTH; x += 425) {
      this.add.ellipse(x, 92 + ((x * 3) % 58), 72, 20, 0xffffff, 0.47).setDepth(-6);
      this.add.ellipse(x + 20, 89 + ((x * 3) % 58), 46, 24, 0xffffff, 0.53).setDepth(-6);
    }

    this.ground = this.add.rectangle(WORLD_WIDTH / 2, 454, WORLD_WIDTH, 52, 0x32567a).setDepth(1);
    this.add.rectangle(WORLD_WIDTH / 2, 428, WORLD_WIDTH, 10, 0x49c7ac).setDepth(1);
    for (let x = 24; x < WORLD_WIDTH; x += 65) {
      this.add.rectangle(x, 446 + ((x * 7) % 13), 31, 3, 0x557294, 0.8).setDepth(2);
      this.add.circle(x + 24, 426, 2, 0xb7f3dc, 0.8).setDepth(2);
    }
    this.physics.add.existing(this.ground, true);
  }

  createPlayerTexture() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Backpack, body, arms, head, hair, and bright shoes.
    g.fillStyle(0x425fd8, 1); g.fillRoundedRect(12, 38, 14, 27, 6);
    g.fillStyle(0xffa45e, 1); g.fillRoundedRect(21, 36, 25, 29, 9);
    g.fillStyle(0xffc37d, 1); g.fillRoundedRect(17, 42, 8, 19, 4);
    g.fillStyle(0x253b5c, 1); g.fillRoundedRect(22, 59, 9, 15, 4); g.fillRoundedRect(36, 59, 9, 15, 4);
    g.fillStyle(0xffffff, 1); g.fillRoundedRect(18, 70, 16, 7, 3); g.fillRoundedRect(33, 70, 16, 7, 3);
    g.fillStyle(0xffd3aa, 1); g.fillCircle(34, 24, 16);
    g.fillStyle(0x283b58, 1); g.fillRoundedRect(18, 10, 31, 17, 8); g.fillCircle(22, 23, 7); g.fillCircle(46, 22, 7);
    g.fillStyle(0x263957, 1); g.fillCircle(39, 27, 1.6);
    g.lineStyle(1.4, 0xd27f66, 1); g.beginPath(); g.arc(34, 29, 5, 0.2, 1.8, false); g.strokePath();
    g.fillStyle(0x5f7be9, 1); g.fillCircle(17, 46, 3);
    g.generateTexture('runner', 64, 80);
    g.destroy();
  }

  begin() {
    this.physics.world.resume();
    this.input.keyboard.enabled = true;
    this.locked = false;
    this.resetRunner();
    this.spawnChoices();
  }

  resetRunner() {
    this.player.setVelocity(0, 0);
    this.player.setPosition(90, 390);
    this.player.setFlipX(false);
    this.cameras.main.stopFollow();
    this.cameras.main.setScroll(0, 0);
    this.cameras.main.startFollow(this.player, true, 0.09, 0);
  }

  spawnChoices() {
    this.clearChoices();
    const question = STAGES[stageIndex].questions[questionIndex];
    const choices = Phaser.Utils.Array.Shuffle([...question.choices]);
    const lanes = Phaser.Utils.Array.Shuffle([...LANES]);
    choices.forEach((word, index) => {
      const lane = lanes[index];
      const platformTop = lane.platformY - 9;
      const x = lane.x;
      const y = platformTop - 72;
      const box = this.add.rectangle(x, y, 196, 58, 0xffffff, 0.97).setStrokeStyle(2, 0xd7e3ee, 1).setDepth(4);
      const badge = this.add.rectangle(x - 77, y, 24, 23, 0xeaf0ff).setDepth(5);
      const badgeText = this.add.text(x - 77, y, String.fromCharCode(65 + index), {
        fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#496be2', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(6);
      const fontSize = word.length > 13 ? '14px' : word.length > 9 ? '16px' : '18px';
      const label = this.add.text(x + 12, y, word, {
        fontFamily: 'Manrope, Arial, sans-serif', fontSize, color: '#263a55', fontStyle: 'bold',
        align: 'center', wordWrap: { width: 145 }, lineSpacing: 1,
      }).setOrigin(0.5).setDepth(6);
      this.physics.add.existing(box, true);
      const item = { word, box, badge, badgeText, label, used: false };
      this.physics.add.overlap(this.player, box, () => this.collect(item));
      this.tweens.add({ targets: [box, badge, badgeText, label], y: '-=4', duration: 850 + index * 120, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.choiceItems.push(item);
    });
  }

  clearChoices() {
    this.choiceItems.forEach((item) => {
      item.box.destroy(); item.badge.destroy(); item.badgeText.destroy(); item.label.destroy();
    });
    this.choiceItems = [];
  }

  collect(item) {
    if (this.locked || item.used || !isPlaying()) return;
    const question = STAGES[stageIndex].questions[questionIndex];
    if (item.word === question.answer) {
      this.locked = true;
      item.used = true;
      score += 5;
      updateScore();
      item.box.setFillStyle(0xe0f8f0).setStrokeStyle(2, 0x43c6a4, 1);
      item.label.setColor('#148d78').setText(`✓  ${item.word}`);
      showToast('答對了！ +5 分', 'correct');
      this.time.delayedCall(800, () => this.advance());
    } else {
      item.used = true;
      score -= 5;
      updateScore();
      item.box.setFillStyle(0xffefea).setStrokeStyle(2, 0xf09a82, 1);
      item.badge.setFillStyle(0xffded4);
      item.badgeText.setColor('#d76a50').setText('×');
      item.label.setColor('#c26650');
      showToast('再試試其他選項！ −5 分', 'wrong');
    }
  }

  advance() {
    questionIndex += 1;
    if (questionIndex >= STAGES[stageIndex].questions.length) {
      stageIndex += 1;
      questionIndex = 0;
      if (stageIndex >= STAGES.length) {
        this.clearChoices();
        this.input.keyboard.enabled = false;
        showFinish();
        return;
      }
    }
    updateQuestion();
    this.resetRunner();
    this.spawnChoices();
    this.locked = false;
  }

  update() {
    if (!this.player || !this.physics.world.isPaused && !isPlaying()) return;
    if (this.physics.world.isPaused || this.locked) return;
    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    const jump = Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keys.W);
    if (left) {
      this.player.setVelocityX(-255);
      this.player.setFlipX(true);
    } else if (right) {
      this.player.setVelocityX(255);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }
    if (jump && (this.player.body.blocked.down || this.player.body.touching.down)) {
      this.player.setVelocityY(-605);
    }
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#c9e8f7',
  antialias: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade', arcade: { gravity: { y: 1250 }, debug: false } },
  scene: [WordRunnerScene],
});

ui.startButton.addEventListener('click', () => {
  if (!started || stageIndex >= STAGES.length) {
    stageIndex = 0;
    questionIndex = 0;
    score = 0;
    started = true;
    updateScore();
    updateQuestion();
    showGame();
    game.scene.getScene('WordRunner').begin();
  }
  ui.overlay.classList.add('hidden');
});
