var TheBoard = new BoardJS("TheShow")

// Selecting An Example
function SelectMe(who,what){
for(var x=0;x<who.parentNode.childNodes.length;x++){who.parentNode.childNodes[x].className = "Item"}
who.className = "Item Selected"
what()
}


// Examples
function ExHome(){
	TheBoard.reset()
	.delay(500)
	.addText("Hello, welcome to", 0, 100, "title center", "fade", 1000, "linear", "TheTitle",false)
	.delay(800)
	.addImage("files/logo.png", 270, 157, 160, "", "fade zoom", 500, "backOut", "",true)
	.addText("The easy and powerful way to make presentations, stories and ads.", 0, 220, "description center", "fade", 1000, "linear", "TheTitle",true)
	.addImage("content/home/arrow.png", 625,350, "", "", "fromleft fade", 1500, "bounce", "Arrow",true)
	.flash("Arrow","always",500)
	.showTooltip("Arrow","These examples are just to<br/> reveal the features and possibilities of the library.",10000)
	.go()
}

function ExBubbles() {
	TheBoard.reset()
	.background("rgb(78,122,219)", 500)
	for (var x = 0; x < 100; x++) {
		var W = (Math.random() * 150) + 50
		TheBoard.addImage("content/bubbles/bubble.png", (Math.random() * 700),  - (W + 50), W, "", "frombottom fade", 5000 + (Math.random() * 8000), "linear", "IMG" + x)
		.delay(1500)
	}
	TheBoard.go()
}

var CreditsExample = new Array(
		"Language Design & Concept" + "#" + "Andi Gutmans, Rasmus Lerdorf,<br/> Zeev Suraski, Marcus Boerger",
		"Zend Scripting Language Engine" + "#" + "Andi Gutmans, Zeev Suraski,<br/> Stanislav Malyshev, Marcus Boerger,<br/> Dmitry Stogov",
		"Extension Module API" + "#" + "Andi Gutmans, Zeev Suraski, Andrei Zmievski",
		"UNIX Build and Modularization" + "#" + "Stig Bakken, Sascha Schumann, Jani Taskinen",
		"Windows Port" + "#" + "Shane Caraveo, Zeev Suraski,<br/> Wez Furlong, Pierre-Alain Joye",
		"Server API (SAPI) Abstraction Layer" + "#" + "Andi Gutmans, Shane Caraveo, Zeev Suraski",
		"Streams Abstraction Layer" + "#" + "Wez Furlong, Sara Golemon",
		"PHP Data Objects Layer" + "#" + "Wez Furlong, Marcus Boerger, Sterling Hughes,<br/> George Schlossnagle, Ilia Alshanetsky",
		"Output Handler" + "#" + "Zeev Suraski, Thies C. Arntzen,<br/> Marcus Boerger, Michael Wallner")
