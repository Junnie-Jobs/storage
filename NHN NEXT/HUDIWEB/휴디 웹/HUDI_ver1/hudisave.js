var GAME = (function() {

	var baseURL = "http://localhost:8080";
	var myUserId = $('input[name="myUserId"]').val();

	var user1 = {
			
			id : $('input[name="userId1"]').val(),
			putCard : 0,
			cards: shuffle_random_card(),
			ruby: 5
		};
	
	var user2 = {
			
			id : $('input[name="userId2"]').val(),
			putCard : 0,
			cards: shuffle_random_card(),
			ruby: 5
		};

	var cliked_left_user_card_Idx;
	var cliked_right_user_card_Idx;	
	
	var ajaxApi = { //user1,2에게 각각 어떻게 보내야 할 것인가?? 
			putCard: function(e) { 
				// user가 카드를 낸 경우의 ajax를 다룬다.
				console.debug("user put card event start");
				//보내야할 데이타는 user1이 클릭한 카드와, user2가 클릭한 카드.
				var data = {};
				
				//유저의 남은 카드 수를 저장해 줄 변수(1장씩 낼때마다 카드 갯수는 줄어들기 때문에)
				var user_cards_status = changeUserStatus();

				data.userId1 = user1.id;
				data.userId2 = user2.id;
				data.user1Card = user1.cards;
				data.user2Card = user2.cards;
				data.userStatus = userStatus;
				console.debug(data);
				
				$.ajax({
					"url" : (baseURL + "/api/gameMain/user/putcard"),
					"type" : POST,
					"data" : data
				}).done(function() {
					console.debug("click event done()");
					changeUserReady($eTarget, getUserStatus(room, userId));
				})
			},
			checkCardStatus: function() {
				console.debug("checking Cards");
				var data = {};
				
				data.user1PutCard = user1.putCard;
				data.user2PutCard = user1.putCard;
				
				$.ajax({
					"url" : (baseURL + "/api/gameMain/match/check"),
					"type" : "GET",
					"data" : data
				}).done(function(data) {
					
					if(user1.putCard == 1 && user2.purCard == 1){
						
						console.log("The 2 users put cards for match");
						
					}

					
					console.debug("check event done()");
					changeUserReady($user1Button, getUserStatus(room, user1Id));
					changeUserReady($user2Button, getUserStatus(room, user2Id));
					updateStartButton(room);
				})
			},
		}
		
		function updateStartButton(room) {
			if (room.canStart === true) {
				$(".start_button").css('display','block');
			}
			if (room.canStart === false) {
				$(".start_button").css('display','none');
			}
		}
		
		function changeUserStatus($eTarget) {
			if ($eTarget.hasClass('clicked')) {
				return "notReady";
			}
			return "ready";
		}

	
	function revealedCard(e){
				
		var left_user_num = user1.cards[cliked_left_user_card_Idx];
		var right_user_num = user2.cards[cliked_left_user_card_Idx];

		var $matching_left_user = $(".match_left_User_card");
		var $matching_right_user = $(".match_right_User_card");
		
		if(!$matching_left_user.hasClass('put_card') || !$matching_right_user.hasClass('put_card')){
			alert("두 분이 모두 카드를 내야 결과를 확인할 수 있습니다.");
			return;
		}
				
		$matching_left_user.css('background-color', 'white').text(left_user_num);
		$matching_right_user.css('background-color', 'white').text(right_user_num);
		
		
		if(left_user_num > right_user_num ){
			alert(user1.id + "님이 승리하셨습니다.");
			after_match($matching_left_user, $matching_right_user);
			user1.ruby += 1;
			user2.ruby -= 1;

		}else if(left_user_num < right_user_num){
			
			alert(user2.id + "님이 승리하셨습니다.");
			after_match($matching_left_user, $matching_right_user);
			user2.ruby += 1;
			user1.ruby -= 1;
			
		}else{
			alert("이번판은 무승부입니다.");
			after_match($matching_left_user, $matching_right_user);
		}	
	}

	function after_match($matching_left_user, $matching_right_user){
		$matching_left_user.css({
				'display' : 'none',
				'background-color' : '#BD8B84'
				}).removeClass('put_card').text("");

		$matching_right_user.css({
				'display' : 'none',
				'background-color' : '#A6B181'
				}).removeClass('put_card').text("");
		
		user1.putCard = 0;
		user2.putCard = 0;
		
		
	}	
	
	function remove_left(e) {
		
		if(myUserId !== user1.id){
			alert(myUserId + "님, 당신의 카드만 낼 수 있습니다.");
			return;
		}
		
		user1.putCard = 1;

		cliked_left_user_card_Idx = $(e.target).val();
		var left_user_card= $(".match_left_User_card");
		
		if (!left_user_card.hasClass('put_card')) {
			$(e.target).remove();
			left_user_card.css('display', 'block');
			left_user_card.addClass('put_card');
		} else
			alert("낙장불입!");		
	}

	function remove_right(e) {
		
		if(myUserId !== user2.id){
			alert(myUserId + "님, 당신의 카드만 낼 수 있습니다.");
			return;
		}

		user2.putCard = 1;
		
		var right_user_card = $(".match_right_User_card");
		cliked_right_user_card_Idx = $(e.target).val();	
		
		if (!right_user_card.hasClass('put_card')) {
			$(e.target).remove();
			right_user_card.css('display', 'block');
			right_user_card.addClass('put_card');
		} else
			alert("낙장불입!");
	}
	
	/* 배열에 랜덤값 얻기 1~10까지의 랜덤 값 넣기 */
	function shuffle_random_card() {

		// 결과 담을 배열
		var cardArray = [];
		var temp; // 난수 임시로 담을 변수
		var CheckFlag = 0; // 중복체크 Flag (0,1)

		for (var i = 0; i < 10; i++) {
			temp = Math.floor(Math.random() * 10) + 1; // 난수 생성 (+1 은 0 제외)
			for (var j = 0; j < i; j++) { // 기존 배열 값들 0 부터 i 번째(현재) 전까지
				if (cardArray[j] == temp) { // 중복체크 _ 같은것이 있다면,
					i = i - 1; // 현재 배열위치 i 에서 한칸 앞 위치를 가져간다. *( i++ 가 되니 미리
					// i-1해준다.) 결국은 i값이 증가되지 않는것.
					CheckFlag = 1; // 배열에 값을 넣지 않기 위해 중복체크 플래그 값 설정해주고
				}
			}

			if (CheckFlag == 0) { // 중복된 값이 아니면 난수를 배열 i 번째 넣어주고.
				cardArray[i] = temp;
			} else {
				CheckFlag = 0; // 중복된 값이면 i -1 번째 그대로 간다.
			}
		}

		return cardArray;
	}

	return {
		"init" : init
	}
	

	function init() {
		
		$(".right_user_card").on("dblclick", remove_right);
		$(".left_user_card").on("dblclick", remove_left);
		$(".right_user_card").on("dblclick", ajaxApi.putCard);
		$(".left_user_card").on("dblclick", ajaxApi.putCard);
		$(".matchi_button").on("click", revealedCard);
		window.setInterval(function(){ajaxApi.checkCardStatus();},1000);
		

	}

	
})();

$(document).ready(function() {
	GAME.init();
});
