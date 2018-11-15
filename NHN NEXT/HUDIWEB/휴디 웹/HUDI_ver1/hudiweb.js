var GAME = (function() {

	var baseURL = "http://localhost:8080";
	var myUserId = $('input[name="myUserId"]').val();
	var roomId = $('input[name="roomId"]').val();

	var user1 = {
			
			id : $('input[name="userId1"]').val(),
			cards: shuffle_random_card(),
			putCard: -1,
			ruby: 5
		};
	
	var user2 = {
			
			id : $('input[name="userId2"]').val(),
			cards: shuffle_random_card(),
			putCard: -1,
			ruby: 5
		};

	var cliked_left_user_card_Idx;
	var cliked_right_user_card_Idx;	
	
	var ajaxApi = { //user1,2에게 각각 어떻게 보내야 할 것인가?? 
			
			userInfo : function(e) {
				
				var data = {};
				data.leftUser = user1.id;
				data.rightUser = user2.id;
		
				$.ajax({
					url : (baseURL + "/api/room/start/users"),
					type : "POST",
					data : data
				}).done(function() {
					console.debug("userInfo pass success");
					console.log(data);
				}).fail(function(){
					console.log("userInfo pass fail...");
				})
			},
			
			putCard: function(e) { 
																
				// user가 카드를 낸 경우의 ajax를 다룬다.
				console.debug("user put card event start");
				var cardIdx = $(e.target).val(); //e.target의 val은 유저카드 리스트의 인덱스를 의미한다.
				//보내야할 데이타는 user1이 클릭한 카드와, user2가 클릭한 카드.
				var data = {};
											
				data.userId = myUserId; //카드를 낸 유저의 아이디
				data.user1PutCard = user1.cards[cardIdx];
				data.user2PutCard = user2.cards[cardIdx];
				
				if(myUserId == user1.id){					
					user1.putCard = cardIdx;
					data.user1PutCard = user1.putCard;
					user1.cards.splice(cardIdx,1); // 사용자가 선택한 카드는 배열에서 삭제한다.
				
				}else{
					user2.putCard = cardIdx;
					data.user2PutCard = user2.putCard;
					user2.cards.splice(cardIdx,1); // 사용자가 선택한 카드는 배열에서 삭제한다.

				}
	
				console.debug(data);
				
				$.ajax({
					url : (baseURL + "/api/room/start/card"),
					type : "POST",
					data : data
				}).done(function() {
					console.debug(myUserId + " putCard 이벤트가 성공하였습니다.");
				}).fail(function(){
					console.log("putCard error");
				})
			},
			
			checkCardStatus: function() {
				console.debug("checking Cards");
								
				$.ajax({
					url : (baseURL + "/api/room/game/cardCheck"),
					type : "GET",
				}).done(function(data) {
					
					var right_user_card = $(".match_right_User_card");
					var left_user_card= $(".match_left_User_card");		
						 
				    if(data == 3){ // 둘 다 카드를 낸 경우 
						
						left_user_card.css('display', 'block');
						left_user_card.addClass('put_card');
						right_user_card.css('display', 'block');
						right_user_card.addClass('put_card');
						
					}else{
						console.log(data);
					}

				}).fail(function(){
					console.log("checkCardStatus error");
				})						
			},
		}
			
	function revealedCard(e){
		
		var $matching_left_user = $(".match_left_User_card");
		var $matching_right_user = $(".match_right_User_card");
		
		if(!$matching_left_user.hasClass('put_card') || !$matching_right_user.hasClass('put_card')){
			alert("두 분이 모두 카드를 내야 결과를 확인할 수 있습니다.");
			return;
		}
		
		if(myUserId == user1.id){
			var left_user_num = user1.cards[cliked_left_user_card_Idx];
			var data = {};
			data.userId = myUserId;
			data.idx = cliked_left_user_card_Idx;
			console.log(data.idx);
			
		}else if(myUserId == user2.id){
			var right_user_num = user2.cards[cliked_right_user_card_Idx];
			var data = {};
			data.userId = myUserId;
			data.idx = cliked_left_user_card_Idx;
			console.log(data.idx);
			
		}else return;
		
		//index를 서버에 저장해주는 ajax 
		$.ajax({
			url : (baseURL + "/api/room/game/cardIdx"),
			type : "POST",
			data : data
		}).done(function(data){
			console.log(data);
		}).fail(function(data){
			console.log("Idx ajax fail");
		});
		
		//두 명의 유저가 모두 클릭해서 index가 서버에 저장되면 그걸 이용해 결과 비교 
		$.ajax({
			url : (baseURL + "/api/room/game/cardIdxCheck"),
			type : "GET",
		}).done(function(data){
			
			if(data != 1) return;
			
			var matchingNum = {};
			matchingNum.leftNum = left_user_num;
			matchingNum.rightNum = right_user_num;
			
			console.log("data leftNum : " + matchingNum.leftNum);
			console.log("data rightNum : " + matchingNum.rightNum);
			
			$.ajax({
				url : (baseURL + "/api/room/game/gmaeResult"),
				type : "POST",
				data : matchingNum
			}).done(function(result) {
				
				$matching_left_user.css('background-color', 'white').text(left_user_num);
				$matching_right_user.css('background-color', 'white').text(right_user_num);
				
				if(result == 1){
					alert(user1.id + "님이 승리하셨습니다.");
					after_match($matching_left_user, $matching_right_user);
					user1.ruby += 1;
					user2.ruby -= 1;

				}else if(result == 2){
					
					alert(user2.id + "님이 승리하셨습니다.");
					after_match($matching_left_user, $matching_right_user);
					user2.ruby += 1;
					user1.ruby -= 1;
					
				}else{
					alert("이번판은 무승부입니다.");
					after_match($matching_left_user, $matching_right_user);
				}	
				
			}).fail(function(data){
				console.log("match error");
			})	
			
					
			data = {value : -2}; //카드를 낸 것에 대한 Flag 처리 
			
			$.ajax({
				
				url : (baseURL + "/api/room/game/cardCheckInit"),
				type : "POST",
				data : data
				
			}).done(function(data){
				console.log(data);
			}).fail(function(){
				console.log("error");
			});
			
			
		}).fail(function(){
			console.log("fail...");
		});	
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
			
	}	
	
	function remove_left(e) {
		
		if(myUserId !== user1.id){
			alert(myUserId + "님, 당신의 카드만 낼 수 있습니다.");
			return;
		}
			
		var left_user_card= $(".match_left_User_card");
		cliked_left_user_card_Idx = $(e.target).val();
		
//		var data = {};
//		
//		data.userId = data.userId = myUserId;
//		data.idx = cliked_left_user_card_Idx;
		
//		$.ajax({			
//			url : (baseURL + "/api/room/game/cardIdx"),
//			type : "POST",
//			data : data
//		}).done(function(data){
//			console.log(data);
//		}).fail(function(){
//			console.log("error");
//		});
		
		if (!left_user_card.hasClass('put_card')) {
			$(e.target).remove();
			left_user_card.css('display', 'block');
			left_user_card.addClass('put_card');
		} else{
			alert("낙장불입!");
			return;
		}
	}

	function remove_right(e) {
				
		if(myUserId !== user2.id){
			alert(myUserId + "님, 당신의 카드만 낼 수 있습니다.");
			return;
		}
		
		var right_user_card = $(".match_right_User_card");
		cliked_right_user_card_Idx = $(e.target).val();	
		
		if (!right_user_card.hasClass('put_card')) {
			$(e.target).remove();
			right_user_card.css('display', 'block');
			right_user_card.addClass('put_card');
		} else{
			alert("낙장불입!");
			return;
		}
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
		
		ajaxApi.userInfo();
		$(".right_user_card").on("dblclick", remove_right);
		$(".left_user_card").on("dblclick", remove_left);
		$(".right_user_card").on("dblclick", ajaxApi.putCard);
		$(".left_user_card").on("dblclick", ajaxApi.putCard);
		$(".matchi_button").on("click", revealedCard);
		window.setInterval(function(){ajaxApi.checkCardStatus();},2000);
	}	
})();

$(document).ready(function() {
	GAME.init();
});
