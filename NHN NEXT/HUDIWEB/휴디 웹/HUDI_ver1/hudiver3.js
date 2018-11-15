var GAME = (function(){
	
	var baseURL = "http://localhost:8080";
	var currentUserId = $('input[name="myUserId"]').val();
	var User = {id, chips, put_card_status, cards}


//유저 두명에 대한 값 초기화 
	var user1 = {
			
			id : $('input[name="userId1"]').val(),
			putCard : -1,
			cards: shuffle_random_card(),
			ruby: 5
		};
	
	var user2 = {
			
			id : $('input[name="userId2"]').val(),
			putCard : -1,
			cards: shuffle_random_card(),
			ruby: 5
		};

	return {
	"init" : init
	}
	

	function init() {
		
		$(".right_user_card").on("dblclick", remove_right);
		$(".left_user_card").on("dblclick", remove_left);
		// $(".right_user_card").on("dblclick", ajaxApi.putCard);
		// $(".left_user_card").on("dblclick", ajaxApi.putCard);
		$(".matchi_button").on("click", revealedCard);
		window.setInterval(function(){ajaxApi.checkCardStatus();},1000);
		

	}
	
//랜덤의 숫자를 담아주는 카드배열함
function shuffle_random_card(){}

})();

$(document).ready(function() {
	GAME.init();
});