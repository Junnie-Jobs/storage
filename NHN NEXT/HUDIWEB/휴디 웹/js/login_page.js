$(function() {

	$("#login").on("click", function() {

		$('.login-box').fadeIn(1000).css('display', 'block');

	});

	$("#signUp").on("click", function() {

		$('.sign-up-box').fadeIn(1000).css('display', 'block');

	});

	$('#logo').addClass('animated fadeInDown');
	$("input:text:visible:first").focus();
	});
	$('#username').focus(function() {
		$('label[for="username"]').addClass('selected');
	});
	$('#username').blur(function() {
		$('label[for="username"]').removeClass('selected');
	});
	$('#password').focus(function() {
		$('label[for="password"]').addClass('selected');
	});
	$('#password').blur(function() {
		$('label[for="password"]').removeClass('selected');
});