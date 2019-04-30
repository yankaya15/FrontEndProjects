
(function() {
    function Sprite(url, pos, size, speed, frames, dir, once) {//конструктор класса спрайт
        this.pos = pos;//координаты х и у первого кадра из спрайта
        this.size = size;//размеры одного кадра
        this.speed = typeof speed === 'number' ? speed : 0;// скорость анимации
        this.frames = frames; //массив кадров в анимации подряд
        this._index = 0;
        this.url = url;//путь к изображению
        this.dir = dir || 'horizontal';//движение по спрайту слева направо
        this.once = once; //если нужно только один раз проиграть анимацию то тру
    };

    Sprite.prototype = {//создаем прототип функции спрайт ,для использования на разные объекты
        update: function(dt) {//обновление анимации с передачей времени иггры
            this._index += this.speed*dt;
        },

        render: function(ctx) {//отрисовка каждого кадра анимации
            var frame;

            if(this.speed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];

                if(this.once && idx >= max) {
                    this.done = true;
                    return;
                }
            }
            else {
                frame = 0;
            }


            var x = this.pos[0];
            var y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.size[1];
            }
            else {
                x += frame * this.size[0];
            }

            ctx.drawImage(resources.get(this.url),//отрисовка изображения на канвасе
                          x, y,
                          this.size[0], this.size[1],//размер
                          0, 0,//смещение и направление
                          this.size[0], this.size[1]);
        }
    };

    window.Sprite = Sprite;
})();