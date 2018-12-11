jQuery(function ($) {
	(function () {
		/**
		 * Корректировка округления десятичных дробей.
		 *
		 * @param {String}  type  Тип корректировки.
		 * @param {Number}  value Число.
		 * @param {Integer} exp   Показатель степени (десятичный логарифм основания корректировки).
		 * @returns {Number} Скорректированное значение.
		 */
		function decimalAdjust(type, value, exp) {
			// Если степень не определена, либо равна нулю...
			if (typeof exp === 'undefined' || +exp === 0) {
				return Math[type](value);
			}
			value = +value;
			exp = +exp;
			// Если значение не является числом, либо степень не является целым числом...
			if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
				return NaN;
			}
			// Сдвиг разрядов
			value = value.toString().split('e');
			value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
			// Обратный сдвиг
			value = value.toString().split('e');
			return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
		}

		// Десятичное округление к ближайшему
		if (!Math.round10) {
			Math.round10 = function (value, exp) {
				return decimalAdjust('round', value, exp);
			};
		}
		// Десятичное округление вниз
		if (!Math.floor10) {
			Math.floor10 = function (value, exp) {
				return decimalAdjust('floor', value, exp);
			};
		}
		// Десятичное округление вверх
		if (!Math.ceil10) {
			Math.ceil10 = function (value, exp) {
				return decimalAdjust('ceil', value, exp);
			};
		}
	})();

	if ($(window).width() < 680) {
		$(document).mouseup(function (e) {

			var div = $(".w__calculator__socials ");
			if (!div.is(e.target) &&
				div.has(e.target).length === 0) {
				div.fadeOut(300);



			}
		});

	}
	//цепляем событие на onclick кнопки
	var button = document.getElementById('button1');
	button.addEventListener('click', function () {
		//нашли наш контейнер
		var ta = document.getElementById('texx');
		console.log(ta);
		//производим его выделение
		var range = document.createRange();
		range.selectNode(ta);
		window.getSelection().addRange(range);

		//пытаемся скопировать текст в буфер обмена
		try {
			document.execCommand('copy');

			$(this).text('Скопировано!');
		} catch (err) {
			console.log('Can`t copy');
		}
		//очистим выделение текста, чтобы пользователь "не парился"
		window.getSelection().removeAllRanges();
	});



	$('.w__calculator__iframe').on('click', function () {

		$('.w__calculator__iframe__wrapp').fadeIn(300).css('display', 'flex');
	});

	$('.w__calculator__iframe__close').on('click', function () {

		$('.w__calculator__iframe__wrapp').fadeOut(300).css('display', 'flex');
	});
	$('.share_mobile').on('click', function () {

		$('.w__calculator__socials').fadeIn(300).css('display', 'flex');
	});



	$('.add_actives').on('click', function () {
		let last_block;
		let last_block_time;
		let last_block_select;

		let selectOption = `
<option value="">Выбери тип активности</option>
<option value="1">бадминтон </option>
<option value="2">баскетбол</option>
<option value="3">бег 8,5 км/ч </option>
<option value="4">бег 10 км/ч </option>
<option value="5">бег 15 км/ч </option>
<option value="6">бег на лыжах </option>
<option value="7">бокс </option>
<option value="8">борьба </option>
<option value="9">велосипед 20 км/ч </option>
<option value="10">велосипед 25 км/ч </option>
<option value="11">велосипед 30 км/ч </option>
<option value="12">велосипед 35+ км/ч </option>
<option value="13">водное поло </option>
<option value="14">волейбол </option>
<option value="15">восточные единоборства </option>
<option value="16">горный велосипед </option>
<option value="17">катание на роликах </option>
<option value="18">горные лыжи </option>
<option value="19">настольный теннис </option>
<option value="20">плавание (баттерфляй) </option>
<option value="21">плавание (брасс) </option>
<option value="22">плавание (кроль) </option>
<option value="23">пляжный волейбол </option>
<option value="24">прыжки через скакалку </option>
<option value="25">спортивная ходьба </option>
<option value="26">теннис </option>
<option value="27">тренажерный зал </option>
<option value="28">тяжелая атлетика </option>
<option value="29">футбол </option>
<option value="30">ходьба 6 км/ч </option>
<option value="31">ходьба 7 км/ч </option>
<option value="32">ходьба 8 км/ч </option>
<option value="33">хоккей </option>
`;


		let block_activnost = `<div class="activ_block">
<label class="w__calculator__label-select w__calculator__label w__calculator__label-margin">
	<span>Тип активности</span>
	<select class="w__calculator__select w__calculator__select-mission" required>
		${selectOption}
	</select>
</label>
<br>
<label class="w__calculator__label-input w__calculator__label  w__calculator__label-margin">
	<span>Длительность (мин)</span>
	<input class="w__input w__input_time" type="number" required min="0" max="999">
</label>
</div>`;

// ПРОВЕРКА НА ЗАПОЛНЕННОСТЬ ПОЛЕЙ 
//  last_block = $(".block__actives_ajax .activ_block").last();
	
//  last_block_time = Number(last_block.find('.w__input_time').val());
// last_block_select = last_block.find('.w__calculator__select-mission').val();


// if(last_block_time < 999 && last_block_time > 0 && last_block_select !== ''){
// 	$('.block__actives_ajax').append(block_activnost)

// }else{
// 	alert('Заполните поля выше');
// }


$('.block__actives_ajax').append(block_activnost)

	})



	function сalories(item) {

		let expense;

		switch (item) {
			case 1:
				return expense = 4.7;
			case 2:
				return expense = 6.8;
			case 3:
				return expense = 8.5;
			case 4:
				return expense = 10.6;
			case 5:
				return expense = 15.3;
			case 6:
				return expense = 8.5;
			case 7:
				return expense = 9.5;
			case 8:
				return expense = 6.4;
			case 9:
				return expense = 8.5;
			case 10:
				return expense = 11;
			case 11:
				return expense = 13;
			case 12:
				return expense = 17;
			case 13:
				return expense = 10.6;
			case 14:
				return expense = 3.2;
			case 15:
				return expense = 10.6;
			case 16:
				return expense = 9;
			case 17:
				return expense = 7.4;
			case 18:
				return expense = 6.4;
			case 19:
				return expense = 5.8;
			case 20:
				return expense = 11.6;
			case 21:
				return expense = 10.6;
			case 22:
				return expense = 11.6;
			case 23:
				return expense = 8.5;
			case 24:
				return expense = 10.6;
			case 25:
				return expense = 6.8;
			case 26:
				return expense = 7.4;
			case 27:
				return expense = 6;
			case 28:
				return expense = 6.2;
			case 29:
				return expense = 7.4;
			case 30:
				return expense = 4.2;
			case 31:
				return expense = 4.7;
			case 32:
				return expense = 5.3;
			case 33:
				return expense = 8.5;
			default:
				console.log('Не верный тип активности');
		}



	}


	function param_content(weight, that, time, type) {


		let that_str;
		let x = сalories(type);
		let p;
		let t = time;
		let w = weight;


		that_str=that[0].toUpperCase() + that.substring(1)

		p = (t / 60) * w * x;
		p = (Math.round10(p, 0));
		$('.w__calculator__calories_content').append(`
<div class="w__calculator__calories w__calculator__param">
					<div class="w__calculator__result__text w__calculator__result__that">
						${that_str}
					</div>
					<div class="w__calculator__result__text w__calculator__result__time">
					${time} мин
					</div>
					<div class="w__calculator__result__count">
						<span>${p}</span> ккал
					</div>
				</div>
`);

return p;


	}



	$('.w__calculator__restart').on('click', function () {
		$('form.w__calculator__form').removeClass('hidden');
		$('.w__calculator__result__wrapper').addClass('hidden')
		$('.w__calculator__abstract  ').addClass('hidden');
		$('.w__calculator__restart  ').addClass('hidden');
	});


	$("form.w__calculator__form").submit(function () {
		$('.w__calculator__calories_content').html('');
		
		let that;
		let time;
		let weight;
		let type;
		let allCount= 0;


		weight = Number($('.w__input-weight').val());

		$('.block__actives_ajax .activ_block').each(function () {
			
			that = $.trim($(this).find(".w__calculator__select-mission option:selected").text());
			time = Number($(this).find('.w__input_time').val());
			type = Number($(this).find(".w__calculator__select-mission option:selected").val());
		

			allCount+= param_content(weight,that,time,type);


		});

		$('.w__calculator__calories__rezultAll .w__calculator__result__count span').text(allCount);

		if ($(window).width() < 680) {

			$('.w__calculator__form').addClass('hidden');
			$('.w__calculator__restart').removeClass('hidden');
		}

		$('.w__calculator__result__wrapper ').removeClass('hidden');
		$('.w__calculator__abstract  ').removeClass('hidden');
		return false;
	});

})