function ExCredits() {
	TheBoard.reset()
	.background("#000", 50)
	.addText("PHP Credits", 0, 100, "title center", "fade", 1000, "linear", "TheTitle")
	.addText("php.net/credits.php", 0, 150, "description center", "fade", 1000, "linear", "SubTitle", true)
	.delay(2500)
	.remove("TheTitle SubTitle")
	for (var x = 0; x < CreditsExample.length; x++) {
		TheBoard.addText(CreditsExample[x].split("#")[0], 0, 500, "description", "appear", 1, "linear", "x" + x)
		.addText(CreditsExample[x].split("#")[1], 0, 500, "description", "apear", 1, "linear", "y" + x)
		.setStyle("x" + x, "left:auto;right:380px;font-size:14px;color:#aaa")
		.setStyle("y" + x, "left:330px;font-weight:bold")
		.moveTo("x" + x, "", 400, 300, "easeOut")
		.moveTo("y" + x, "", 400, 300, "easeOut", true)
		.moveTo("x" + x, "", -100, 20000, "linear")
		.moveTo("y" + x, "", -100, 20000, "linear")
		.delay(2600)
	}
	TheBoard.go()
}
function ExHover() {
	TheBoard.reset()
	.background("rgb(34,177,76)", 500)
	.addText("Text 1", 50, 20, "title", "zoom", 200, "linear", "x1")
	.circle("x1", "background-color:rgb(29,150,65);padding:40px;cursor:pointer;border:3px solid rgb(24,131,56)").delay(100)
	.addText("Text 2", 258, 20, "title", "zoom", 200, "linear", "x2")
	.circle("x2", "background-color:rgb(29,150,65);padding:40px;cursor:pointer;border:3px solid rgb(24,131,56)").delay(100)
	.addText("Text 3", 466, 20, "title", "zoom", 200, "linear", "x3")
	.circle("x3", "background-color:rgb(29,150,65);padding:40px;cursor:pointer;border:3px solid rgb(24,131,56)").delay(100)
	.addText("Text 4", 50, 238, "title", "zoom", 200, "linear", "x4")
	.circle("x4", "background-color:rgb(29,150,65);padding:40px;cursor:pointer;border:3px solid rgb(24,131,56)").delay(100)
	.addText("Text 5", 258, 238, "title", "zoom", 200, "linear", "x5")
	.circle("x5", "background-color:rgb(29,150,65);padding:40px;cursor:pointer;border:3px solid rgb(24,131,56)").delay(100)
	.addText("Text 6", 466, 238, "title", "zoom", 200, "linear", "x6")
	.circle("x6", "background-color:rgb(29,150,65);padding:40px;cursor:pointer;border:3px solid rgb(24,131,56)").delay(100)
	.delay(200)
	.hover("x1 x2 x3 x4 x5 x6", "border:5px solid rgb(24,131,56);scale:1.2;rotate:360", 300, "linear")
	.addTooltip("x5", "Tooltip & Hover<br/>work together without any conflict")
	.addTooltip("x4", "UnHovered<br/>The tooltip was not affected")
	.unHover("x4")
	.go()
}
var CurrentIndexForExample4 = 0,
TheImages = new Array(
		"content/gallery/image1.jpg#Country Road",
		"content/gallery/image2.jpg#The Humber Bridge",
		"content/gallery/image3.jpg#Wind Farm",
		"content/gallery/image4.jpg#Copse of Trees",
		"content/gallery/image5.jpg#Green field Blue sky")
function ExGallery() {
	CurrentIndexForExample4 = 0
		TheBoard.reset()
		// Initial Image
		.background(TheImages[0].split("#")[0], 500)
		.addText(TheImages[0].split("#")[1], 0, 20, "title", "fromtop fade", 1000, "backOut", "TheName")
		.setStyle("TheName", "width:700px;text-shadow:0px 1px 1px #000")
		// Loading images into cache
		.addImage(TheImages[1].split("#")[0], 0, 0, 1, 1, "appear", 1, "linear", "x2")
		.addImage(TheImages[2].split("#")[0], 0, 0, 1, 1, "appear", 1, "linear", "x3")
		.addImage(TheImages[3].split("#")[0], 0, 0, 1, 1, "appear", 1, "linear", "x4")
		.addImage(TheImages[4].split("#")[0], 0, 0, 1, 1, "appear", 1, "linear", "x5")
		.remove("x2 x3 x4 x5")
		
		// Next
		.addImage("content/gallery/next.png", 360, 410, "", "", "fade", 500, "linear", "nxt")
		.setStyle("nxt", "cursor:pointer")
		.addEvent("nxt", "click", function () {
			CurrentIndexForExample4++
			TheBoard.setStyle("prv", "display:block")
			.remove("TheName")
			.addText(TheImages[CurrentIndexForExample4].split("#")[1], 0, 20, "title", "fromtop fade", 1000, "backOut", "TheName")
			.setStyle("TheName", "width:700px;text-shadow:0px 1px 1px #000")
			.background(TheImages[CurrentIndexForExample4].split("#")[0], 500)
			if (CurrentIndexForExample4 == 4) {
				TheBoard.setStyle("nxt", "display:none")
			}
		})
		
		// Previous
		.addImage("content/gallery/prev.png", 330, 410, "", "", "fade", 500, "linear", "prv")
		.setStyle("prv", "cursor:pointer;display:none")
		.addEvent("prv", "click", function () {
			CurrentIndexForExample4--
			TheBoard.setStyle("nxt", "display:block")
			.remove("TheName")
			.addText(TheImages[CurrentIndexForExample4].split("#")[1], 0, 20, "title", "fromtop fade", 1000, "backOut", "TheName")
			.setStyle("TheName", "width:700px;text-shadow:0px 1px 1px #000")
			.background(TheImages[CurrentIndexForExample4].split("#")[0], 500)
			if (CurrentIndexForExample4 == 0) {
				TheBoard.setStyle("prv", "display:none")
			}
		})
		.hover("nxt prv", "scale:1.2", 300, "linear")
		.addText("Photos from http://www.flickr.com/photos/freefoto", 4, 430, "description", "split", 1000, "linear", "about")
		.setStyle("about", "font-size:13px;text-shadow:1px 1px 1px #000")
		.go()
}

