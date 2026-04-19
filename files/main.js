/* BoardJS — Example showcase */

const TheBoard = new BoardJS('TheShow');

// ── Example selector ──────────────────────────────────────────────────────────
(function () {
  const examples = { ExHome, ExBubbles, ExCredits, ExHover, ExGallery, ExWheel, ExEasing, ExDialog };
  document.querySelectorAll('#IndexItems .Item').forEach(item => {
    const activate = () => {
      document.querySelectorAll('#IndexItems .Item').forEach(el => el.classList.remove('Selected'));
      item.classList.add('Selected');
      examples[item.dataset.example]?.();
    };
    item.addEventListener('click', activate);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
  });
})();


// ── Examples ──────────────────────────────────────────────────────────────────

function ExHome() {
  TheBoard.reset()
    .delay(500)
    .text('Hello, welcome to', { x: 0, y: 100, class: 'title center', show: 'fade', duration: 1000 })
    .delay(800)
    .image('files/logo.png', { x: 270, y: 157, width: 160, show: 'fade zoom', duration: 500, easing: 'backout', wait: true })
    .text('The easy and powerful way to make presentations, stories and ads.', { x: 0, y: 220, class: 'description center', show: 'fade', duration: 1000, wait: true })
    .image('content/home/arrow.png', { x: 625, y: 350, show: 'fromleft fade', duration: 1500, easing: 'bounce', id: 'Arrow', wait: true })
    .flash('Arrow', { count: 'always', duration: 500 })
    .showTooltip('Arrow', 'These examples reveal the features<br>and possibilities of BoardJS.', { duration: 10000 })
    .go();
}

function ExBubbles() {
  TheBoard.reset().background('rgb(78,122,219)');
  for (let i = 0; i < 60; i++) {
    const size = Math.random() * 120 + 30;
    TheBoard
      .image('content/bubbles/bubble.png', {
        x: Math.random() * 700,
        y: -(size + 50),
        width: size,
        show: 'frombottom fade',
        duration: 6000 + Math.random() * 7000,
        id: `bubble${i}`,
      })
      .delay(800);
  }
  TheBoard.go();
}

const CREDITS = [
  ['Language Design & Concept',      'Andi Gutmans, Rasmus Lerdorf,<br>Zeev Suraski, Marcus Boerger'],
  ['Zend Scripting Language Engine', 'Andi Gutmans, Zeev Suraski,<br>Stanislav Malyshev, Dmitry Stogov'],
  ['Extension Module API',           'Andi Gutmans, Zeev Suraski, Andrei Zmievski'],
  ['UNIX Build & Modularization',    'Stig Bakken, Sascha Schumann, Jani Taskinen'],
  ['Windows Port',                   'Shane Caraveo, Zeev Suraski,<br>Wez Furlong, Pierre-Alain Joye'],
  ['Server API (SAPI)',               'Andi Gutmans, Shane Caraveo, Zeev Suraski'],
  ['Streams Abstraction Layer',      'Wez Furlong, Sara Golemon'],
  ['PHP Data Objects Layer',         'Wez Furlong, Marcus Boerger,<br>Sterling Hughes, George Schlossnagle'],
  ['Output Handler',                 'Zeev Suraski, Thies C. Arntzen,<br>Marcus Boerger, Michael Wallner'],
];

function ExCredits() {
  TheBoard.reset()
    .background('#000', { duration: 50 })
    .text('PHP Credits',         { x: 0, y: 100, class: 'title center',       show: 'fade', duration: 1000, id: 'CredTitle' })
    .text('php.net/credits.php', { x: 0, y: 150, class: 'description center', show: 'fade', duration: 1000, id: 'CredSub', wait: true })
    .delay(2500)
    .remove('CredTitle CredSub');

  CREDITS.forEach(([left, right], i) => {
    TheBoard
      .text(left,  { x: 0, y: 500, class: 'description', show: 'appear', duration: 1, id: `cl${i}` })
      .text(right, { x: 0, y: 500, class: 'description', show: 'appear', duration: 1, id: `cr${i}` })
      .style(`cl${i}`, 'left:auto;right:380px;font-size:14px;color:#aaa')
      .style(`cr${i}`, 'left:330px;font-weight:bold')
      .move(`cl${i}`, { y: 400, duration: 300, easing: 'easeout' })
      .move(`cr${i}`, { y: 400, duration: 300, easing: 'easeout', wait: true })
      .move(`cl${i}`, { y: -100, duration: 20000 })
      .move(`cr${i}`, { y: -100, duration: 20000 })
      .delay(2600);
  });

  TheBoard.go();
}

