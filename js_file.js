function generateWinningNumber(){
	return Math.floor(Math.random() * 100) + 1;
}

function shuffle(arr){
	var len = arr.length, i, temp;

	while(len){
		i = Math.floor(Math.random() * len--)
		temp = arr[len];
		arr[len] = arr[i];
		arr[i] = temp;
		
	}
	return arr;	
}

function Game(){
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
	return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
	return this.playersGuess < this.winningNumber;
}

Game.prototype.provideHint = function(){
	var hint = [];
	hint.push(this.winningNumber);
	hint.push(generateWinningNumber());
	hint.push(generateWinningNumber());
	hint = shuffle(hint);
	return "The winning number is " + hint[0] + ", " + hint[1] + ", or " + hint[2];
}


var madeGuess = function(game, attempts){
		
		game.playersGuess = +$(this).text();

		if ($(this).closest(".row-fluid").find("#colors").length === 1){
			$(this).closest(".row-fluid").find(".colBox").remove();
		}

		if (game.difference() == 0){
			$("#instruct").text("You Guessed It!");
		}else if(game.difference() < 5) {
			$(this).css({"background-color":"rgb(255,0,0)"});
			$(this).closest(".row-fluid").find("#colors").append("<li class ='colBox' id='hot'>You are almost there - it is hot!</li>");

		}else if(game.difference() >= 5 && game.difference() < 10){
			$(this).css({"background-color": "rgb(255,128,128)"});
			$(this).closest(".row-fluid").find("#colors").append("<li class ='colBox' id='warm'>Keep going, it is getting warmer!</li>");

		}else if(game.difference() >= 10 && game.difference() < 20 ){
			$(this).css({"background-color": "rgb(255,128,0)"});
			$(this).closest(".row-fluid").find("#colors").append("<li class ='colBox' id='lukeWarm'>This is the right direction - it is lukewarm!</li>");

		}else if(game.difference() >= 20 && game.difference() < 40){
			$(this).css({"background-color": "rgb(255,255,0)"});
			$(this).closest(".row-fluid").find("#colors").append("<li class ='colBox' id='middle'>You are getting closer!</li>");

		}else if(game.difference() >= 40 && game.difference() < 70){
			$(this).css({"background-color": "rgb(77,255,255)"});
			$(this).closest(".row-fluid").find("#colors").append("<li class ='colBox' id='cool'>It is getting cooler, change direction!</li>");

		}else if(game.difference() >= 70 && game.difference() < 90){
			$(this).css({"background-color": "rgb(77,166,255)"});
			$(this).closest(".row-fluid").find("#colors").append("<li class ='colBox' id='chilly'>This is wrong direction - getting chilly!</li>");

		}else if(game.difference() >= 90){
			$(this).css({"background-color": "rgb(77,77,255)"});
			$(this).closest(".row-fluid").find("#colors").append("<li class ='colBox' id='frozen'>Far from it - you are frozen!</li>");

		}

		if (attempts > 1 && game.difference() !== 0){
			$("#attempt").remove();
			var num = 1;
			var att = $("#attempts #attempt");

			att.each(function(ind,item){
				$(item).text(num);
				num++;
			})	

			if (game.isLower()){
				$("#instruct").text("Go Higher!");
			}else{
				$("#instruct").text("Go Lower!");
			}
			
		}else if(game.difference() !== 0){
			$("#instruct").text("Game Over! The number was " + game.winningNumber + ".");
			$("#attempt").text(0);
			$("#hint").attr("disabled", true);
			$("#reset").attr("disabled", false);
		}else{
			$("#reset").attr("disabled", false);
			$("#hint").attr("disabled", true);
		}

}


$(document).ready(function(){

	var attempts = 5;
	var game = new Game();
	$("#reset").attr("disabled", true);

	var createBoxes = function(){
		var row = col = 10;
		var boxNum = 1;

		for (var i = 1; i <= row; i++){
			for (var j = 1; j <= col; j++){

				$("#frame").append("<div class='boxNum'>" + boxNum + "</div>");
				boxNum++
			}
			$("body").append("<br>");
		}

	}
	
	var createAttempts = function(){
		for (var i = 1; i < 6; i++){
	   		$("#attempts").append("<div id = 'attempt'>" + i + "</div>");
		}
	}

	createBoxes();
	createAttempts();

	$(".boxNum").on("click", function(){
		if (attempts > 0){
			madeGuess.call(this,game,attempts);
			--attempts;
		}
	})

	$("#reset").on("click", function(){
		game = new Game();
		$("#instruct").text("Guess a number!");
		$("#hint").attr("disabled", false);
		
		$(this).closest(".row-fluid").find(".colBox").remove();

		var box = $("#frame .boxNum");

		box.each(function(ind, item){
			$(item).css('background-color', 'beige');
		})
		box.each(function(ind, item){
			$(item).addClass('boxNum');
			
		})
		if (attempts === 0){
			$("#attempt").remove();
			createAttempts();
		}else{
			var att = $("#attempts #attempt");
			att.each(function(index, item){
				$(item).remove();
			})
			createAttempts();
		}
		attempts = 5;
		$("#reset").attr("disabled", true);
		
	});

	$("#hint").on("click", function(){
		$("#instruct").text(game.provideHint());
	});

})