function ExWheel() {
	function RotateMe() {
		var IDX = parseInt(this.id.replace("Item", ""))
			TheBoard.rotate("TheWheel",  - (45 * (IDX - 1)), 1000, "linear")
			.html("TheInfo", "Item<br/>" + (IDX + 1))
	}
	TheBoard.reset()
	.addImage("content/wheel/wheel.png", 5, 5, "", "", "appear", 1, "linear", "TheWheel")
	.addText("", 460, 30, "title", "split", 1000, "linear", "TheInfo")
	.setStyle("TheInfo", "padding:10px;border:2px solid rgb(92,71,118);width:200px;height:80px;background:rgb(128,100,162)")
	.round("TheInfo", 20)
	var beta = 2 * Math.PI / 8
		for (var x = 0; x < 8; x++) {
			var alpha = (beta * x - Math.PI / 2) + 0.4,
			cos = Math.cos(alpha),
			sin = Math.sin(alpha)
				TheBoard.addImage("content/wheel/img" + x + ".png", 202 + (160 * cos), 202 + (160 * sin), "", "", "fade", 100, "linear", "Item" + x)
				.rotate("Item" + x, 15, 0)
				.delay(50)
				//.merge("Item" + x, "TheWheel")
				.setStyle("Item" + x, "cursor:pointer")
				.addEvent("Item" + x, "click", RotateMe)
				.hover("Item" + x, "scale:1.3",800,"elastic")
				.delay(50)
		}
		TheBoard.merge("Item0 Item1 Item2 Item3 Item4 Item5 Item6 Item7","TheWheel")
		.showTooltip("Item3", "Click here")
		.go()
}

function ExEasing(){
	TheBoard.reset()
	.addText("linear", 48,350,"Button","fade",100,"linear","b1")
	.addText("easeIn", 135,350,"Button","fade",100,"linear","b2")
	.addText("easeOut", 222,350,"Button","fade",100,"linear","b3")
	.addText("backIn", 314,350,"Button","fade",100,"linear","b4")
	.addText("backOut", 401,350,"Button","fade",100,"linear","b5")
	.addText("elastic", 492,350,"Button","fade",100,"linear","b6")
	.addText("bounce", 580,350,"Button","fade",100,"linear","b7")
	.addImage("content/easing/ball.png", 68, 310, "", "", "appear", 1, "linear", "ball_1")
	.addImage("content/easing/ball.png", 155, 310, "", "", "appear", 1, "linear", "ball_2")
	.addImage("content/easing/ball.png", 244, 310, "", "", "appear", 1, "linear", "ball_3")
	.addImage("content/easing/ball.png", 333, 310, "", "", "appear", 1, "linear", "ball_4")
	.addImage("content/easing/ball.png", 422, 310, "", "", "appear", 1, "linear", "ball_5")
	.addImage("content/easing/ball.png", 511, 310, "", "", "appear", 1, "linear", "ball_6")
	.addImage("content/easing/ball.png", 600, 310, "", "", "appear", 1, "linear", "ball_7")
	.addEvent("b1 b2 b3 b4 b5 b6 b7","click",function(){
		var EASE = ["linear","easeIn","easeOut","backIn","backOut","elastic","bounce"][parseInt(this.id.slice(1))-1]
		TheBoard.moveTo("ball_" + this.id.slice(1),"",50,1000,EASE)
		.fadeOut(this.id)
	})
	.addEvent("ball_1 ball_2 ball_3 ball_4 ball_5 ball_6 ball_7","click",function(){
		var EASE = ["linear","easeIn","easeOut","backIn","backOut","elastic","bounce"][parseInt(this.id.slice(5))-1]
		TheBoard.moveTo(this.id,"",310,1000,EASE)
		.fadeIn("b"+this.id.slice(5))
	})
	.addText("Click on the buttons to animate, then click on the balls to take them back.", 0,410,"description center","fade",100,"linear","b1")
	.go()
}

