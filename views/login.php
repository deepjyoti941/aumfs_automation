<!doctype html>
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Aumfs Automation Login</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
        <link href="http://fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic" rel="stylesheet" type="text/css">
        <!-- needs images, font... therefore can not be part of ui.css -->
        <link rel="stylesheet" href="/views/bower_components/font-awesome/css/font-awesome.min.css">
        <link rel="stylesheet" href="/views/bower_components/weather-icons/css/weather-icons.min.css">

        <!-- end needs images -->

            <link rel="stylesheet" href="/views/styles/main.css">

    </head>
    <body>
        <!--[if lt IE 9]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <div>

            <div class="view-container">
				<div class="page-signin">

				    <div class="signin-header">
				        <div class="container text-center">
				            <section class="logo">
				                <a href="/">AUMFS Automation</a>
				            </section>
				        </div>
				    </div>

				    <div class="signin-body">
				        <div class="container">
				            <div class="form-container">

				                <section class="row signin-social text-center">
				                    <img src="/views/images/logo.png" alt="aumfs Automation">
				                </section>

				                <span class="line-thru"></span>

				                <form class="form-horizontal">
				                    <fieldset>
				                        <div class="form-group">
				                            <div class="input-group input-group-lg">
				                                <span class="input-group-addon">
				                                    <span class="glyphicon glyphicon-envelope"></span>
				                                </span>
				                                <input type="email" class="form-control" placeholder="Email" value="admin@email.com">
				                            </div>
				                        </div>
				                        <div class="form-group">
				                            <div class="input-group input-group-lg">
				                                <span class="input-group-addon">
				                                    <span class="glyphicon glyphicon-lock"></span>
				                                </span>
				                                <input type="password" class="form-control" placeholder="password" value="admin123">
				                            </div>
				                        </div>
				                        <div class="form-group">
				                        </div>
				                        <div class="form-group">
				                            <a href="/dashboard" class="btn btn-primary btn-lg btn-block">Log in</a>
				                        </div>
				                    </fieldset>
				                </form>

				                <section>
				                    <p class="text-center"><a href="#/pages/forgot">Forgot your password?</a></p>
				                    <p class="text-center text-muted text-small">Don't have an account yet? <a href="#/pages/signup">Sign up</a></p>
				                </section>
				                
				            </div>
				        </div>
				    </div>

				</div>
            </div>
        </div>

        <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
        <script src="http://maps.google.com/maps/api/js?sensor=false"></script>
        <script src="/views/scripts/vendor_angularjs/angular.js"></script>
        <script src="/views/scripts/vendor_angularjs/angular-animate.js"></script>
        <script src="/views/scripts/vendor_angularjs/angular-resource.js"></script>
        <script src="/views/scripts/vendor_angularjs/angular-cookies.js"></script>
        <script src="/views/scripts/vendor_angularjs/angular-route.js"></script>

        <script src="/views/scripts/image_crop/crop.js"></script>
        <script src="/views/scripts/angular-dreamfactory.js"></script>
        <script src="/views/scripts/dreamfactory-user-management.js"></script>
        <script src="/views/scripts/modules.js"></script>

        <script src="/views/scripts/ui.js"></script>

        <script src="/views/scripts/app.js"></script>
        <script src="/views/scripts/services.js"></script>
        <script src="/views/scripts/directives.js"></script>
        <script src="/views/scripts/controllers.js"></script>
    </body>
</html>