function ExHover() {
  const circleStyle = 'background-color:rgb(29,150,65);padding:40px;cursor:pointer;border:3px solid rgb(24,131,56)';
  const items = [
    { id: 'hx1', x: 50,  y: 20  },
    { id: 'hx2', x: 258, y: 20  },
    { id: 'hx3', x: 466, y: 20  },
    { id: 'hx4', x: 50,  y: 238 },
    { id: 'hx5', x: 258, y: 238 },
    { id: 'hx6', x: 466, y: 238 },
  ];

  TheBoard.reset().background('rgb(34,177,76)');
  items.forEach(({ id, x, y }, i) => {
    TheBoard
      .text(`Text ${i + 1}`, { x, y, class: 'title', show: 'zoom', duration: 200, id })
      .circle(id, circleStyle)
      .delay(100);
  });

  const ids = items.map(i => i.id).join(' ');
  TheBoard
    .delay(200)
    .hover(ids, 'border:5px solid rgb(24,131,56);scale:1.2;rotate:360', { duration: 300 })
    .tooltip('hx5', 'Tooltip & Hover<br>work together without any conflict')
    .tooltip('hx4', 'UnHovered<br>The tooltip was not affected')
    .unhover('hx4')
    .go();
}

const GALLERY = [
  { src: 'content/gallery/image1.jpg', title: 'Country Road' },
  { src: 'content/gallery/image2.jpg', title: 'The Humber Bridge' },
  { src: 'content/gallery/image3.jpg', title: 'Wind Farm' },
  { src: 'content/gallery/image4.jpg', title: 'Copse of Trees' },
  { src: 'content/gallery/image5.jpg', title: 'Green Field Blue Sky' },
];
let galleryIndex = 0;

function ExGallery() {
  galleryIndex = 0;

  function updateGallery() {
    const { src, title } = GALLERY[galleryIndex];
    TheBoard
      .remove('GalleryTitle')
      .text(title, { x: 0, y: 20, class: 'title', show: 'fromtop fade', duration: 1000, easing: 'backout', id: 'GalleryTitle' })
      .style('GalleryTitle', 'width:700px;text-shadow:0 1px 4px #000')
      .background(src);
    document.getElementById('gallery-prev').style.display = galleryIndex === 0                   ? 'none' : 'block';
    document.getElementById('gallery-next').style.display = galleryIndex === GALLERY.length - 1  ? 'none' : 'block';
  }

  TheBoard.reset()
    .background(GALLERY[0].src)
    .text(GALLERY[0].title, { x: 0, y: 20, class: 'title', show: 'fromtop fade', duration: 1000, easing: 'backout', id: 'GalleryTitle' })
    .style('GalleryTitle', 'width:700px;text-shadow:0 1px 4px #000');

  // Preload remaining images
  GALLERY.slice(1).forEach(({ src }, i) => {
    TheBoard.image(src, { x: 0, y: 0, width: 1, height: 1, id: `preload${i}` });
  });
  TheBoard.remove('preload0 preload1 preload2 preload3');

  TheBoard
    .image('content/gallery/next.png', { x: 360, y: 410, show: 'fade', duration: 500, id: 'gallery-next' })
    .style('gallery-next', 'cursor:pointer')
    .on('gallery-next', 'click', () => { if (galleryIndex < GALLERY.length - 1) { galleryIndex++; updateGallery(); } })

    .image('content/gallery/prev.png', { x: 330, y: 410, show: 'fade', duration: 500, id: 'gallery-prev' })
    .style('gallery-prev', 'cursor:pointer;display:none')
    .on('gallery-prev', 'click', () => { if (galleryIndex > 0) { galleryIndex--; updateGallery(); } })

    .hover('gallery-next gallery-prev', 'scale:1.2', { duration: 300 })
    .text('Photos from flickr.com/photos/freefoto', { x: 4, y: 430, class: 'description', show: 'split', duration: 1000, id: 'gallery-credit' })
    .style('gallery-credit', 'font-size:13px;text-shadow:1px 1px 1px #000')
    .go();
}

