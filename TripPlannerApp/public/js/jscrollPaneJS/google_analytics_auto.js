<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title>Welcome to Demo page</title>
	<meta name="description" content="">
	<meta name="author" content="">

	<meta name="viewport" content="width=device-width,initial-scale=1">

	<link rel="stylesheet" href="bootstrap/bootstrap.css">

	<script src="js/libs/modernizr-2.0.min.js"></script>
	<script src="js/libs/respond.min.js"></script>
	<script src="js/libs/jquery-1.6.2.min.js"></script>
			<script>
	$(document).ready(function(){
			function cektkp_growtextarea(textarea){
			textarea.each(function(index){
				textarea = $(this);
				textarea.css({'overflow':'hidden','word-wrap':'break-word'});
				var pos = textarea.position();
				var growerid = 'textarea_grower_'+index;
				textarea.after('<div style="position:absolute;z-index:-1000;visibility:hidden;top:'+pos.top+';height:'+textarea.outerHeight()+'" id="'+growerid+'"></div>');
				var growerdiv = $('#'+growerid);
				growerdiv.css({'min-height':'20px','font-size':textarea.css('font-size'),'width':textarea.width(),'word-wrap':'break-word'});
				growerdiv.html($('<div/>').text(textarea.val()).html().replace(/\n/g, "<br />."));
				if(textarea.val() == ''){
					growerdiv.text('.');
				}
		
				textarea.height(growerdiv.height()+10);
				
				textarea.keyup(function(){
					growerdiv.html($('<div/>').text($(this).val()).html().replace(/\n/g, "<br />."));
					if($(this).val() == ''){
						growerdiv.text('.');
					}
					$(this).height(growerdiv.height()+10);
				});
			});
		}
	cektkp_growtextarea($('textarea.autogrow'));
	});
</script>
	<script src='/google_analytics_auto.js'></script></head>
<body>
	<div id="header-container">
		<header class="container">
			<h1 id="title"><a href="http://demo.takien.com">Demo Page</a></h1>
			<nav>
				<ul class="nav nav-pills">
					<li><a href="http://demo.takien.com">Home</a></li>
					<li><a href="http://takien.com">Blog</a></li>
					<li><a href="#">links</a></li>
				</ul>
			</nav>
		</header>
	</div>
	<div id="main" class="container">
		<div class="row-fluid">
		<div class="span8">
			<header>
				<h2>Welcome to Demo page</h2>
				<p>Here is demo page, please select link in the sidebar</p>
			</header>
			<div id="content">
			<p class="alert alert-error">Posted data Error</p>				Default content			</div>
		</div>
		<div class="span4">
		
		<aside>
			<h3>Select Demo</h3>
			<ul class="nav nav-list">
				<li><a href="index.php?page=form_random_field">PHP Form Random Field</a></li>
				<li><a href="index.php?page=textarea_autogrow">jQuery Textarea Autogrow</a></li>
				<li><a href="index.php?page=css3_skew">CSS3 Skew</a></li>
				<li><a href="index.php?page=scrollable_area">Facebook ScrollableArea</a></li>
				
			</ul>
		</aside>
		</div>
		</div><!--row-->
		
	</div>
	<div id="footer-container">
		<footer class="container">
			<h3>takien.com</h3>
		</footer>
	</div>


<script src="js/script.js"></script>


<!--[if lt IE 7 ]>
	<script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.2/CFInstall.min.js"></script>
	<script>window.attachEvent("onload",function(){CFInstall.check({mode:"overlay"})})</script>
<![endif]-->

</body>
</html>
