/*

Mashed and tweaked by Joao Pescada (joaopescada.com) for learning purposes.

This mashup uses code from: 
- Pusher docs (http://pusher.com/docs)
- Nikko Bautista's tutorial at Nettuts+ (http://net.tutsplus.com/tutorials/javascript-ajax/getting-real-time-with-pusher/)
- requestAnimationFrame polyfill by Erik Möller, Paul Irish and Tino Zijdel (https://gist.github.com/1579671)
- shake.js by Alex Gibson / MiniApps (https://github.com/alexgibson/shake.js)

*/
$(function()
{
	var pusher;
	var channel;
	var colours = [ "255,0,0", "255,102,0", "255,153,0", "255,204,0", "255,255,0", "255,204,0", "255,153,0", "255,102,0" ];
	var colourIndex = 0;
	var colourStr;
	var canvas, context;
	var shakeListener;
	
	_initView();
	_initPusher();
	//_initAnimation();//called after pusher connected
	
	function _initView()
	{
		
		document.body.style.margin = 0;
		document.body.style.padding = 0;
		document.body.style.width = "100%";
		document.body.style.height = "100%";
		document.body.style.overflow = "hidden";
		
		//$("#preloader").css( {margin:"20px"} );
		//$("body").css( {margin:0; padding:0; width:"100%"; height:"100%"; overflow:"hidden"} );

		canvas = document.createElement("canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		document.body.appendChild( canvas );

		context = canvas.getContext("2d");
		
		$(canvas).click(function(e)
		{
			e.preventDefault();

			_ajaxCall(
				"pusher/push.php", 
				{message: _getColour() },
				function(data)
				{
					Pusher.log("Received: "+ data.message );
				}
			);
		});
		
		//set default value
		colourStr = colours[colourIndex];
	}

	function _initPusher()
	{
		pusher = new Pusher("0c59a7c533bb03790a0e");
		Pusher.channel_auth_endpoint = "pusher/auth.php";
		Pusher.log = function(message) {
			//if (window.console && window.console.log) window.console.log(message);
		};

		channel = pusher.subscribe("presence-channel-one");

		pusher.connection.bind(
			"connected",
			function()
			{
				//Pusher.log("yay! connected!");

				_initAnimation();
				
				channel.bind(
					"pusher:subscription_succeeded",
					function(members)
					{
						//Pusher.log("Subscribed! members: "+ members);
						var total = 0;
						members.each(function(member){ total++; Pusher.log("Member: "+ member.id ); });
						Pusher.log("-- total online: "+ total);
					}
				);

				channel.bind(
					"pusher:member_added",
					function(member)
					{
						Pusher.log("Member added! "+ member.id );
					}
				);

				channel.bind(
					"pusher:member_removed",
					function(member)
					{
						Pusher.log("Member removed! "+ member.id );
					}
				);

				channel.bind(
					"new_message",
					function(data)
					{
						Pusher.log("New message: "+ data.message);
						//$("#colour-label").html( data.message );
						colourStr = data.message;
					}
				);

				channel.bind(
					"presence-channel-one",
					function(data)
					{
						//Pusher.log("Event message: "+ data.message);
					}
				);
			}
		);
	}

	function _initShaker() {
		window.addEventListener('shake', shakeHandler, false);
	}
	
	function shakeHandler() {
	
		//alert("Oooh shaaaake meeeeee babyyy!");
		
		//simulate click
		$(canvas).click();
	}
	
	function _initAnimation()
	{
		$("#preloader").hide();
				
		animate();
		_initShaker();
	}
	
	function getRandomInt (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function animate()
	{
		requestAnimationFrame( animate );
		draw();
	}

	function draw()
	{
		var time = new Date().getTime() * 0.002;

		var offset = 50;
		var minW = (canvas.width - 100) * 0.5 - offset;
		var maxW = (canvas.width - 100) * 0.5 + offset;
		var minH = (canvas.height - 100) * 0.5 - offset;
		var maxH = (canvas.height - 100) * 0.5 + offset;
		var x = Math.sin( time ) * minW + maxW;
		var y = Math.cos( time * 0.9 ) * minH + maxH;

		//context.fillStyle = "rgb(245, 245, 245)";
		//context.fillRect( 0, 0, canvas.width, canvas.height);

		context.fillStyle = "rgba(0, 0, 0, 0.05)";
		context.beginPath();
		context.arc( x, y, 60, 0, Math.PI * 2, true );
		context.fill();
		context.closePath();


		//context.fillStyle = "rgb("+ getRandomInt(200,255) +", "+ getRandomInt(200,255) +", "+ getRandomInt(200,255) +")";

		var colourArr = colourStr.split(",");
		
		context.fillStyle = "rgba("+ colourArr[0] +", "+ colourArr[1] +", "+ colourArr[2] +", 1)";
		context.beginPath();
		context.arc( x, y, 20, 0, Math.PI * 2, true );
		context.fill();
		context.closePath();
	}
	
	function _getColour()
	{
		//return colours[ Math.floor( Math.random() * colours.length ) ];
		
		//colourIndex = colourIndex < colours.length-1 ? colourIndex++ : 0;
		
		if (colourIndex < colours.length-1) colourIndex++;
		else colourIndex = 0;
		
		return colours[ colourIndex ];
	}
	
	function _ajaxCall(ajax_url, ajax_data, successCallback) 
	{
		$.ajax({
			type: "POST",
			url: ajax_url,
			dataType: "json",
			data: ajax_data,
			time: 10,
			success: function(msg) 
			{
				if( msg.success ) {
					successCallback(msg);
				} else {
					alert(msg.errormsg);
				}
			},
			error: function(msg) {}
		});
	}
});