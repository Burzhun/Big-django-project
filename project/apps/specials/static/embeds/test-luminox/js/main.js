window.fbAsyncInit = function() {
  FB.init({
    appId: "275818646607215",
    autoLogAppEvents: true,
    xfbml: true,
    version: "v2.11"
  });
};

(function(d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");
Share = {
  vkontakte: function(ptitle, pimg, text) {
    purl = 'https://mhealth.ru/blog/redakciya/proanaliziruj-svoyu-zhizn-i-poluchi-chasy-luminox/';
    origUrl = document.location.origin;
    url = "http://vkontakte.ru/share.php?";
    url += "url=" + encodeURIComponent(purl);
    url += "&title=" + encodeURIComponent(ptitle);
    url += "&description=" + encodeURIComponent(text);
    url += "&image=" + encodeURIComponent(pimg);
    url += "&noparse=true";
    Share.popup(url);
  },
  odnoklassniki: function(text) {
    purl = 'https://mhealth.ru/blog/redakciya/proanaliziruj-svoyu-zhizn-i-poluchi-chasy-luminox/';
    url = "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1";
    url += "&st.comments=" + encodeURIComponent(text);
    url += "&st._surl=" + encodeURIComponent(purl);
    Share.popup(url);
  },
  facebook: function(ptitle, pimg, text) {
    purl = 'https://mhealth.ru/blog/redakciya/proanaliziruj-svoyu-zhizn-i-poluchi-chasy-luminox/';
    origUrl = document.location.origin;
    console.log(origUrl + "/" + pimg);
    FB.ui(
      {
        method: "share_open_graph",
        action_type: "og.shares",
        action_properties: JSON.stringify({
          object: {
            "og:url": purl,
            "og:title": ptitle,
            "og:description": text,
						"og:image": pimg
          }
        })
      },
      function(response) {}
    );
  },
  twitter: function(ptitle) {
    purl = 'https://mhealth.ru/blog/redakciya/proanaliziruj-svoyu-zhizn-i-poluchi-chasy-luminox/';
    url = "http://twitter.com/share?";
    url += "text=" + encodeURIComponent(ptitle);
    url += "&url=" + encodeURIComponent(purl);
    url += "&counturl=" + encodeURIComponent(purl);
    Share.popup(url);
  },
  telegram: function(ptitle) {
    purl = 'https://mhealth.ru/blog/redakciya/proanaliziruj-svoyu-zhizn-i-poluchi-chasy-luminox/';
    url = "https://t.me/share/url?url=";
    url += "text=" + encodeURIComponent(ptitle);
    url += "&url=" + encodeURIComponent(purl);
    url += "&counturl=" + encodeURIComponent(purl);
    Share.popup(url);
  },
  mailru: function(purl, ptitle, pimg, text) {
    url = "http://connect.mail.ru/share?";
    url += "url=" + encodeURIComponent(purl);
    url += "&title=" + encodeURIComponent(ptitle);
    url += "&description=" + encodeURIComponent(text);
    url += "&imageurl=" + encodeURIComponent(pimg);
    Share.popup(url);
  },

  me: function(el) {
    console.log(el.href);
    Share.popup(el.href);
    return false;
  },

  popup: function(url) {
    window.open(url, "", "toolbar=0,status=0,width=626,height=436");
  }
};

$("body").on("click", ".test_wrapper-form label", function(e) {
  $(".wrapper_test_dev .nex_test_text").click();
  //check_true_or_false();

  var this_chek_ball = Number(
    $(this)
      .find("input")
      .data("verniy")
  );

  switch (this_chek_ball) {
    case 1:
      var koll_bal = Number($(".koll_balov_1").val()) + 1;
      $(".koll_balov_1").val(koll_bal);
      break;
    case 2:
      var koll_bal = Number($(".koll_balov_2").val()) + 1;
      $(".koll_balov_2").val(koll_bal);
      break;
    case 3:
      var koll_bal = Number($(".koll_balov_3").val()) + 1;
      $(".koll_balov_3").val(koll_bal);
      break;
    default:
      console.log("Ошибка");
  }
});

$("body").on("click", ".nex_test_text", function(e) {
  e.preventDefault();

  var number_test = Number($(this).data("counttest"));
  $(".clock_test").removeClass("check_this");

  var test_clock_func = function(
    quest,
    quest1,
    quest2,
    quest3,
    answer_1,
    answer_2,
    answer_3
  ) {
    return (
      '	<div class="test_text-content">\
				' +
      quest +
      '\
			</div>\
			<div class="clock_test">\
				<label>\
				' +
      quest1 +
      '\
					<input type="radio" name="gorod" data-verniy="' +
      answer_1 +
      '">\
				</label>\
				<label>\
				' +
      quest2 +
      '\
				<input type="radio" name="gorod" data-verniy="' +
      answer_2 +
      '">\
				</label>\
				<label>\
				' +
      quest3 +
      '\
				<input type="radio" name="gorod" data-verniy="' +
      answer_3 +
      '">\
				</label>\
				</div>'
    );
  };

  switch (number_test) {
    case 1:
      $(".change_content_test").html(
        test_clock_func(
          "Ты — отличный профессионал, способный быстро и качественно решать практически любые задачи в\
			своей сфере. Начальство прекрасно знает о твоих способностях и старается нагрузить все большим\
			количеством дел — однако при этом не спешит повышать тебе зарплату или предложить более высокую\
			должность. Что ты планируешь с этим делать?",
          "Я сам о повышении не заикаюсь. Начальство есть начальство: когда решат повысить или премировать, тогда и\
			вызовут на ковер. А сам пойдешь — еще проблем наживешь.",
          "Я давно уволился и открыл собственное дело — а мое бывшее начальство, по слухам, сейчас кусает локти:\
			«Эх, такого специалиста упустили!»",
          "Я все хочу пойти поговорить с боссом на тему повышения, но то у меня дел по горло, то его в офисе нет.",
          1,
          3,
          2
        )
      );

      break;
    case 2:
      $(".change_content_test").html(
        test_clock_func(
          "Чему новому ты научился за последний год?",
          "Плотно занимался весь год и освоил ораторское мастерство – по-моему, неплохо.",
          "Начал и бросил обучение на коуча, прошел курс сетевого маркетинга, брал уроки катания на электросамокате, ходил на курсы тантрического секса и самостоятельно учил китайский.",
          "Я в школе 11 лет отдолбил, потом в вузе еще 5 – сколько ж можно учиться?",
          3,
          2,
          1
        )
      );

      break;
    case 3:
      $(".change_content_test").html(
        test_clock_func(
          "Тебя все задолбало: наорал начальник, разругался с девушкой, у машины накрылся стартер, а денег на ремонт нет – пришлось пилить домой на автобусе в час пик, где тебе отдавили все ноги и в хлам затоптали недавно купленные ботинки. Как ты снимаешь стресс?",
          "В таких случаях мне помогает хорошенько покутить в пятницу, потом проспать всю субботу, и к понедельнику прочухаться для очередного витка унылых будней.",
          "Пожалуюсь на жизнь другу за кружкой пива – и вроде легчает.",
          "Иду в спортзал или на мощную пробежку – сразу снимает все симптомы.",
          2,
          1,
          3
        )
      );

      break;
    case 4:
      $(".change_content_test").html(
        test_clock_func(
          "Как ты сам считаешь, что отнимает у тебя больше всего времени?",
          "Меня постоянно просят чем-то помочь то друзья, то коллеги, а я не могу отказать – такой уж я отзывчивый чудак.",
          "Наверное, дорога – я стараюсь путешествовать и передвигаться по стране и миру как можно больше. Но, с другой стороны, это ведь неоценимый опыт.",
          "Пожалуй, смартфон. Я недавно прикинул, что пялюсь в него не менее 2 часов в день – торчу в соцсетях и так далее.",
          2,
          3,
          1
        )
      );
      break;
    case 5:
      $(".change_content_test").html(
        test_clock_func(
          "Чем ты любишь заниматься в свободное от работы время?",
          "Моя страсть – путешествия. Причем я сам составляю приключенческие маршруты и себе, и друзьям, и даже думаю в будущем сделать это своей работой.",
          "У меня куча разных увлечений, но настоящего кайфа что-то ничего не приносит.",
          "«Свободное от работы время»? Нет, не слышал. Мне бы до дивана доползти.",
          1,
          2,
          3
        )
      );
      break;
    case 6:
      $(".change_content_test").html(
        test_clock_func(
          "Вышел новый смартфон, на который ты давно заглядывался, но который в данный момент не очень-то можешь себе позволить. Как поступишь?",
          "Подожду, пока он упадет в цене – как раз и денег подкоплю к тому моменту.",
          "Залезу в кредит и куплю. Живем один раз!",
          "Да я даже и не мечтаю о нем – слишком дорого. Так что буду ходить со своей старой обшарпанной трубой.",
          3,
          2,
          1
        )
      );
      break;
    case 7:
      $(".change_content_test").html(
        test_clock_func(
          "Сколько часов в сутки ты спишь?",
          "На рабочей неделе обычно сплю по 4-5 часов, зато в выходные отсыпаюсь до полудня.",
          "Я не заморачиваюсь: бывает, что вообще не сплю два дня, а бывает, что дрыхну часов по 10.",
          "Я хоть и с трудом, но приучил себя ложиться до полуночи и вставать ровно в 6:00 вне зависимости от дня недели – и чувствую себя замечательно.",
          1,
          2,
          3
        )
      );
      break;
    default:
      var koll_balov_1 = Number($(".koll_balov_1").val());
      var koll_balov_2 = Number($(".koll_balov_2").val());
      var koll_balov_3 = Number($(".koll_balov_3").val());

      var share_func = function(url_s,img, title, description) {
        return (
          "\
			<div class='final_test_wrap'>\
			<img src='" +
          img +
          "' class='img_final_test'>\
			<div class='final_test_title'>" +
          title +
          "</div>\
			<div class='final_test_descript'>" +
          description +
          "</div>\
			<div class='final_test_sha_btn'>\
				<div class='reset_button_test btn_test_blue'>Еще раз</div>\
				<div class='share_link_test'>\
					<a href='https://www.facebook.com/sharer/sharer.php?u="+url_s+"' target='_blank' class='share_test_fin'>\
						<img src='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDk2LjEyNCA5Ni4xMjMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDk2LjEyNCA5Ni4xMjM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNNzIuMDg5LDAuMDJMNTkuNjI0LDBDNDUuNjIsMCwzNi41Nyw5LjI4NSwzNi41NywyMy42NTZ2MTAuOTA3SDI0LjAzN2MtMS4wODMsMC0xLjk2LDAuODc4LTEuOTYsMS45NjF2MTUuODAzICAgYzAsMS4wODMsMC44NzgsMS45NiwxLjk2LDEuOTZoMTIuNTMzdjM5Ljg3NmMwLDEuMDgzLDAuODc3LDEuOTYsMS45NiwxLjk2aDE2LjM1MmMxLjA4MywwLDEuOTYtMC44NzgsMS45Ni0xLjk2VjU0LjI4N2gxNC42NTQgICBjMS4wODMsMCwxLjk2LTAuODc3LDEuOTYtMS45NmwwLjAwNi0xNS44MDNjMC0wLjUyLTAuMjA3LTEuMDE4LTAuNTc0LTEuMzg2Yy0wLjM2Ny0wLjM2OC0wLjg2Ny0wLjU3NS0xLjM4Ny0wLjU3NUg1Ni44NDJ2LTkuMjQ2ICAgYzAtNC40NDQsMS4wNTktNi43LDYuODQ4LTYuN2w4LjM5Ny0wLjAwM2MxLjA4MiwwLDEuOTU5LTAuODc4LDEuOTU5LTEuOTZWMS45OEM3NC4wNDYsMC44OTksNzMuMTcsMC4wMjIsNzIuMDg5LDAuMDJ6IiBmaWxsPSIjOTk5OTk5Ii8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==' />\
					</a>\
					<a href='https://twitter.com/intent/tweet?text="+url_s+"' target='_blank' class='share_test_fin' >\
					 <img src='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNTEyLDk3LjI0OGMtMTkuMDQsOC4zNTItMzkuMzI4LDEzLjg4OC02MC40OCwxNi41NzZjMjEuNzYtMTIuOTkyLDM4LjM2OC0zMy40MDgsNDYuMTc2LTU4LjAxNiAgICBjLTIwLjI4OCwxMi4wOTYtNDIuNjg4LDIwLjY0LTY2LjU2LDI1LjQwOEM0MTEuODcyLDYwLjcwNCwzODQuNDE2LDQ4LDM1NC40NjQsNDhjLTU4LjExMiwwLTEwNC44OTYsNDcuMTY4LTEwNC44OTYsMTA0Ljk5MiAgICBjMCw4LjMyLDAuNzA0LDE2LjMyLDIuNDMyLDIzLjkzNmMtODcuMjY0LTQuMjU2LTE2NC40OC00Ni4wOC0yMTYuMzUyLTEwOS43OTJjLTkuMDU2LDE1LjcxMi0xNC4zNjgsMzMuNjk2LTE0LjM2OCw1My4wNTYgICAgYzAsMzYuMzUyLDE4LjcyLDY4LjU3Niw0Ni42MjQsODcuMjMyYy0xNi44NjQtMC4zMi0zMy40MDgtNS4yMTYtNDcuNDI0LTEyLjkyOGMwLDAuMzIsMCwwLjczNiwwLDEuMTUyICAgIGMwLDUxLjAwOCwzNi4zODQsOTMuMzc2LDg0LjA5NiwxMDMuMTM2Yy04LjU0NCwyLjMzNi0xNy44NTYsMy40NTYtMjcuNTIsMy40NTZjLTYuNzIsMC0xMy41MDQtMC4zODQtMTkuODcyLTEuNzkyICAgIGMxMy42LDQxLjU2OCw1Mi4xOTIsNzIuMTI4LDk4LjA4LDczLjEyYy0zNS43MTIsMjcuOTM2LTgxLjA1Niw0NC43NjgtMTMwLjE0NCw0NC43NjhjLTguNjA4LDAtMTYuODY0LTAuMzg0LTI1LjEyLTEuNDQgICAgQzQ2LjQ5Niw0NDYuODgsMTAxLjYsNDY0LDE2MS4wMjQsNDY0YzE5My4xNTIsMCwyOTguNzUyLTE2MCwyOTguNzUyLTI5OC42ODhjMC00LjY0LTAuMTYtOS4xMi0wLjM4NC0xMy41NjggICAgQzQ4MC4yMjQsMTM2Ljk2LDQ5Ny43MjgsMTE4LjQ5Niw1MTIsOTcuMjQ4eiIgZmlsbD0iIzk5OTk5OSIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=' />\
					</a>\
					<a href='https://vk.com/share.php?url="+url_s+"' target='_blank' class='share_test_fin' >\
					 <img src='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDU0OC4zNTggNTQ4LjM1OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTQ4LjM1OCA1NDguMzU4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTU0NS40NTEsNDAwLjI5OGMtMC42NjQtMS40MzEtMS4yODMtMi42MTgtMS44NTgtMy41NjljLTkuNTE0LTE3LjEzNS0yNy42OTUtMzguMTY3LTU0LjUzMi02My4xMDJsLTAuNTY3LTAuNTcxICAgbC0wLjI4NC0wLjI4bC0wLjI4Ny0wLjI4N2gtMC4yODhjLTEyLjE4LTExLjYxMS0xOS44OTMtMTkuNDE4LTIzLjEyMy0yMy40MTVjLTUuOTEtNy42MTQtNy4yMzQtMTUuMzIxLTQuMDA0LTIzLjEzICAgYzIuMjgyLTUuOSwxMC44NTQtMTguMzYsMjUuNjk2LTM3LjM5N2M3LjgwNy0xMC4wODksMTMuOTktMTguMTc1LDE4LjU1Ni0yNC4yNjdjMzIuOTMxLTQzLjc4LDQ3LjIwOC03MS43NTYsNDIuODI4LTgzLjkzOSAgIGwtMS43MDEtMi44NDdjLTEuMTQzLTEuNzE0LTQuMDkzLTMuMjgyLTguODQ2LTQuNzEyYy00Ljc2NC0xLjQyNy0xMC44NTMtMS42NjMtMTguMjc4LTAuNzEybC04Mi4yMjQsMC41NjggICBjLTEuMzMyLTAuNDcyLTMuMjM0LTAuNDI4LTUuNzEyLDAuMTQ0Yy0yLjQ3NSwwLjU3Mi0zLjcxMywwLjg1OS0zLjcxMywwLjg1OWwtMS40MzEsMC43MTVsLTEuMTM2LDAuODU5ICAgYy0wLjk1MiwwLjU2OC0xLjk5OSwxLjU2Ny0zLjE0MiwyLjk5NWMtMS4xMzcsMS40MjMtMi4wODgsMy4wOTMtMi44NDgsNC45OTZjLTguOTUyLDIzLjAzMS0xOS4xMyw0NC40NDQtMzAuNTUzLDY0LjIzOCAgIGMtNy4wNDMsMTEuODAzLTEzLjUxMSwyMi4wMzItMTkuNDE4LDMwLjY5M2MtNS44OTksOC42NTgtMTAuODQ4LDE1LjAzNy0xNC44NDIsMTkuMTI2Yy00LDQuMDkzLTcuNjEsNy4zNzItMTAuODUyLDkuODQ5ICAgYy0zLjIzNywyLjQ3OC01LjcwOCwzLjUyNS03LjQxOSwzLjE0MmMtMS43MTUtMC4zODMtMy4zMy0wLjc2My00Ljg1OS0xLjE0M2MtMi42NjMtMS43MTQtNC44MDUtNC4wNDUtNi40Mi02Ljk5NSAgIGMtMS42MjItMi45NS0yLjcxNC02LjY2My0zLjI4NS0xMS4xMzZjLTAuNTY4LTQuNDc2LTAuOTA0LTguMzI2LTEtMTEuNTYzYy0wLjA4OS0zLjIzMy0wLjA0OC03LjgwNiwwLjE0NS0xMy43MDYgICBjMC4xOTgtNS45MDMsMC4yODctOS44OTcsMC4yODctMTEuOTkxYzAtNy4yMzQsMC4xNDEtMTUuMDg1LDAuNDI0LTIzLjU1NWMwLjI4OC04LjQ3LDAuNTIxLTE1LjE4MSwwLjcxNi0yMC4xMjUgICBjMC4xOTQtNC45NDksMC4yODQtMTAuMTg1LDAuMjg0LTE1LjcwNXMtMC4zMzYtOS44NDktMS0xMi45OTFjLTAuNjU2LTMuMTM4LTEuNjYzLTYuMTg0LTIuOTktOS4xMzcgICBjLTEuMzM1LTIuOTUtMy4yODktNS4yMzItNS44NTMtNi44NTJjLTIuNTY5LTEuNjE4LTUuNzYzLTIuOTAyLTkuNTY0LTMuODU2Yy0xMC4wODktMi4yODMtMjIuOTM2LTMuNTE4LTM4LjU0Ny0zLjcxICAgYy0zNS40MDEtMC4zOC01OC4xNDgsMS45MDYtNjguMjM2LDYuODU1Yy0zLjk5NywyLjA5MS03LjYxNCw0Ljk0OC0xMC44NDgsOC41NjJjLTMuNDI3LDQuMTg5LTMuOTA1LDYuNDc1LTEuNDMxLDYuODUxICAgYzExLjQyMiwxLjcxMSwxOS41MDgsNS44MDQsMjQuMjY3LDEyLjI3NWwxLjcxNSwzLjQyOWMxLjMzNCwyLjQ3NCwyLjY2Niw2Ljg1NCwzLjk5OSwxMy4xMzRjMS4zMzEsNi4yOCwyLjE5LDEzLjIyNywyLjU2OCwyMC44MzcgICBjMC45NSwxMy44OTcsMC45NSwyNS43OTMsMCwzNS42ODljLTAuOTUzLDkuOS0xLjg1MywxNy42MDctMi43MTIsMjMuMTI3Yy0wLjg1OSw1LjUyLTIuMTQzLDkuOTkzLTMuODU1LDEzLjQxOCAgIGMtMS43MTUsMy40MjYtMi44NTYsNS41Mi0zLjQyOCw2LjI4Yy0wLjU3MSwwLjc2LTEuMDQ3LDEuMjM5LTEuNDI1LDEuNDI3Yy0yLjQ3NCwwLjk0OC01LjA0NywxLjQzMS03LjcxLDEuNDMxICAgYy0yLjY2NywwLTUuOTAxLTEuMzM0LTkuNzA3LTRjLTMuODA1LTIuNjY2LTcuNzU0LTYuMzI4LTExLjg0Ny0xMC45OTJjLTQuMDkzLTQuNjY1LTguNzA5LTExLjE4NC0xMy44NS0xOS41NTggICBjLTUuMTM3LTguMzc0LTEwLjQ2Ny0xOC4yNzEtMTUuOTg3LTI5LjY5MWwtNC41NjctOC4yODJjLTIuODU1LTUuMzI4LTYuNzU1LTEzLjA4Ni0xMS43MDQtMjMuMjY3ICAgYy00Ljk1Mi0xMC4xODUtOS4zMjktMjAuMDM3LTEzLjEzNC0yOS41NTRjLTEuNTIxLTMuOTk3LTMuODA2LTcuMDQtNi44NTEtOS4xMzRsLTEuNDI5LTAuODU5Yy0wLjk1LTAuNzYtMi40NzUtMS41NjctNC41NjctMi40MjcgICBjLTIuMDk1LTAuODU5LTQuMjgxLTEuNDc1LTYuNTY3LTEuODU0bC03OC4yMjksMC41NjhjLTcuOTk0LDAtMTMuNDE4LDEuODExLTE2LjI3NCw1LjQyOGwtMS4xNDMsMS43MTEgICBDMC4yODgsMTQwLjE0NiwwLDE0MS42NjgsMCwxNDMuNzYzYzAsMi4wOTQsMC41NzEsNC42NjQsMS43MTQsNy43MDdjMTEuNDIsMjYuODQsMjMuODM5LDUyLjcyNSwzNy4yNTcsNzcuNjU5ICAgYzEzLjQxOCwyNC45MzQsMjUuMDc4LDQ1LjAxOSwzNC45NzMsNjAuMjM3YzkuODk3LDE1LjIyOSwxOS45ODUsMjkuNjAyLDMwLjI2NCw0My4xMTJjMTAuMjc5LDEzLjUxNSwxNy4wODMsMjIuMTc2LDIwLjQxMiwyNS45ODEgICBjMy4zMzMsMy44MTIsNS45NTEsNi42NjIsNy44NTQsOC41NjVsNy4xMzksNi44NTFjNC41NjgsNC41NjksMTEuMjc2LDEwLjA0MSwyMC4xMjcsMTYuNDE2ICAgYzguODUzLDYuMzc5LDE4LjY1NCwxMi42NTksMjkuNDA4LDE4Ljg1YzEwLjc1Niw2LjE4MSwyMy4yNjksMTEuMjI1LDM3LjU0NiwxNS4xMjZjMTQuMjc1LDMuOTA1LDI4LjE2OSw1LjQ3Miw0MS42ODQsNC43MTZoMzIuODM0ICAgYzYuNjU5LTAuNTc1LDExLjcwNC0yLjY2OSwxNS4xMzMtNi4yODNsMS4xMzYtMS40MzFjMC43NjQtMS4xMzYsMS40NzktMi45MDEsMi4xMzktNS4yNzZjMC42NjgtMi4zNzksMS01LDEtNy44NTEgICBjLTAuMTk1LTguMTgzLDAuNDI4LTE1LjU1OCwxLjg1Mi0yMi4xMjRjMS40MjMtNi41NjQsMy4wNDUtMTEuNTEzLDQuODU5LTE0Ljg0NmMxLjgxMy0zLjMzLDMuODU5LTYuMTQsNi4xMzYtOC40MTggICBjMi4yODItMi4yODMsMy45MDgtMy42NjYsNC44NjItNC4xNDJjMC45NDgtMC40NzksMS43MDUtMC44MDQsMi4yNzYtMC45OTljNC41NjgtMS41MjIsOS45NDQtMC4wNDgsMTYuMTM2LDQuNDI5ICAgYzYuMTg3LDQuNDczLDExLjk5LDkuOTk2LDE3LjQxOCwxNi41NmM1LjQyNSw2LjU3LDExLjk0MywxMy45NDEsMTkuNTU1LDIyLjEyNGM3LjYxNyw4LjE4NiwxNC4yNzcsMTQuMjcxLDE5Ljk4NSwxOC4yNzQgICBsNS43MDgsMy40MjZjMy44MTIsMi4yODYsOC43NjEsNC4zOCwxNC44NTMsNi4yODNjNi4wODEsMS45MDIsMTEuNDA5LDIuMzc4LDE1Ljk4NCwxLjQyN2w3My4wODctMS4xNCAgIGM3LjIyOSwwLDEyLjg1NC0xLjE5NywxNi44NDQtMy41NzJjMy45OTgtMi4zNzksNi4zNzMtNSw3LjEzOS03Ljg1MWMwLjc2NC0yLjg1NCwwLjgwNS02LjA5MiwwLjE0NS05LjcxMiAgIEM1NDYuNzgyLDQwNC4yNSw1NDYuMTE1LDQwMS43MjUsNTQ1LjQ1MSw0MDAuMjk4eiIgZmlsbD0iIzk5OTk5OSIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=' />\
					</a>\
					<a  href='https://telegram.me/share/url?url="+url_s+"' target='_blank' class='share_test_fin' >\
					 <img src='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIC0zMSA1MTIgNTEyIiB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4Ij48cGF0aCBkPSJtMTIzLjE5NTMxMiAyNjAuNzM4MjgxIDYzLjY3OTY4OCAxNTkuMTg3NSA4Mi45MDIzNDQtODIuOTAyMzQzIDE0Mi4xNDA2MjUgMTEyLjk3NjU2MiAxMDAuMDgyMDMxLTQ1MC01MTIgMjEzLjI2NTYyNXptMjQyLjUtMTMxLjYyODkwNi0xNTYuNzE0ODQzIDE0Mi45NDE0MDYtMTkuNTE5NTMxIDczLjU2NjQwNy0zNi4wNTg1OTQtOTAuMTY0MDYzem0wIDAiIGZpbGw9IiM5OTk5OTkiLz48L3N2Zz4K' />\
					</div>\
				</div>\
			</div>\
		</div>"
        );
      };

      if (koll_balov_1 > koll_balov_2) {
        if (koll_balov_1 > koll_balov_3) {
          $(".test_wrapper-form").html(
            share_func(
              "https://mhealth.ru/embeds/test-luminox-1/",
              "https://mhealth.ru/static/embeds/test-luminox/img/test/final/1.png",
              "Стоит поработать над собой",
              "Ты действительно считаешь, что время стоит на месте, и все, о чем ты мечтаешь, чего действительно хочешь и на что реально способен, сможешь сделать как-нибудь потом, когда закончится эта бесконечная рутина? Cлушай, жизнь — это то, что с тобой происходит сегодня, и жизнь эта чертовски коротка. Не позволяй другим распоряжаться твоим временем и не захламляй свою жизнь бесконечными и бессмысленными делами — пока ты будешь за них браться, этот поток не иссякнет. Поверь в себя, научись контролировать свое время — и в этом тебя поддержит хронограф Luminox Atacama Field Day Date. Пусть при каждом взгляде на циферблат тебе передается крепость и харизма истинно мужских швейцарских часов."
            )
          );
        } else {
          $(".test_wrapper-form").html(
            share_func(
              "https://mhealth.ru/embeds/test-luminox-3/",
              "https://mhealth.ru/static/embeds/test-luminox/img/test/final/3.png",
              "Так держать!",
              "Вот это по-нашему! Ты не живешь в иллюзорных фантазиях, а самостоятельно строишь свою жизнь так, как\
				подсказывает тебе мечта, и с полной отдачей проживаешь каждую минуту своего времени. Твой лозунг —\
				«Если мне хочется — сбудется». Ты смело бросаешься в пучину самых, казалось бы, невероятных и\
				безнадежных дел, и всегда побеждаешь. А если и набиваешь шишки, то не отчаиваешься, а воспринимаешь их\
				как необходимые для дальнейшего самосовершенствования этапы. Оставайся таким же крепким и\
				харизматичным, как дайверы Luminox Scott Cassel Deep Dive на твоем запястье."
            )
          );
        }
      } else {
        if (koll_balov_2 > koll_balov_3) {
          $(".test_wrapper-form").html(
            share_func(
              "https://mhealth.ru/embeds/test-luminox-2/",
              "https://mhealth.ru/static/embeds/test-luminox/img/test/final/2.png",
              "Пора пересмотреть приоритеты",
              "Ну что ж, все неплохо! Тебя никак не назовешь рохлей или неудачником — пусть не самая любимая, но\
				неплохая работа у тебя есть, а увлечений даже больше, чем можно вместить в график. Однако признайся,\
				сколько раз ты ловил себя на мысли, что в твоей жизни вроде бы все хорошо — но все равно это не то, о чем ты\
				мечтал. Может быть, пора перестать распылять себя сразу на пятьдесят увлекательных хобби, а выбрать что-то\
				действительно любимое, стоящее, твое? Дело, в котором ты реально хорош? Сократи список бесполезных по\
				сути дел и встреч, сконцентрируйся на цели — и, глядишь, любимое дело превратится в работу. И вот тогда ты\
				станешь по-настоящему счастливым человеком. Побольше решительности! Смотри на свои F-117 Nighthawk — и смело\
				двигайся вперед, навстречу мечте."
            )
          );
        } else {
          $(".test_wrapper-form").html(
            share_func(
              "https://mhealth.ru/embeds/test-luminox-3/",
              "https://mhealth.ru/static/embeds/test-luminox/img/test/final/3.png",
              "Так держать!",
              "Вот это по-нашему! Ты не живешь в иллюзорных фантазиях, а самостоятельно строишь свою жизнь так, как\
				подсказывает тебе мечта, и с полной отдачей проживаешь каждую минуту своего времени. Твой лозунг —\
				«Если мне хочется — сбудется». Ты смело бросаешься в пучину самых, казалось бы, невероятных и\
				безнадежных дел, и всегда побеждаешь. А если и набиваешь шишки, то не отчаиваешься, а воспринимаешь их\
				как необходимые для дальнейшего самосовершенствования этапы. Оставайся таким же крепким и\
				харизматичным, как дайверы Luminox Scott Cassel Deep Dive на твоем запястье."
            )
          );
        }
      }
  }

  $(".nex_test_text").data("counttest", number_test + 1);
});

$("body").on("click", ".reset_button_test", function(e) {
  $(".test_wrapper-form").html(
    '<div class="change_content_test"> <div class="test_text-content"> Как часто ты обещаешь себе «с понедельника» пойти учиться водить мотоцикл, о котором мечтаешь с детства? </div> <div class="clock_test"> <label> У меня столько дел, что никак не найду времени. Но в понедельник обязательно начну поиски мотошколы. <input type="radio" name="gorod" data-verniy="1"> </label> <label> Три года обещал, но взял себя в руки, распределил дела и записался на курсы — на следующей неделе первое занятие. <input type="radio" name="gorod" data-verniy="2"> </label> <label> Я не откладываю мечты в долгий ящик, поэтому еще весной получил права и уже откатал первый сезон. <input type="radio" name="gorod" data-verniy="3"> </label> </div> </div> <input type="hidden" class="koll_balov_1" value="0"> <input type="hidden" class="koll_balov_2" value="0"> <input type="hidden" class="koll_balov_3" value="0"> <input class="nex_test_text" data-countTest="1" type="submit" value="Продолжить">'
  );
});

$(".start_button_test").on("click", function(e) {
  $(".wrapper_test-zagl").fadeOut(1);

  $(".test_wrapper-form").fadeIn(300);
});

function check_true_or_false() {
  if (!$(".clock_test").hasClass("check_this")) {
    $(".nex_test_text").prop("disabled", false);
    var attr = $(this).data("verniy");
    if (typeof attr !== typeof undefined && attr !== false) {
      $(this)
        .parent()
        .addClass("goog_g");
      var koll_bal = Number($(".test_wrapper-form .koll_balov").val());
      $(".test_wrapper-form .koll_balov").val(koll_bal + 1);
    } else {
      $(this)
        .parent()
        .addClass("error_g");
    }
    $(".test_wrapper-form input:radio").each(function() {
      var attr = $(this).data("verniy");
      if (typeof attr !== typeof undefined && attr !== false) {
        $(this)
          .parent()
          .addClass("goog_g");
      } else {
      }
    });
    $(".clock_test").addClass("check_this");
  } else {
    alert('Вы уже выбрали город, нажмите кнопку "Продолжить".');
  }
}
