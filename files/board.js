/*!
	* BoardJS JavaScript Library
	* http://board.porizm.com
	*
	* Copyright (c) 2013 Dr.Ferrous
	* Licensed under the MIT license.
	* http://board.porizm.com/MIT.txt
	*
*/
var BoardJS = new (function(){
	window.__BoardJS_InstanceCounter = window.__BoardJS_InstanceCounter || 0
	return function(HandleDiv){
	window.__BoardJS_InstanceCounter++;
	// Main Variables
	var me = {},SEP = "!-#.#-!"
	me.ID = window.__BoardJS_InstanceCounter
	me.Commands = new Array()
	me.Functions = new Array()
	me.LoadingList = new Array()
	me.CurrentLoaded=0
	me.CurrentStep = -1
	me.Started = false
	me.StopMe = false
	me.OLDIE = navigator.userAgent.toLowerCase()
	me.OLDIE = (me.OLDIE.match(/msie 7/) || me.OLDIE.match(/msie 8/)) != null
	me.DoneFunction = function(){}
	me.Handle = document.getElementById(HandleDiv)
	me.Paused = false
	if(!window["CurrentPath"])window["CurrentPath"]=""
	/********************************************************/
	/*********************** me.Commands ***********************/
	/********************************************************/
	// The following functions store the me.Commands into the timeline to be executed later.
	// Each function checks if the timeline is already running.
	// If the timeline is already running, the command will not be stored in the timeline,
	// it will be executed immediately.
	me.addText = function(InnerText,x,y,ClassName,ShowType,Duration,Easing,ID,Freeze){
		if(!ID){ID="BoardJSObject_"+me.ID+""+me.Commands.length}
		if(!Freeze)Freeze=""
		var CMD = "Text" + SEP + InnerText + SEP + x + SEP + y + SEP + ClassName + SEP + ShowType + SEP + Duration + SEP + Easing + SEP + ID + SEP + Freeze
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.addImage = function(ImageSRC,x,y,w,h,ShowType,Duration,Easing,ID,Freeze){
		if(!ID){ID="BoardJSObject_"+me.ID+""+me.Commands.length}
		ImageSRC = CurrentPath + ImageSRC
		if(!Freeze)Freeze=""
		var CMD = ("Image" + SEP + ImageSRC + SEP + x + SEP + y + SEP + w + SEP + h + SEP + ShowType + SEP + Duration + SEP + Easing + SEP + ID + SEP + Freeze)
		if(me.LoadingList.join(" ").indexOf("image$.$"+ImageSRC)==-1)me.LoadingList.push("image$.$"+ImageSRC)	
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	
	me.background = function(ImageSRC,VisibilityDuration,Freeze){
		ImageSRC = CurrentPath + ImageSRC
		if(!Freeze)Freeze=""
		var CMD = ("Background" + SEP + ImageSRC + SEP + VisibilityDuration + SEP + Freeze)
		if(ImageSRC.match(/rgb\(|rgba\(|^#(?:[0-9a-fA-F]{3}){1,2}$/g)==null){
			if(me.LoadingList.join(" ").indexOf("image$.$"+ImageSRC)==-1)me.LoadingList.push("image$.$"+ImageSRC)	
		}
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	
	me.delay = function(Duration){
		var CMD = ("Delay" + SEP + Duration)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	
	me.circle = function(ID,Style){
		var CMD = ("Circle" + SEP + ID + SEP + Style)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.round = function(ID,TheValue){
		var CMD = ("Round" + SEP + ID + SEP + TheValue)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.flash = function(ID,HowMany,Duration,Freeze){
		if(!Freeze)Freeze=""
		var CMD = ("Flash" + SEP + ID + SEP + HowMany + SEP + Duration + SEP + Freeze)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.html = function(ID,TheContent){
		var CMD = ("HTML" + SEP + ID + SEP + TheContent)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.fadeIn = function(ID,Duration,Freeze){
		if(!Freeze)Freeze=""
		var CMD = ("FadeIn" + SEP + ID + SEP + Duration + SEP + Freeze)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.fadeOut = function(ID,Duration,Freeze){
		if(!Freeze)Freeze=""
		var CMD = ("FadeOut" + SEP + ID + SEP + Duration + SEP + Freeze)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.moveTo = function(obj,x,y,TheDuration,Easing,Freeze){
		if(!Freeze)Freeze=""
		var CMD = ("MoveTo" + SEP + obj + SEP + x + SEP + y + SEP + TheDuration + SEP + Easing + SEP + Freeze)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.remove = function(ID){
		var CMD = "Remove" + SEP + ID
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	
	me.addTooltip = function(ID,TheInner){
		var CMD = ("AddTooltip" + SEP + ID + SEP + TheInner)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.removeTooltip = function(ID){
		var CMD = ("RemoveTooltip" + SEP + ID)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.showTooltip = function(ID,TheInner,LifeTime,Freeze){
		if(!Freeze)Freeze=""
		var CMD = ("ShowTooltip" + SEP + ID + SEP + TheInner + SEP + LifeTime + SEP + Freeze)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.setStyle = function(ID,Style){
		var CMD = ("SetStyle" + SEP + ID + SEP + Style)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.changeImage = function(ID,ImageSRC){
		ImageSRC = CurrentPath + ImageSRC
		var CMD = ("ChangeImage" + SEP + ID + SEP + ImageSRC)
		me.LoadingList.push("image$.$"+ImageSRC)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.addEvent = function(ID,TheEvent,TheFunction){
		Functions.push(TheFunction)
		var CMD = ("AddEvent" + SEP + ID + SEP + TheEvent + SEP + (Functions.length-1))
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.removeEvent = function(ID,TheEvent){
		var CMD = ("RemoveEvent" + SEP + ID + SEP + TheEvent)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.hover = function(ID,Style,Duration,Easing){
		var CMD = ("Hover" + SEP + ID + SEP + Style + SEP + Duration + SEP + Easing)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.unHover = function(ID){
		var CMD = ("UnHover" + SEP + ID)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.merge = function(ID,Target){
		var CMD = ("Merge" + SEP + ID + SEP + Target)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.unMerge = function(ID){
		var CMD = ("UnMerge" + SEP + ID)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.playSound = function(SoundSRC,Freeze){
		SoundSRC = CurrentPath + SoundSRC
		if(!Freeze)Freeze=""
		var CMD = ("PlaySound" + SEP + SoundSRC + SEP + Freeze)
		var DoAdd = true
		for(var x=0;x<me.LoadingList.length;x++){
			if(me.LoadingList[x] == "sound$.$"+SoundSRC)DoAdd=false
		}
		if(DoAdd==true)me.LoadingList.push("sound$.$"+SoundSRC)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.stopSound = function(SoundSRC){
		SoundSRC = CurrentPath + SoundSRC
		var CMD = ("StopSound" + SEP + SoundSRC)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.rotate = function(ID,Angle,Duration,Easing,Freeze){
		if(!Freeze)Freeze=""
		var CMD = ("Rotate" + SEP + ID + SEP + Angle + SEP + Duration + SEP + Easing + SEP + Freeze)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.zoom = function(ID,Scale,Duration,Easing,Freeze){
		if(!Freeze)Freeze=""
		var CMD = ("Zoom" + SEP + ID + SEP + Scale + SEP + Duration + SEP + Easing + SEP + Freeze)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.goTo = function(FrameID){
		var CMD = ("GoTo" + SEP + FrameID)
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.pause = function(){
		var CMD = ("Pause")
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	me.resume = function(){
		var CMD = ("Resume")
		if(me.Started == true){me.Execute(CMD.split(SEP))}else{me.Commands.push(CMD)}
		return me
	}
	
	/*********************************************************/
	/************************ Objects ************************/
	/*********************************************************/
	// The following functions execute the me.Commands directly from the timeline.
	// AddingText and AddingImage are the only objects that can be inserted in this version
	// version two will have plenty of objects.
	me.ShowText = function(InnerText,x,y,ClassName,ShowType,Duration,Easing,ID,Freeze){
		var TheText = document.createElement("div")
		TheText.innerHTML = InnerText
		TheText.className = ClassName + " ImText" 
		me.DisableSelectAndDrag(TheText)
		TheText.id=ID
		me.css(TheText,{"whiteSpace":"nowrap","margin":"0px","opacity":"1","position":"absolute","left":x==""?"0":x+"px","top":y==""?"0":y+"px"})
		me.ShowObjectAnimated(TheText,"",ShowType,Easing,Duration,Freeze != "" ? me.Next : "")
		if(Freeze == "")setTimeout(function(){me.Next()},1)
	}
	me.ShowImage = function(ImageSRC,x,y,w,h,ShowType,Duration,Easing,ID,Freeze){
		var TheImage = document.createElement("div")
		TheImage.id=ID
		TheImage.className="ImImage"
		TheImage.innerHTML = "<img src='"+ImageSRC+"'/>"
		me.DisableSelectAndDrag(TheImage)
		if(w != "")TheImage.children[0].width = w
		if(h != "")TheImage.children[0].height = h
		me.css(TheImage,{"visibility":"hidden","overflow":"hidden","border":"0","margin":"0px","padding":"0","opacity":"1","position":"absolute","left":x==""?"0":x+"px","top":y==""?"0":y+"px"})
		if(ShowType == "")ShowType = "appear"
		if(Easing == "")Easing = "linear"
		me.Handle.appendChild(TheImage)
		me.ShowObjectAnimated(TheImage,ImageSRC,ShowType,Easing,Duration,Freeze != "" ? me.Next : "")
		if(Freeze == "")setTimeout(function(){me.Next()},1)
	}
	/*********************************************************/
	/************************ Actions ************************/
	/*********************************************************/
	me.SetBackground = function(SRC,VisibilityDuration,Freeze){
		if(SRC=="")return
		if(me.get("BoardBackground"+me.ID)==false){
			var TheBack = document.createElement("img")
			TheBack.id = "BoardBackground"+me.ID
			me.css(TheBack,{"position":"absolute","left":"0px","top":"0px","width":"100%","height":"100%","opacity":0})
			if(me.OLDIE==true)TheBack.style.filter = "alpha(opacity=0)"
			me.Prefix(TheBack,"borderRadius","13px")
			me.Handle.appendChild(TheBack)
		}
		var TheBack = me.get("BoardBackground"+me.ID)[0]
		var ShowTheBack = function(){me.animate(TheBack,{opacity:1},VisibilityDuration,"linear",function(){if(Freeze != "")me.Next()})}
		me.animate(TheBack,{opacity:0},VisibilityDuration/3,"linear",function(){
			if(SRC.match(/rgb\(|rgba\(|^#(?:[0-9a-fA-F]{3}){1,2}$/g)){
				TheBack.style.background = SRC
				TheBack.src = "files/empty.png"
				ShowTheBack()
				}else{
				TheBack.onload = ShowTheBack
				TheBack.src=SRC
			}
		})
		if(Freeze == "")me.Next()
	}
	me.FlashIt = function(ID,HowMany,Duration,Freeze){
		var it = me.get(ID)
		if(it==false)me.Next()
		if(Duration == "")Duration = 400
		if((HowMany+"").toLowerCase() != "always")HowMany = parseInt(HowMany)
		var In = function(){
			for(var x=0;x<it.length;x++){
				me.animate(it[x],{"opacity":1},Duration,"linear",function(){
				if(me.StopMe == true || HowMany == 0){if(Freeze!="")me.Next();return}
				Out()
				})
			}
		}
		var Out = function(o){
			if((HowMany+"").toLowerCase() != "always")HowMany--
			for(var x=0;x<it.length;x++){
				me.animate(it[x],{"opacity":0},Duration,"linear",In)
			}
		}
		Out()
		
		if(Freeze=="")me.Next()
	}
	me.FadeIt = function(ID,Duration,Freeze,IsIn){
		var it = me.get(ID)
		if(it==false)me.Next()
		if(Duration == "")Duration=500
		for(var x=0;x<it.length;x++){
			if(IsIn == true)it[x].style.display = "block"
			me.animate(it[x],{"opacity":IsIn? 1 : 0},Duration,"linear",function(who){
				if(IsIn == false)who.style.display = "none"
				if(Freeze!="")me.Next()
			})
		}
		if(Freeze=="")me.Next()
	}
	me.MoveIt = function(ID,xx,yy,TheDuration,Easing,Freeze){
		if(TheDuration == "")TheDuration=1000
		if(Easing == ""){Easing="linear"}
		var it = me.get(ID)
		if(it==false || (xx=="" && yy=="")){me.Next()}
		var AN = {}
		if(xx!="")AN.left = xx + "px"
		if(yy!="")AN.top = yy + "px"
		for(var x=0;x<it.length;x++){
			if(it[x].MyCSS && xx!="")it[x].MyCSS.left = xx
			if(it[x].MyCSS && yy!="")it[x].MyCSS.top = yy
			me.animate(it[x],AN,TheDuration,Easing,x==0 ? function(){if(Freeze!="")me.Next()} : function(){})
		}
		if(Freeze=="")me.Next()
	}
	me.RemoveIt = function(ID){
		var it = me.get(ID)
		if(it==false)me.Next()
		for(var x=0;x<it.length;x++){me.Handle.removeChild(it[x])}
		me.Next()
	}
	me.AddTheTooltip = function(ID,TheInner){
		var it = me.get(ID)
		if(it==false)me.Next()
		for(var x=0;x<it.length;x++){
			it[x].style.cursor = "pointer"
			it[x].onmouseover = function(){me.Tooltip(this.id,TheInner)}
			it[x].onmouseout = function(){me.RemoveTooltip(this.id)}
		}
		me.Next()
	}
	me.RemoveTheTooltip = function(ID){
		var it = me.get(ID)
		if(it==false)me.Next()
		for(var x=0;x<it.length;x++){
			it[x].style.cursor = "default"
			it[x].onmouseover = function(){}
			it[x].onmouseout = function(){}
			if(me.get(it[x].id+"_tooltip")!=false)me.Handle.removeChild(me.get(it[x].id+"_tooltip")[0])
		}
		me.Next()	
	}
	me.ShowTheTooltip = function(ID,TheInner,LifeTime,Freeze){
		var it = me.get(ID)
		if(it==false)me.Next()
		if(LifeTime == "")LifeTime=1000
		if((LifeTime+"").toLowerCase() == "always")LifeTime=null
		for(var x=0;x<it.length;x++){
			me.Tooltip(it[x].id,TheInner,LifeTime,function(){if(Freeze!="")me.Next()})
		}
		if(Freeze == "")me.Next()
	}
	me.ChangeTheStyle = function(ID,Style,WithoutNext){
		var it = me.get(ID)
		if(it==false)me.Next()
		for(var x=0;x<it.length;x++){
			var OldStyle = it[x].getAttribute("style")
			if(typeof(OldStyle === "object")){
				OldStyle = it[x].style.cssText
				it[x].style.cssText = OldStyle + ";" + Style
			}else{it[x].setAttribute("style",OldStyle + ";" + Style)}
		}
		if(WithoutNext == null)me.Next()
	}
	me.ChangeTheImage = function(ID,ImageSRC){
		var it = me.get(ID)
		if(it==false)me.Next()
		for(var x=0;x<it.length;x++){
			me.ShowObjectAnimated(it[x],ImageSRC,"fade","linear",200,"")
		}
		me.Next()
	}
	me.SetTheEvent = function(ID,TheEvent,TheFunction){
		var it = me.get(ID)
		TheEvent = TheEvent.toLowerCase()
		if(it==false)me.Next()
		for(var x=0;x<it.length;x++){
			if(typeof(it[x][TheEvent+"ARR"]) != "object"){
				it[x][TheEvent+"ARR"] = [TheFunction]
				}else{
				it[x][TheEvent+"ARR"].push(TheFunction)
			}
			me.addAnEvent(it[x],TheEvent,Functions[parseFloat(TheFunction)])
		}
		me.Next()
	}
	me.RemoveTheEvent = function(ID,TheEvent){
		var it = me.get(ID)
		if(it==false)me.Next()
		for(var x=0;x<it.length;x++){
			var MyFs = it[x][TheEvent+"ARR"] || []
			for(var y=0;y<MyFs.length;y++){
				me.DeleteEvent(it[x],TheEvent,Functions[MyFs[y]])
			}
		}
		me.Next()
	}
	me.OnHover = function(ID,Style,Duration,Easing){
		var it = me.get(ID)
		if(it==false)me.Next()
		if(Duration == "")Duration = 500
		if(Easing == "")Easing = "linear"
		Style = Style.split(";")
		for(var y=0;y<it.length;y++){
			var AN = {},AN2 = {}
			for(var x=0;x<Style.length;x++){
				AN[Style[x].split(":")[0]] = Style[x].split(":")[1]
				AN2[Style[x].split(":")[0]] =  me.css(it[y],Style[x].split(":")[0])
			}
			// I had to do this like this!
			// because setStyle command affects the hover function
			// using this way, everything will work normally.
			it[y].HoverCSS = AN
			it[y].MyCSS = AN2
			it[y].MyHoverFunctionOver = function(){try{this.MyAN.stop()}catch(err){};this.MyAN = me.animate(this,this.HoverCSS,Duration,Easing,function(){})}
			it[y].MyHoverFunctionOut = function(){try{this.MyAN.stop()}catch(err){};this.MyAN=me.animate(this,this.MyCSS,Duration,Easing,function(){})}
			me.addAnEvent(it[y],"mouseover",function(){this.MyHoverFunctionOver()})
			me.addAnEvent(it[y],"mouseout",function(){this.MyHoverFunctionOut()})
		}
		me.Next()
	}
	me.OnUnHover = function(ID){
		var it = me.get(ID)
		if(it==false)me.Next()
		for(var x=0;x<it.length;x++){
			it[x].MyHoverFunctionOver = function(){}
			it[x].MyHoverFunctionOut = function(){}
		}
		me.Next()
	}
	me.DoMerge = function(ID,Target,DoIt){
		var it = me.get(ID),Target = me.get(Target)
		if(it==false || (Target==false && DoIt==true))me.Next()
		
		for(var x=0;x<it.length;x++){
			var px = DoIt==true ? parseFloat(Target[0].style.left) : parseFloat(it[x].parentNode.style.left)
			var py = DoIt==true ? parseFloat(Target[0].style.top) : parseFloat(it[x].parentNode.style.top)
			var cx = parseFloat(it[x].style.left)
			var cy = parseFloat(it[x].style.top)
			if(DoIt == true){
				Target[0].appendChild(it[x])
				if(cx == px){cx=0}else{cx = cx - px}
				if(cy == py){cy=0}else{cy = cy - py}
				}else{
				me.Handle.appendChild(it[x])
				cx = px + cx
				cy=py + cy
				
			}
			me.css(it[x],{"left":cx+"px","top":cy+"px"})
		}
		me.Next()
	}
	me.PlayTheSound = function(SoundFile,Freeze){
		// PlaySoundID function is in soundmanager2.js, BoardJS is integrated with soundmanager2.
		PlaySoundID(SoundFile,function(){if(Freeze!="")me.Next()})
		if(Freeze=="")me.Next()
	}
	me.StopTheSound = function(SoundFile){
		if((SoundFile+"")== "undefined"){
			for(var x=0;x<me.LoadingList.length;x++){
				if(me.LoadingList[x].split("$.$")[0] == "sound"){
					StopSoundID(me.LoadingList[x].split("$.$")[1])
				}
			}
			}else{
			StopSoundID(SoundFile)
		}
		me.Next()
	}
	// The following functions works only in browsers that support css3.
	// But don't worry, the timeline will continue normally if css3 is not supported.
	me.RotateIt = function(ID,Angle,Duration,Easing,Freeze){
		var it = me.get(ID)
		if(it==false)me.Next()
		if(Easing == "")Easing="linear"
		if(Duration == "")Duration=500
		for(var x=0;x<it.length;x++){
			if(it[x].MyCSS)it[x].MyCSS.rotate = Angle
			me.animate(it[x],{rotate:Angle},Duration,Easing,x == 0 ? function(){if(Freeze!="")me.Next()} : function(){})
		}
		if(Freeze=="")me.Next()
	}
	me.ZoomIt = function(ID,Scale,Duration,Easing,Freeze){
		var it = me.get(ID)
		if(it==false)me.Next()
		if(Easing == "")Easing="linear"
		if(Duration == "")Duration=500
		for(var x=0;x<it.length;x++){
			if(it[x].MyCSS)it[x].MyCSS.scale = Scale
			me.animate(it[x],{scale:Scale},Duration,Easing,x == 0 ? function(){if(Freeze!="")me.Next()} : function(){})
		}
		if(Freeze=="")me.Next()
	}
	me.CircleIt = function(ID,Style){
		var it = me.get(ID)
		if(it==false)me.Next()
		for(var x=0;x<it.length;x++){
			var s = Math.max(it[x].clientWidth || it[x].offsetWidth,it[x].clientHeight || it[x].offsetHeight)
			me.css(it[x],{"lineHeight":s+"px","padding":"10px","width":s+"px","height":s+"px"})
			if(Style!="")me.ChangeTheStyle(it[x].id,Style,true)
			me.Prefix(it[x],"borderRadius","300px")
		}
		me.Next()
	}
	me.RoundIt = function(ID,TheValue){
		var it = me.get(ID)
		if(it==false)me.Next()
		for(var x=0;x<it.length;x++){
			me.Prefix(it[x],"borderRadius",TheValue+"px")
		}
		me.Next()
	}
	me.ChangeHTML = function(ID,TheContent){
		var it = me.get(ID)
		if(it==false)me.Next()
		for(var x=0;x<it.length;x++){
			it[x].innerHTML = TheContent
		}
		me.Next()	
	}
	/**********************************************************/
	/*********************** Controls *************************/
	/**********************************************************/
	// The following functions are to control the timeline.
	me.LetMeGoto = function(FrameID){
		me.Stop()
		me.RemoveObjects(FrameID,me.Commands.length)
		me.CurrentStep = FrameID - 1
		setTimeout(function(){me.Paused=false;me.Started = true;me.StopMe = false;me.Next()},100)
	}
	// Remove objects.
	// IDX is the command's id of timeline.
	// DontRemove is an extra parameter to keep the background
	me.RemoveObjects = function(FromIDX,ToIDX,DontRemove){
		if(ToIDX > me.Commands.length)ToIDX = me.Commands.length
		for(var x=FromIDX;x<ToIDX;x++){
			var it = me.Commands[x].split(SEP)
			if(it[0] == "Text" || it[0] == "Image"){
				if(document.getElementById(it[it.length-2]))document.getElementById(it[it.length-2]).parentNode.removeChild(document.getElementById(it[it.length-2]))
				}else if(it[0] == "ShowTooltip"){
				if(document.getElementById(it[1]+"_tooltip"))me.Handle.removeChild(document.getElementById(it[1]+"_tooltip"))
				}else if(it[0] == "Background"){
				if(DontRemove == null){if(me.get("BoardBackground"+me.ID)!=false){me.Handle.removeChild(me.get("BoardBackground"+me.ID)[0])}}
				}else if(it[0] == "MoveTo"){
			}
		}
	}
	me.Stop = function(){
		me.StopMe = true
		me.Started = false
		me.StopTheSound()
	}
	// Remove everything
	me.reset = function(DontRemove){
		clearTimeout(me.DelayTimeout)
		me.Stop()
		window.SoundManagerReadyFunction = function(){}
		me.DoneFunction = function(){}
		me.RemoveObjects(0,me.Commands.length,DontRemove)
		if(DontRemove == null){
			me.LoadingList = new Array()
			me.StopTheSound()
			me.Commands = new Array();Functions = new Array()
			me.CurrentStep=-1
			me.Handle.innerHTML = ""
			for(var x=0;x<50;x++)if(document.getElementById("JustForLoading"+x))document.body.removeChild(document.getElementById("JustForLoading"+x))
		}
		return me
	}
	me.Replay = function(){
		me.reset(true)
		me.StopMe = false
		me.go()
	}
	me.go = function(DoneFunction){
		setTimeout(function(){
			if(typeof(DoneFunction) === "function"){me.DoneFunction = DoneFunction}
			me.StopMe = false
			// If soundmanager2 is not yet loaded and the presentation has sounds,
			// the board will wait for it.
			if(me.LoadingList.join("").indexOf("sound$.$")!=-1 && SoundManagerReady==false){
				var DIVL = document.createElement("div")
				DIVL.id = "TheBoardLoader"+me.ID
				DIVL.innerHTML = "Preparing Sound Player<div id='BoardProgressBar"+me.ID+"'></div>"
				me.Handle.appendChild(DIVL)
				window.SoundManagerReadyFunction = function(){
					me.GoNow()
				}
			}else{
				me.GoNow()
			}
		},100)
	}
	me.GoNow = function(){
		if(me.StopMe == true)return
		if(me.Commands.length==0)return
		me.Started = true
		me.Paused = false
		CurrentLoaded=0
		if(me.LoadingList.length==0){
			me.FileIsLoaded()
			}else{
			if(me.get("TheBoardLoader"+me.ID)!=false)me.Handle.removeChild(me.get("TheBoardLoader")[0])
			var DIVL = document.createElement("div")
			DIVL.id = "TheBoardLoader"+me.ID
			DIVL.className = "TheBoardLoader"
			DIVL.innerHTML = "Loading<div id='BoardProgressBar"+me.ID+"'></div>"
			me.Handle.appendChild(DIVL)
			for(var x=0;x<me.LoadingList.length;x++){
				if(me.LoadingList[x].split("$.$")[0] == "image"){
					if(me.get("JustForLoading"+x)!=false)document.body.removeChild(me.get("JustForLoading"+x)[0])
					var IMG = document.createElement("img")
					me.css(IMG,{"position":"absolute","left":"0","top":"-1000px","width":"10px","height":"10px"})
					IMG.id="JustForLoading"+x
					document.body.appendChild(IMG)
					IMG.onload = function(){me.FileIsLoaded()}
					IMG.src = me.LoadingList[x].split("$.$")[1]
					}else if(me.LoadingList[x].split("$.$")[0] == "sound"){
					var SND = me.LoadingList[x].split("$.$")[1]
					// PrepareSound function is in soundmanager2.js, BoardJS is integrated with soundmanager2.
					// This function only loads the soundfile into the cache.
					PrepareSound(SND,function(){me.FileIsLoaded()})
				}
			}
		}
	}
	me.FileIsLoaded = function(){
		if(me.StopMe == true)return
		CurrentLoaded++
		if(me.LoadingList.length>0)me.get("BoardProgressBar"+me.ID)[0].style.width = ((CurrentLoaded / me.LoadingList.length) * 230) + "px"
		if(CurrentLoaded >= me.LoadingList.length){
			if(me.get("TheBoardLoader"+me.ID)!=false)me.Handle.removeChild(me.get("TheBoardLoader"+me.ID)[0])
			me.Next()
		}
	}
	me.Next = function(){
		if(me.StopMe == true)return
		if(me.Commands.length==0)return
		me.CurrentStep++
		if(me.CurrentStep == me.Commands.length){me.CurrentStep--;me.DoneFunction();return}
		if(!me.Commands[me.CurrentStep])return
		me.Execute(me.Commands[me.CurrentStep].split(SEP))
	}
	// This function is to execute me.Commands from the timeline
	me.Execute = function(it){
		for(var x=0;x<it.length;x++){if(it[x]=="undefined")it[x]=""}
		if(it[0] == "Text"){me.ShowText(it[1],it[2],it[3],it[4],it[5],it[6],it[7],it[8],it[9])}
		if(it[0] == "Image"){me.ShowImage(it[1],it[2],it[3],it[4],it[5],it[6],it[7],it[8],it[9],it[10])}
		if(it[0] == "Delay"){clearTimeout(me.DelayTimeout);me.DelayTimeout=setTimeout(function(){me.Next()},parseFloat(it[1]))}
		if(it[0] == "Flash"){me.FlashIt(it[1],it[2],it[3],it[4])}
		if(it[0] == "Circle"){me.CircleIt(it[1],it[2])}
		if(it[0] == "Round"){me.RoundIt(it[1],it[2])}
		if(it[0] == "FadeIn"){me.FadeIt(it[1],it[2],it[3],true)}
		if(it[0] == "FadeOut"){me.FadeIt(it[1],it[2],it[3],false)}
		if(it[0] == "HTML"){me.ChangeHTML(it[1],it[2])}
		if(it[0] == "Background"){me.SetBackground(it[1],it[2],it[3])}
		if(it[0] == "MoveTo"){me.MoveIt(it[1],it[2],it[3],it[4],it[5],it[6])}
		if(it[0] == "Remove"){me.RemoveIt(it[1])}
		if(it[0] == "AddTooltip"){me.AddTheTooltip(it[1],it[2])}
		if(it[0] == "RemoveTooltip"){me.RemoveTheTooltip(it[1])}
		if(it[0] == "ShowTooltip"){me.ShowTheTooltip(it[1],it[2],it[3],it[4])}
		if(it[0] == "SetStyle"){me.ChangeTheStyle(it[1],it[2])}
		if(it[0] == "ChangeImage"){me.ChangeTheImage(it[1],it[2],it[3],it[4],it[5],it[6])}
		if(it[0] == "AddEvent"){me.SetTheEvent(it[1],it[2],it[3])}
		if(it[0] == "RemoveEvent"){me.RemoveTheEvent(it[1],it[2])}
		if(it[0] == "Hover"){me.OnHover(it[1],it[2],it[3],it[4])}
		if(it[0] == "UnHover"){me.OnUnHover(it[1])}
		if(it[0] == "Merge"){me.DoMerge(it[1],it[2],true)}
		if(it[0] == "UnMerge"){me.DoMerge(it[1],it[2],false)}
		if(it[0] == "PlaySound"){me.PlayTheSound(it[1],it[2])}
		if(it[0] == "StopSound"){me.StopTheSound(it[1])}
		if(it[0] == "Rotate"){me.RotateIt(it[1],it[2],it[3],it[4],it[5])}
		if(it[0] == "Zoom"){me.ZoomIt(it[1],it[2],it[3],it[4],it[5])}
		if(it[0] == "GoTo"){me.LetMeGoto(it[1])}
		if(it[0] == "Pause"){me.Paused = true}
		if(it[0] == "Resume"){if(me.Paused == true){me.Paused = false;me.Next()}}
	}
	/*********************************************************/
	/********************** Functions ************************/
	/*********************************************************/
	// These functions are for animations, tooltips... They are only used within the library.
	me.Tooltip = function(ID,TheInner,RemoveAfter,OnRemove){
		var it = me.get(ID)
		if(it==false)me.Next()
		if(me.get(ID+"_tooltip")!=false)me.Handle.removeChild(me.get(ID+"_tooltip")[0])
		var TheTip = document.createElement("div")
		TheTip.className = "TheTip"
		TheTip.id = ID+"_tooltip"
		TheTip.innerHTML = '<div>'+TheInner.replace(/<br>/g,"<br>&nbsp;")+'</div><div id="'+ID+'_tooltipArrow" class="TipArrow"></div>'
		me.css(TheTip,{"textAlign":"center","display":"block","visibility":"hidden"})
		me.Handle.appendChild(TheTip)
		setTimeout(function(){
			var ww = TheTip.clientWidth || TheTip.offsetWidth
			var wm = me.Handle.clientWidth || me.Handle.offsetWidth
			var hh = TheTip.clientHeight || TheTip.offsetHeight
			var xx = parseFloat(it[0].style.left) - ((ww/2)-(it[0].offsetWidth/2))
			var yy = parseFloat(it[0].style.top)-hh-20
			if(xx < 0){xx=0}
			if(yy < 0)yy=0
			if(ww + xx > wm){
				xx=wm - ww - 30
				me.get(ID+"_tooltipArrow")[0].style.left=(parseFloat(it[0].style.left)-xx+(it[0].offsetWidth/2.5))+"px"
				TheTip.style.width = (wm - xx - 20)+"px"
			}
			//"height":(TheTip.clientHeight-12)+"px",
			me.css(TheTip,{"left":xx+"px","top":yy+"px","visibility":"visible"})
		},100)
		if(RemoveAfter != null)setTimeout(function(){if(me.get(ID+"_tooltip")!=false)me.Handle.removeChild(me.get(ID+"_tooltip")[0]);OnRemove()},RemoveAfter)
	}
	me.RemoveTooltip = function(ID){
		if(me.get(ID+"_tooltip")!=false)me.Handle.removeChild(me.get(ID+"_tooltip")[0])
	}
	// This function is called when addText or addImage functions are used.
	// Images will not be animated until they are loaded,
	// this makes the timeline stable.
	me.ShowObjectAnimated = function(obj,SRC,ShowType,Easing,Duration,OnFinish){
		ShowType = ShowType.split(" ")
		var DoAnimation = function(){
			me.ShowAnimated(obj,ShowType[0],Easing,true,OnFinish,Duration)
			if(ShowType.length>1){
				for(var x=1;x<ShowType.length;x++){
					me.ShowAnimated(obj,ShowType[x],"linear",false,"",Duration)
				}
			}
		}
		
		if(obj.className=="ImImage"){
			obj.children[0].onload = function(){
				var meme = this
				setTimeout(function(){
					meme.parentNode.style.width = meme.width + "px"
					meme.parentNode.style.height = meme.height + "px"
					meme.style.width = "100%"
					meme.style.height = "100%"
					DoAnimation()
				},10)
				this.onload = function(){}
			}
			obj.children[0].src = SRC
			}else{
			DoAnimation()
		}
	}
	// This function is to make getElementById more safer.
	// The function returns an array handling the objects.
	me.get = function(ID){
		if(typeof ID === "object"){
			if(ID)return ID
			}else if(typeof ID === "string"){
			ID = ID.split(" ")
			var objs = []
			for(var x=0;x<ID.length;x++){if(document.getElementById(ID[x]))objs.push(document.getElementById(ID[x]))}
			if(objs.length>0)return objs
		}
		return false
	}
	// This is for animating the styles from value to value,
	// Syntax: me.animate(obj,{left:"10px"},500,"linear",function(){})
	// You can write rotate or scale, and the value will be automatically processed,
	// -webkit-transform, -moz-transform, -ms-transform, -o-transform or transform will be taken depending on the browser.
	me.animate = function(element,properties,duration,Easing,callback){
		return (function() {
			if(me.StopMe == true)return
			Easing = Easing || "linear"
			duration = parseInt(duration || 500)
			var interpolations = {};
			for( var p in properties ) {
				if(p.toLowerCase() == "rotate" || p.toLowerCase() == "scale"){
					interpolations[p] = {start: me.Prefix(element,p.toLowerCase()),end: parseFloat(properties[p])}
					}else{
					interpolations[p] = {
						start: parseInt(element.style[p]) || 0,
						end: parseInt((properties[p]+"").match(/-*\d+(px)/g) || properties[p]),
						unit: ((typeof properties[p] === 'string' || typeof properties[p] === 'number') && (element.style[p]+"").match(/px|em|%/gi)) ? (element.style[p]+"").match(/px|em|%/gi)[0] : ''
					}
					
					
					var u = properties[p] || me.css(element,p)
					if(typeof(u) === "string"){
						if(u.indexOf("px")!=-1){interpolations[p].REP = u.replace(/-*\d+(px)/g,"REPpx")}
					}
				}
			}
			
			var animationStartTime = (new Date).getTime(),progress,CurP,CurTime;
			var step = setInterval(function(){
				if(me.StopMe == true){clearInterval(step);return}
				CurTime = (new Date).getTime()
				CurP = (CurTime - animationStartTime) / duration
				progress = CurP
				switch (Easing.toLowerCase()){
					case "linear":
					progress = CurP;
					break;
					case "easeout":
					progress = Math.pow(CurP,0.48)
					break;
					case "easein":
					progress = Math.pow(CurP,1.7)
					break;
					case "backin":
					var s = 1.7;
					progress = CurP * CurP * ((s + 1) * CurP - s)
					break;
					case "backout":
					var s = 1.7;
					progress= (--CurP*CurP*((s+1)*CurP + s) + 1)
					break;
					case "elastic":
					if (CurP == 0 || CurP == 1) {
						progress= CurP
						}else{
						var p2 = .3,s = p2 / 4;
						progress= (Math.pow(2, -10 * CurP) * Math.sin((CurP - s) * (2 * Math.PI) / p2) + 1)// * (me.ToNumber-me.FromNumber) + me.FromNumber
					}
					break;
					case "bounce":
					var s = 7.5625,p2 = 2.75;
					if (CurP < (1 / p2)) {
						progress = s * CurP * CurP;
						} else {
						if (CurP < (2 / p2)) {
							CurP -= (1.5 / p2);
							progress = s * CurP * CurP + .75;
							} else {
							if (CurP < (2.5 / p2)) {
								CurP -= (2.25 / p2);
								progress = s * CurP * CurP + .9375;
								} else {
								CurP -= (2.625 / p2);
								progress = s * CurP * CurP + .984375;
							}
						}
					}
					break;
				}
				if(CurTime >= duration + animationStartTime){progress=1}
				for(var p in interpolations){
					var property = interpolations[p];
					var VAL = parseFloat(property.start + ((property.end - property.start) * progress))
					if(p.toLowerCase() == "rotate" || p.toLowerCase() == "scale"){
						me.Prefix(element,p.toLowerCase(),parseFloat(VAL))
						}else{
						if(!property.REP){
							element.style[p] = VAL + property.unit
							}else{
							element.style[p] = property.REP.replace("REP",VAL)
						}
						if(p.toLowerCase() == "opacity" && me.OLDIE==true){element.style.filter = "alpha(opacity="+(VAL*100)+")"}
					}
				}
				if(CurTime >= duration + animationStartTime){
					if(typeof(callback)==="function")setTimeout(function(){callback(element)},10)
					stop();
				}
			},16)
			function stop(){clearInterval(step)}
			return{stop: stop}
		})()
	}
	// This function is called when addText or addImage functions are used.
	me.ShowAnimated = function(obj,ShowType,Easing,Append,OnFinish,Duration){
		return (function() {
			if(me.StopMe == true)return
			// Defaults
			ShowType = (ShowType || "appear").toLowerCase()
			Easing = Easing || "linear"
			Duration = Duration || 0
			OnFinish = OnFinish || function(){}
			if(Append == true){me.Handle.appendChild(obj)}
			if(ShowType == "split" && obj.className=="ImImage")ShowType="appear"
			switch(ShowType){
				case "appear":
				obj.style.display = "none"
				setTimeout(function(){
					obj.style.display = "block"
					OnFinish()
				},Duration)
				break;
				case "split":
				var txt = obj.innerHTML,CurX=0
				obj.innerHTML = ""
				var TempInterval = setInterval(function(){
					if(obj.innerHTML.length < txt.length){
						CurX++
						obj.innerHTML = txt.substring(0,CurX) + "&#x2590;"
						}else{
						obj.innerHTML = txt
						OnFinish()
						clearInterval(TempInterval)
					}
				},Duration / txt.length)
				break;
				case "fade":
				obj.style.opacity = "0"
				if(me.OLDIE==true)obj.style.filter = "alpha(opacity=0)"
				me.animate(obj,{opacity:1},Duration,Easing,OnFinish)
				break;
				case "zoom":
				me.Prefix(obj,"Scale",0)
				me.animate(obj,{scale:1},Duration,Easing,OnFinish)
				break;
				case "fromleft":case "fromtop":case "fromright":case "frombottom":
				var ww = obj.clientWidth || obj.offsetWidth
				var hh = obj.clientHeight || obj.offsetHeight
				var xx = parseInt(obj.style.position == "absolute" ? parseFloat(obj.style.left) : obj.offsetLeft)
				var yy = parseInt(obj.style.position == "absolute" ? parseFloat(obj.style.top) : obj.offsetTop)
				var AN = {}
				if(ShowType == "fromleft"){AN.left=xx+"px";obj.style.left = -(ww) + "px"}
				if(ShowType == "fromright"){AN.left=xx+"px";obj.style.left = (ww+parseFloat(me.Handle.clientWidth)) + "px"}
				if(ShowType == "fromtop"){AN.top=yy+"px";obj.style.top = -(hh) + "px"}
				if(ShowType == "frombottom"){AN.top=yy+"px";obj.style.top = (hh+parseFloat(me.Handle.clientHeight)) + "px"}
				me.animate(obj,AN,Duration,Easing,OnFinish)
				break;
			}
			obj.style.visibility = "visible"
		})()
	}
	// Helper functions, they are necessary to reduce the library's size.
	
	// "who" parameter is the object you want to work with.
	// "what" is style name such as left
	// if "what" is an object such as {left:"10px",top:"20px"}, it will update the object's style
	// if "what" is a string such as "left", it will return the "left" value.
	me.css = function(who,what){
		if(typeof what === "object"){
			for(var xx in what){who.style[xx] = what[xx]}
			}else if(typeof what === "string"){
			var RET = who.style[what],CS = window.getComputedStyle
			if(RET == "" && CS){
				CS = window.getComputedStyle(who,null).getPropertyValue(what)
			}
			if(what.toLowerCase() == "rotate")RET = parseFloat(who.getAttribute("rotation") || 0)
			if(what.toLowerCase() == "scale")RET = parseFloat(who.getAttribute("scale") || 1)
			return RET
		}
	}
	
	// This function is similar to .css function but for styles that their names changes from browser to browser,
	// such as MozBorderRadius or WebkitBorderRadius
	// "who" is the target object
	// "what" is the style name but without the prefix(Moz, Webkit...)
	// "TheVal" is the target value, if this parameter is null, the function will return the current value.
	// And because rotation and scaling are used in the same css3 style transform,
	// if you want to change only the scale transform just write "scale" in "what" parameter
	// such as: me.Prefix(obj,"scale",10)
	me.Prefix = function(who,what,TheVal){
		var ST = what.slice(0,1).toUpperCase() + what.slice(1),
		vendors = ['Webkit','Moz','O','ms']
		var Rotation = parseInt(who.getAttribute("rotation") || 0)
		var Scale = parseFloat(who.getAttribute("scale") || 1)
		if(TheVal != null){
			if(ST == "Rotate"){Rotation = TheVal}else if(ST == "Scale"){Scale = TheVal}
			for(var x=0;x<vendors.length;x++){
				var TR = who.style[vendors[x]+"Transform"]
				if(typeof(TR) !== 'undefined'){
					who.style[vendors[x]+"Transform"] = "rotate(" + Rotation + "deg) scale(" + Scale + ")"
					if(ST != "Rotate" && ST != "Scale")who.style[vendors[x]+ST] = TheVal
				}
			}
			who.style["transform"] = "rotate(" + Rotation + "deg) scale(" + Scale + ")"
			if(ST != "Rotate" && ST != "Scale")who.style[what] = TheVal
			who.setAttribute("rotation",Rotation || 0)
			who.setAttribute("scale",Scale)
			}else{
			if(ST == "Rotate"){
				return Rotation
				}else if(ST == "Scale"){
				return Scale
				}else{
				for(var x=0;x<vendors.length;x++){
					if(typeof(who).style[vendors[x]+what] !== 'undefined'){
						if(TheVal)who.style[vendors[x]+what] = TheVal
						return who.style[vendors[x]+what] == "" ? false : who.style[vendors[x]+what]
					}
				}
			}
		}
		return false;
	}
	// I'm sure you know the rest :)
	// Code from John Resig (http://ejohn.org/blog/flexible-javascript-events)
	me.addAnEvent = function(obj,type,fn){
		if (obj.attachEvent){
			obj['e'+type+fn] = fn;
			obj[type+fn] = function(){obj['e'+type+fn]( window.event )}
			obj.attachEvent('on'+type,obj[type+fn])
		}else
		obj.addEventListener(type,fn,false)
	}
	me.DeleteEvent = function(obj,type,fn){
		if(obj.detachEvent){
			obj.detachEvent('on'+type,obj[type+fn])
			obj[type+fn] = null
		}else
		obj.removeEventListener(type,fn,false)
	}
	// This function is not necessary,
	// but selectable text within the presentation is a bit annoying
	me.DisableSelectAndDrag = function(idx){
		idx.draggable = false
		idx.style.MozUserSelect = "-moz-none"
		idx.style.webkitUserSelect = "none"
		idx.setAttribute("unselectable","on")
		idx.onselectstart = function(){return false}
		idx.ondragstart = function(){return false}
	}
	return me
	}
})()