function ExWheel() {
  function onItemClick() {
    const i = parseInt(this.id.replace('WheelItem', ''), 10);
    TheBoard.rotate('TheWheel', -(45 * i), 1000, { easing: 'linear' }).html('TheInfo', `Item<br>${i + 1}`);
  }

  TheBoard.reset()
    .image('content/wheel/wheel.png', { x: 5, y: 5, id: 'TheWheel' })
    .text('', { x: 460, y: 30, class: 'title', show: 'split', duration: 1000, id: 'TheInfo' })
    .style('TheInfo', 'padding:10px;border:2px solid rgb(92,71,118);width:200px;min-height:90px;background:rgb(128,100,162)')
    .round('TheInfo', 20);

  const count = 8;
  for (let i = 0; i < count; i++) {
    const alpha = (2 * Math.PI / count) * i - Math.PI / 2 + 0.4;
    TheBoard
      .image(`content/wheel/img${i}.png`, { x: 202 + 160 * Math.cos(alpha), y: 202 + 160 * Math.sin(alpha), show: 'fade', duration: 100, id: `WheelItem${i}` })
      .rotate(`WheelItem${i}`, 15, { duration: 0 })
      .delay(50)
      .style(`WheelItem${i}`, 'cursor:pointer')
      .on(`WheelItem${i}`, 'click', onItemClick)
      .hover(`WheelItem${i}`, 'scale:1.3', { duration: 800, easing: 'elastic' })
      .delay(50);
  }

  const allItems = Array.from({ length: count }, (_, i) => `WheelItem${i}`).join(' ');
  TheBoard
    .merge(allItems, 'TheWheel')
    .showTooltip('WheelItem3', 'Click here', { duration: 3000 })
    .go();
}

function ExEasing() {
  const EASING_LIST = ['linear', 'easeIn', 'easeOut', 'backIn', 'backOut', 'elastic', 'bounce'];
  const normalize   = s => s.toLowerCase();

  TheBoard.reset();
  EASING_LIST.forEach((name, i) => {
    const n = i + 1;
    TheBoard
      .text(name, { x: 48 + i * 87, y: 350, class: 'Button', show: 'fade', duration: 100, id: `easebtn${n}` })
      .image('content/easing/ball.png', { x: 68 + i * 87, y: 310, id: `ball${n}` });
  });

  TheBoard
    .on('easebtn1 easebtn2 easebtn3 easebtn4 easebtn5 easebtn6 easebtn7', 'click', function () {
      const n = parseInt(this.id.replace('easebtn', ''), 10);
      TheBoard.move(`ball${n}`, { y: 50, duration: 1000, easing: normalize(EASING_LIST[n - 1]) }).fadeOut(this.id);
    })
    .on('ball1 ball2 ball3 ball4 ball5 ball6 ball7', 'click', function () {
      const n = parseInt(this.id.replace('ball', ''), 10);
      TheBoard.move(this.id, { y: 310, duration: 1000, easing: normalize(EASING_LIST[n - 1]) }).fadeIn(`easebtn${n}`);
    })
    .text('Click the buttons to animate — click the balls to reset.', { x: 0, y: 410, class: 'description center', show: 'fade', duration: 100 })
    .go();
}

function ExDialog() {
  const line = (who, text, audio) =>
    TheBoard
      .showTooltip(who, text)
      .sound(`content/dialog/${audio}.mp3`, { wait: true })
      .removeTooltip(who);

  TheBoard.reset()
    .text('Content from <a style="color:#fff;text-decoration:underline" target="_blank" rel="noopener" href="http://www.focusenglish.com">focusenglish.com</a>', { x: 0, y: 420, class: 'description center', show: 'fade', duration: 1000 })
    .text("Don't forget to drop me a line!", { x: 0, y: 10, class: 'title center', show: 'fade', duration: 1000, id: 'DialogTitle', wait: true })
    .text("Ryan finds a new job in New York and is about to move there.<br>He doesn't want his friendship with Adriana to drift apart.", { x: 50, y: 100, class: 'description', show: 'fade', duration: 1000, id: 'DialogPlot' })
    .style('DialogPlot', 'font-size:22px;text-align:center;line-height:34px;')
    .delay(7000)
    .remove('DialogPlot')
    .image('content/dialog/adriana.png', { x: 68,  y: 150, show: 'fromleft',  duration: 500, id: 'woman', wait: true })
    .image('content/dialog/ryan.png',    { x: 385, y: 150, show: 'fromright', duration: 500, id: 'man',   wait: true });

  line('woman', "I heard you're moving to New York.",                          'dropmealineadriana1');
  line('man',   "Yes. I've got an offer in upstate New York.",                 'dropmealineryan1');
  line('woman', "Oh, that's great! But I'm going to miss you.",               'dropmealineadriana2');
  line('man',   "Me too. Let's keep in touch.",                               'dropmealineryan2');
  line('woman', "Yeah.<br>Don't forget to drop me a line when you settle.",   'dropmealineadriana3');
  line('man',   "Trust me, I won't. I'll keep you posted.",                   'dropmealineryan3');
  line('woman', "You have my address?",                                        'dropmealineadriana4');
  line('man',   "Well, I have your e-mail address.",                           'dropmealineryan4');
  line('woman', "All right! I look forward to hearing from you. Good luck!",  'dropmealineadriana5');

  TheBoard.go();
}

ExHome();