function ExDialog(){
	TheBoard.reset()
	.addText("Content from <a style='color:#fff;text-decoration:underline' target='_blank' href='http://www.focusenglish.com/dialogues/friendship/dropmealine.html'>http://www.focusenglish.com/dialogues/friendship/dropmealine.html</a>", 0, 420, "description center", "fade", 1000, "linear")
	.addText("Don't forget to drop me a line!", 0, 10, "title center", "fade", 1000, "linear", "TheTitle",true)
	.addText("Ryan finds a new job in New York and is about to move there.<br/>He doesn't want his friendship with Adriana to drift apart. <br/>He wants to keep in touch.", 50, 100, "description", "fade", 1000, "linear", "PLOT")
	.setStyle("PLOT","font-size:23px;text-align:center;line-height:35px;")
	.delay(8000)
	.remove("PLOT")
	.addImage("content/dialog/adriana.png", 68, 150, "", "", "fromleft", 500, "linear", "woman",true)
	.addImage("content/dialog/ryan.png", 385, 150, "", "", "fromright", 500, "linear", "man",true)

	.showTooltip("woman","I heard you're moving to New York.","always")
	.playSound("content/dialog/dropmealineadriana1.mp3",true)
	.removeTooltip("woman")

	.showTooltip("man","Yes.  I've got an offer in upstate New York.","always")
	.playSound("content/dialog/dropmealineryan1.mp3",true)
	.removeTooltip("man")

	.showTooltip("woman","Oh, that's great!  But I'm going to miss you.","always")
	.playSound("content/dialog/dropmealineadriana2.mp3",true)
	.removeTooltip("woman")

	.showTooltip("man","Me, too.  Let's keep in touch.","always")
	.playSound("content/dialog/dropmealineryan2.mp3",true)
	.removeTooltip("man")

	.showTooltip("woman","Yeah.<br/>Don't forget to drop me a line when you settle down.","always")
	.playSound("content/dialog/dropmealineadriana3.mp3",true)
	.removeTooltip("woman")

	.showTooltip("man","Trust me.  I won't. I'll keep you posted.","always")
	.playSound("content/dialog/dropmealineryan3.mp3",true)
	.removeTooltip("man")

	.showTooltip("woman","You have my address?","always")
	.playSound("content/dialog/dropmealineadriana4.mp3",true)
	.removeTooltip("woman")

	.showTooltip("man","Well, I have your e-mail address.","always")
	.playSound("content/dialog/dropmealineryan4.mp3",true)
	.removeTooltip("man")

	.showTooltip("woman","All right!  I look forward to hearing from you soon.<br/>Good luck!","always")
	.playSound("content/dialog/dropmealineadriana5.mp3",true)
	.removeTooltip("woman")

	.go()
}


ExHome()


/*!
	
	Make your own example

	function MyExample(){
		TheBoard.reset()

		// Write your commands here

		TheBoard.go()
	}
	
*/