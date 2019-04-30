
var requestAnimFrame = (function(){ //для поостановки в очередь на отображение
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Cоздание холста канваса игры
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.setAttribute('width', document.documentElement.clientWidth*0.9);
canvas.setAttribute('height', document.documentElement.clientHeight * 0.9);
document.body.appendChild(canvas);

// цикл игры для постоянного оьнавления и отображения 
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 800;// это разница между текущим временем и временем последнего обновления. 

    update(dt);
    render();//отрисовываем текущее состояние
   
    lastTime = now;
    requestAnimFrame(main);//  делаем самовызывающуюся функцию  
};

document.getElementById('start').addEventListener('click', function() {
    main();
    });//при нажатии старт запускаем игру.начинается первая реализация игрового процсесса

function init() {
    terrainPattern = ctx.createPattern(resources.get('img/demo-bg.jpg'), 'no-repeat','opacity=.2');//отрисовска фона вов ремя самой игры

    document.getElementById('play-again').addEventListener('click', function() { //перезапуск игры
        reset();
    });
    reset();

    document.getElementById('start').addEventListener('click', function() { //запуск состояния игры при старте
        reset();
        gameNeedYou();
    });

    document.getElementById('start').addEventListener('click', function() { 
        document.getElementById('game-start').style.display = 'none';
    });

    lastTime = Date.now();//передаем в переменную ныненшнее время
    
    gameStart();

    
}

resources.load([ //загрузка изображений в кэш
    'img/hdsonic.png',
    'img/demo-bg.jpg',
    'img/money2.png',
    'img/zombiwalk.png',
    'img/zombieat.png'
]);
resources.onReady(init);//построение холста только после загрузки картинок

// Начальные состояния игры
var player = {      //игрок
    pos: [0, 0],
    sprite: new Sprite('img/hdsonic.png', [15,6], [100, 100], 8, [ 2,3,4,5,6,7,8,9])
};
var scoreMass = [];//массив результатов
var enemies = [];//массив денег
var storms = [];
var eat=[];

var gameTime = 0;//будем отслеживать время игры
var isGameOver;//флаг окончания игры
var isGameStart;//флаг нчала игры
var terrainPattern;//помещение фон в переменную

var score = 0;//обнуление счета
var scoreEl = document.getElementById('score');//вывод счета в див на странице

var live = 3;//обнуление счета
var liveEl = document.getElementById('live');//вывод счета в див на странице
//Скорость игроков в пикселях
var playerSpeed = 300;
var enemySpeed =100;
var stormSpeed =150;


//Добавление элементов с каждой передачей времени
function update(dt) {

    gameTime += dt;//время игры плюсуются с каждой секундой обычного времени
    if(isGameOver==true){
        localStorage.setItem('result', JSON.stringify(scoreMass));
        localStorage.setItem('resultName', JSON.stringify(nameNass));
        //если игра окончена преобразуем результаты в джейсон формат и сохраняем в локал сторж
        return;//остановка обновления элементов
    }

    handleInput(dt);
    updateEntities(dt);

    if((Math.random() < 1 - Math.pow(0.9995,gameTime))/5) {//если время игры увеличиваемя то мы добавляем объекты
        enemies.push({
            pos: [canvas.width,//за пределами канваса рисуем объекты
                  getRandomInt(280,300)],
            sprite: new Sprite('img/money2.png', [272, 42], [87,63],
                               2, [0])//выбираем вид объекта из спрайта
        });

    }
    if((Math.random() < 1 - Math.pow(0.9996, gameTime))/4) {
        enemies.push({
            pos: [canvas.width,
                  getRandomInt(180, 200)],
            sprite: new Sprite('img/money2.png', [160,142], [79,76],
                               3,[0])
        });
    }

    if((Math.random() < 1 - Math.pow(0.9995, gameTime))/5) {
        enemies.push({
            pos: [canvas.width,
                  getRandomInt(10, 30)],
            sprite: new Sprite('img/money2.png', [46, 142], [79,77],
                               5, [0])  

        });
    }

    if((Math.random() < 1 - Math.pow(0.9998, gameTime))/10) {
        storms.push({
            pos: [canvas.width,
                  
        getRandomInt(5, 300)],
            sprite: new Sprite('img/zombiwalk.png', [0,5], [78,110],
                               5, [1,2,3,4,5,6,7,8,9])  

        });
    }
    checkCollisions();
    scoreEl.innerHTML = score;
    liveEl.innerHTML = live;
};

function getRandomInt(min, max)
    {
      return Math.floor(Math.random() * max)+min;
    }

function handleInput(dt) {//обрабатываем нажатия клавиш для реакции нашего игрока на них
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;//если нажата калавиша вниз то позиция игрока смещаемся на единицу 
    }

    if(input.isDown('UP') || input.isDown('w')) {//Умножая playerSpeed с параметром dt, мы считаем сумму пикселей для 
                                                    //перемещение по фрейму. Если прошла одна секунда с последнего обновления то 
                                                    //игрок продвинется на 200 пикселей, если 0,5 то на 100. 
                                                    //Это показывается как постоянная скорость передвижения зависит от 
                                                    //частоты кадров.
        player.pos[1] -= playerSpeed * dt;
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
    }
}

function updateEntities(dt) {
    // обновление всех объектов во времени
    player.sprite.update(dt);

    for(var i=0; i<enemies.length; i++) {
        enemies[i].pos[0] -= enemySpeed * dt;
        enemies[i].sprite.update(dt);
        // Удаление объектов выходящих за канвас
        if(enemies[i].pos[0] + enemies[i].sprite.size[0] < 0) {
            enemies.splice(i, 1);
            i--;
        }//обновить спрайт, обновить движение,
    }  // и удалить

    for(var i=0; i<storms.length; i++) {
        storms[i].pos[0] -= stormSpeed * dt;
        storms[i].sprite.update(dt);
        // Удаление объектов выходящих за канвас
        if(storms[i].pos[0] + storms[i].sprite.size[0] < 0) {
            storms.splice(i, 1);
            i--;
        }//обновить спрайт, обновить движение,
    }  // и удалить

     for(var i=0; i<eat.length; i++) {
        eat[i].sprite.update(dt);

        // Remove if animation is done
        if(eat[i].sprite.done) {
            eat.splice(i, 1);
            i--;
        }
    }
}
// Соприкосновения игрока и объектов

function collides(x, y, r, b, x2, y2, r2, b2) {//определение столкновения
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {//принимает массивы с положением и 
    return collides(pos[0], pos[1],//размерами элементомв
                    pos[0] + size[0], pos[1] + size[1],//расчитывает абсолютные координаты
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

function checkCollisions() {//дейсвтия при обнаружении столкновения
    checkPlayerBounds();
    // Пробегаем циклом по массиву объектов и проверяем столкновени с игроком
    for(var i=0; i<enemies.length; i++) {
        var pos = enemies[i].pos;
        var size = enemies[i].sprite.size;

        for(var j=0; j<storms.length; j++) {
            var pos2 = storms[j].pos;
            var size2 = storms[j].sprite.size;

            if(boxCollides(pos2, size2, player.pos, player.sprite.size)) {
                zombiSound();
                eat.push({
                    pos: pos2,
                    sprite: new Sprite('img/zombieat.png',
                                       [0, 0],
                                       [111,98],
                                       16,
                                       [0, 1, 2, 3, 4, 5, 6, 7],
                                       null,
                                       true)
                });
            
            storms.splice(j, 1);
            j--;
            live-=1;
            break;
            }

           /* if (boxCollides(pos, size, pos2, size2)&&(pos2>canvas.width)) {//передаем функции расчитаные положения
                   storms.splice(j, 1);
                   j--;
                    }*/


        }



        if (boxCollides(pos, size, player.pos, player.sprite.size)) {//передаем функции расчитаные положения
                                                                     //объектов и игрока
            score += 100;
            scoreSound();     //добавление очков при столкновении 
            enemies.splice(i, 1);// удаление объекта при столкновении
            i--;
        }

        
    }
}

function checkPlayerBounds() {
    // Осталвяем игрока в пределах канвас
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
/*for(var i=0; i<enemies.length; i++) {

    for(var j=0; j<storms.length; j++) {


        if(storms[j].pos[0] < enemies[i].pos[0]+enemies[i].sprite.size[0]) {
            storms[j].pos[0] = enemies[i].pos[0]+enemies[i].sprite.size[0];
        }
       
        if(storms[j].pos[1] < enemies[i].pos[1]+enemies[i].sprite.size[1]) {
            storms[j].pos[1] = enemies[i].pos[1]+enemies[i].sprite.size[1];
        }

        if(enemies[i].pos[0] < enemies[i].pos[0]+enemies[i].sprite.size[0]) {
            enemies[i].pos[0] = enemies[i].pos[0]+enemies[i].sprite.size[0];
        }
       
        if(enemies[i].pos[1] < enemies[i].pos[1]+enemies[i].sprite.size[1]) {
            enemies[i].pos[1] = enemies[i].pos[1]+enemies[i].sprite.size[1];
        }
       
   

    }
}*/
    for(var i=0; i<enemies.length; i++) {
        if((enemies[i].pos[0]  < 1)||(live==0)) {
            gameOver();
            break;//если положение объекта на границе канваса ,иггра окончена
        }
    }//сделать так чобы при трех промахах уменьшался счет а не заканчивалась игра
}

// Функция вызывается гейм лупом для отображения каждого кадра
function render() {
    ctx.fillStyle = terrainPattern;//отрисовка фона созданого в инит
    ctx.fillRect(0, 0, canvas.width, canvas.height);//

    if(!isGameOver) {// если нет флага игра оконченаа отрисовываем игрока
        renderEntity(player);
    }

    renderEntities(enemies);//отрисовка объектов
    renderEntities(storms);
    renderEntities(eat);
};

function renderEntities(list) {//функция для перебора циклом всех объектов массива
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }    
}

function renderEntity(entity) {//трансформацию canvas для размещения объекта на экране
    ctx.save();//сохраняет текущую трансформацию
    ctx.translate(entity.pos[0], entity.pos[1]);//перемещение объекта в нужное место
    entity.sprite.render(ctx);
    ctx.restore();//восстанавливает
}
//функция отображения старта игры -меню
function gameStart() {
    document.getElementById('game-start').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'block';
    document.getElementById('score').style.display = 'none';
    document.getElementById('instructions').style.display = 'none';
    isGameStart = true; 


}

// функция отображения окончания игры на экране
function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    document.getElementById('game-start').style.display = 'none';
    isGameOver = true;
    scoreMass.push(score);
    var yourname=prompt('Say your name,player!');
    
    if(!isNaN(yourname)||(yourname==null)){
       yourname=prompt('Write word');
    }
    nameNass.push(yourname);
    //добавление результата игры в массив результатов
}

function gameNeedYou() {//во время игры отображение меню и геймовер нету
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    document.getElementById('game-start').style.display = 'block';
    document.getElementById('score').style.display = 'block';
    document.getElementById('instructions').style.display = 'block';

}

// При нажатии на кнопку сыграть еще
function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    document.getElementById('score').style.display = 'block';
    document.getElementById('instructions').style.display = 'block';
    isGameOver = false;
    gameTime = 0;//обнуление времени игры
    score = 0;//обнулние счета
    live=3;
    enemies = [];//обнуление количесва объектов
    storms=[];
    eat=[];
    player.pos = [50, canvas.height / 2];//обнуление позиции игрока  
    gameSound();
};

document.getElementById('menu').addEventListener('click', function() {//отображение меню игры
    document.getElementById('game-start').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'block';
    document.getElementById('score').style.display = 'none';
    document.getElementById('instructions').style.display = 'none';

});
                
document.getElementById('results').addEventListener('click', function() {//отображение результатов игры
    document.getElementById('modal').style.display = 'block';  //открытие модального окна
    document.getElementById('button-block').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';

});

document.getElementById('close-modal').addEventListener('click', function() {//закрытие модального окна
    document.getElementById('modal').style.display = 'none';
    document.getElementById('button-block').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
});

document.getElementById('results').addEventListener('click', function() {//сохрание результатов в джейсон и локал стораж
    var tableObj = document.createElement('table');
    tableObj.style.width = '100%';
    var tableHTML = '<tr><td>Game</td><td>Result</td></tr>';
    var parseres=JSON.parse(localStorage.getItem('result'));
    var parseresName=JSON.parse(localStorage.getItem('resultName'));
    for (i=0;i<parseres.length;i++){
        tableHTML += '<tr><td>' + parseresName[i] + '</td><td>' + parseres[i] + '</td></tr>';
    }

    tableObj.innerHTML = tableHTML;//офармление результатов в таблтцу
    document.getElementById('modal').appendChild(tableObj); 
   
});

//window.onpopstate = function(event) {
 // alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
//};

//history.pushState({isGameStart}, "title 1", "?page=1");
//history.pushState({page: 2}, "title 2", "?page=2");
//history.replaceState({page: 3}, "title 3", "?page=3");
//history.back(); // alerts "location: http://example.com/example.html?page=1, state: {"page":1}"
//history.back(); // alerts "location: http://example.com/example.html, state: null
//history.go(2);  // alerts "location: http://example.com/example.html?page=3, state: {"page":3}


    


var nameNass=[];

window.addEventListener('resize',function(){
    canvas.setAttribute('width', document.documentElement.clientWidth*0.9);
    canvas.setAttribute('height', document.documentElement.clientHeight * 0.9);
})

function scoreSound(){
    var audio = new Audio();
    audio.preload = 'auto';
    audio.src = 'audio/score.mp3';
    audio.play();
    audio.volume = 0.3;
}
function zombiSound(){
    var audio = new Audio();
    audio.preload = 'auto';
    audio.src = 'audio/smex.mp3';
    audio.play();
    audio.volume = 0.3;
}
function gameSound(){
    var audio = new Audio();
    audio.preload = 'auto';
    audio.src = 'audio/game.mp3';
    
    audio.volume = 0.1;
    if(live<1){
        console.log('stop');
        return;
    }
}