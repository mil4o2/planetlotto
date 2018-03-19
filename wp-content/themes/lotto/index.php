<?php

// File Security Check
if(!defined('ABSPATH')) { exit; }

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> ng-app="lyApp">
<head>
    <base href="<?php echo home_url() . '/'; ?>">
    <!--<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/fav.ico" />-->
    <title ng-bind-html="MetaService.metaTitle()"><?php echo get_post_meta(get_the_ID(), '_yoast_wpseo_title', true); ?></title>
    <link rel="canonical" href="{{MetaService.metaCanonicalUrl()}}" />
    <meta name="description" content="{{MetaService.metaDescription()}}" />
    <meta name="robots" content="{{MetaService.metaRobots()}}"/>
    <meta name="keywords" content="{{MetaService.metaKeywords()}}" />
    <meta property="og:site_name" content="<?php echo get_bloginfo(); ?>" />
    <meta property="og:locale" content="<?php echo get_locale(); ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{MetaService.metaCanonicalUrl()}}" />
    <meta property="og:title" content="{{MetaService.metaFacebookTitle()}}" />
    <meta property="og:description" content="{{MetaService.metaFacebookDescription()}}" />
    <meta property="og:image" content="{{MetaService.metaFacebookImage()}}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="{{MetaService.metaTwitterTitle()}}" />
    <meta name="twitter:description" content="{{MetaService.metaTwitterDescription()}}" />
    <meta name="twitter:image" content="{{MetaService.metaTwitterImage()}}" />
    <meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<!-- Start of Zoom Analytics Code -->
	<script type="text/javascript">
	var _zaVerSnippet=5,_zaq=_zaq||[];
	(function() {
	  var w=window,d=document;w.__za_api=function(a){_zaq.push(a);if(typeof __ZA!='undefined'&&typeof __ZA.sendActions!='undefined')__ZA.sendActions(a);};
	  var e=d.createElement('script');e.type='text/javascript';e.async=true;e.src=('https:'==d.location.protocol?'https://d2xerlamkztbb1.cloudfront.net/':'http://wcdn.zoomanalytics.co/')+'19762374-d15f/5/widget.js';
	  var ssc=d.getElementsByTagName('script')[0];ssc.parentNode.insertBefore(e,ssc);
	})();
	</script>
	<!-- End of Zoom Analytics Code -->
    <?php wp_head(); ?>
</head>
<body ng-controller="IndexCtrl" ng-cloak <?php body_class(); ?> >
<div class="shell">
    <div id="header">
        <script style="display:none;">
                  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

                  ga('create', 'UA-102097641-1', 'auto');
                  ga('send', 'pageview');

                </script>
        <div class="container">
            <nav class="navbar navbar-default">
                <div class="container-fluid no-padd">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
                                aria-expanded="false" aria-controls="navbar">
                            <span class="sr-only">{{::translation.Toggle_navigation}}</span>
                            <span class="icon-bar top-bar"></span>
                            <span class="icon-bar middle-bar"></span>
                            <span class="icon-bar bottom-bar"></span>
                        </button>
                        <a ng-href="{{::homeUrl}}" title="<?php bloginfo('title'); ?>">
                            <img src="<?php echo home_url(); ?>/wp-content/plugins/lotto-yard/frontend/images/site-logo-big.png" alt="<?php bloginfo('title'); ?>">
                        </a>
                    </div>

                    <div id="navbar" class="navbar-collapse collapse">
                        <?php if(function_exists('qtrans_getLanguageName') && (count(qtrans_getSortedLanguages()) > 1)):?>
                            <!-- Language Mobile -->
                            <ul class="nav navbar-nav navbar-right hidden-md hidden-sm hidden-lg" >
                                <li class="dropdown">
                                    <a href="" class="dropdown-toggle lang-btn" data-toggle="dropdown" role="button"
                                       aria-expanded="false" aria-haspopup="true"><?php echo qtrans_getLanguageName(); ?><span
                                            class="caret arrow"></span></a>
                                    <ul class="languages dropdown-menu">
                                        <li ng-repeat="(key, value) in languages" ng-class="{ currentLang: isCurrentLang(key) }"
                                            ng-click="langRedirect(key)">{{::value}}
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        <?php endif; ?>

                        <!-- Mobile menu for cart + Login/sign out -->
                        <ul class="nav navbar-nav navbar-right login hidden-md hidden-sm hidden-lg text-center" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <li ng-hide='userService.isLogin'>
                                <a class="btn-blue" href="#" ng-click="loginModal()" ng-hide='userService.isLogin'>{{::translation.menu_login}}</a>
<!--                                <span class="btn-green" ng-click='signupModal()' ng-hide='userService.isLogin'>{{::translation.Create_Account}}</span>-->
                            </li>
                            <li ng-hide='userService.isLogin'>
<!--                                <span class="btn-green" ng-click='signupModal()' ng-hide='userService.isLogin'>Get Started</span>-->
                                <a class="btn-green" href="http://planetlotto.com.au/play-lottery/#classic" ng-hide='userService.isLogin'>Get Started</a>
                            </li>
                            <!-- id="loged-user-window"  -->
                            <li class="dropdown user-info" ng-show='userService.isLogin'>
                                <a class="myAcc dropdown-toggle"
                                   type="button"
                                   id="dropdownMenu1"
                                   data-toggle="dropdown"
                                   aria-haspopup="true"
                                   aria-expanded="true"
                                   ng-click="doMagic(true)">
                                    {{::translation.My_Account}}
                                    <span class="caret arrow"></span>
                                </a>
                                <a class="icon-logout logout" ng-click="logout()">{{::translation.Signout}}</a>
                                <ul id="loged-user-window" class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                    <div class="cover-all"></div>
                                    <li>
                                        <div ly-user-info-money></div>
                                    </li>
                                </ul>
                            </li>
                            <li class="cart-container">
                                <div id="toggle-cart-popup-mobile" class="dropdown" data-toggle="collapse" data-target="#navbar" >
                                    <button
                                        class="dropdown-toggle btn-blue-brds" type="button" id="dropdownMenu1"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" ng-click="doMagic(true)">
                                        {{::translation.menu_cart}}
                                    </button>

                                    <span id="mobile-cart-items" class="cart-items" ng-if="lyCart.getItems().length !== 0">{{lyCart.getItems().length !== 0 ? lyCart.getItems().length : ''}}</span>

                                    <ul class="dropdown-menu keep-open-on-click" aria-labelledby="dropdownMenu1">
                                        <div class="cover-all"></div>
                                        <li>
                                            <div ly-cart-summary></div>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>

                        <!-- Mobile normal menu -->
                        <div class="text-cetner" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <?php
                            wp_nav_menu(array(
                                'theme_location' => 'header_menu',
                                'menu_class' => 'nav navbar-nav hidden-lg hidden-md hidden-sm',
                                'item_spacing' => 'discard'
                            ));
                            ?>
                        </div>

                        <?php if(function_exists('qtrans_getLanguageName') && (count(qtrans_getSortedLanguages()) > 1)):?>
                            <!-- Desktop language menu -->
                            <ul class="nav navbar-nav navbar-right hidden-xs">
                                <li class="dropdown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
                                       aria-expanded="false" aria-haspopup="true"><?php echo qtrans_getLanguageName(); ?><span
                                            class="caret arrow"></span></a>
                                    <ul class="languages dropdown-menu">
                                        <li ng-repeat="(key, value) in languages" ng-class="{ currentLang: isCurrentLang(key) }"
                                            ng-click="langRedirect(key)">{{::value}}
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        <?php endif; ?>

                        <!-- Desktop Login menu -->
                        <ul id="desktop-login-menu" class="nav navbar-nav navbar-right login hidden-xs">
                            <li ng-hide='userService.isLogin'>
                                <a class="btn-blue" href="#" ng-click="loginModal()" ng-hide='userService.isLogin'>{{::translation.menu_login}}</a>
                            </li>
                            <li ng-show='userService.isLogin'>
                                <span class="btn-green" ng-click="goMyAccount()" ng-show='userService.isLogin'>{{::translation.My_Account}}</span>
                            </li>
                            <li class="dropdown user-info" ng-show='userService.isLogin'>
                                <a class="dropdown-toggle"
                                   type="text"
                                   id="dropdownMenu1"
                                   data-toggle="dropdown"
                                   aria-haspopup="true"
                                   aria-expanded="true">
                                    {{userName}}
                                    <span class="caret arrow" ng-click="doMagic(true)"></span>
                                    <p>{{::lyCart.getCurrency()}}
                                        <span ng-if="totalBalance">{{totalBalance | number:2}}</span>
                                        <span ng-if="!totalBalance">0.00</span>
                                    </p>
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                    <li>
                                        <div ly-user-info-money></div>
                                    </li>
                                </ul>
                            </li>
                            <li class="dropdown">
<!--                                <span class="btn-green" ng-click='signupModal()' ng-hide='userService.isLogin'>{{::translation.Create_Account}}</span>-->
<!--                                <span class="btn-green" ng-click='signupModal()' ng-hide='userService.isLogin'>Get Started</span>-->
                                <a class="btn-green" href="http://planetlotto.com.au/play-lottery/#classic" ng-hide='userService.isLogin'>Get Started</a>
                                <!--<span class="btn-green" ng-click="goMyAccount()" ng-show='userService.isLogin'>{{::translation.My_Account}}</span>-->

                            </li>
                            <li class="cart-container">
                                <div id="toggle-cart-popup" class="dropdown">
                                    <button
                                        data-content="{{lyCart.getItems().length !== 0 ? lyCart.getItems().length : ''}}"
                                        class="dropdown-toggle btn-blue-brds" type="button" id="dropdownMenu1"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        {{::translation.menu_cart}}
                                        ({{lyCart.getItems().length !== 0 ? lyCart.getItems().length : 0}})
                                    </button>
<!--                                    <span class="cart-items" ng-if="lyCart.getItems().length !== 0">-->
<!--                                        {{lyCart.getItems().length !== 0 ? lyCart.getItems().length : ''}}-->
<!--                                    </span>-->

                                    <ul class="dropdown-menu keep-open-on-click" aria-labelledby="dropdownMenu1">
                                        <li>
                                            <div ly-cart-summary></div>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>

                        <div class="head-menu hidden-xs nav navbar-nav navbar-right text-center">
                            <div class="header-menu">
                                <?php wp_nav_menu(array('theme_location' => 'header_menu'));?>
                                <script type="text/javascript">
                                    document.querySelector('.header-menu li.classic-icon').insertAdjacentHTML('beforeEnd', '<div class="lotto-menu-dropdown hide"></div>');
                                </script>
                            </div>
                        </div>

                    </div>
                </div>
            </nav>
        </div>
    </div>

    <div id="breadcrumb" ng-if="showBreadcrumb">
        <div class="container breadcrumbs" bind-html-compile="breadcrumb"></div>
    </div>

    <div ui-view class="ly-ui-view anim-in-out anim-fade" data-anim-speed="500"></div>

    <div id="social" class="text-center">
        <div class="container home-page-container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <ul>
                        <li>
                            <a href="<?php home_url(); ?>" target="_blank">
                                <span class="social-icons youtube"></span>
                            </a>
                        </li>
                        <li>
                            <a href="<?php home_url(); ?>" target="_blank">
                                <span class="social-icons twitter"></span>
                            </a>
                        </li>
                        <li>
                            <a href="<?php home_url(); ?>" target="_blank">
                                <span class="social-icons google-plus"></span>
                            </a>
                        </li>
                        <li>
                            <a href="<?php home_url(); ?>" target="_blank">
                                <span class="social-icons facebook"></span>
                            </a>
                        </li>
                    </ul>
                    <p class="fl-right f-14">{{::translation.share_iceLotto}}</p>
                </div>
            </div>
        </div>
    </div>

    <div id="footer-top" class="footer">
        <div class="container home-page-container">
            <div class="col-25">
                <?php wp_nav_menu(array('theme_location' => 'footer_menu_1'));?>
            </div>
            <div class="col-25">
                <?php wp_nav_menu(array('theme_location' => 'footer_menu_2'));?>
            </div>
            <div class="col-25">
                <?php wp_nav_menu(array('theme_location' => 'footer_menu_3'));?>
            </div>
<!--            <div class="col-20">-->
                <?php //wp_nav_menu(array('theme_location' => 'footer_menu_4'));?>
<!--            </div>-->
            <div class="col-25">
                <?php wp_nav_menu(array('theme_location' => 'footer_menu_5'));?>
            </div>

            <div id="footer-images" class="no-padd col-xs-12 text-center">
                <img src="<?= home_url(); ?>/wp-content/plugins/lotto-yard/frontend/images/Visa.jpg" alt="" />
                <img src="<?= home_url(); ?>/wp-content/plugins/lotto-yard/frontend/images/Mastercard.jpg" alt="" />
                <img src="<?= home_url(); ?>/wp-content/plugins/lotto-yard/frontend/images/18+.png" alt="" />
                <img src="<?= home_url(); ?>/wp-content/plugins/lotto-yard/frontend/images/Norton.png" alt="" />
                <img src="<?= home_url(); ?>/wp-content/plugins/lotto-yard/frontend/images/credorax.jpg" alt="" />
                <img src="<?= home_url(); ?>/wp-content/plugins/lotto-yard/frontend/images/mcafee.png" alt="" />
                <img src="<?= home_url(); ?>/wp-content/plugins/lotto-yard/frontend/images/Wirecard.jpg" alt="" />
                <!-- <span class="icons icon-world-pay"></span> -->
                <!-- <span class="icons icon-paypal"></span> -->
                <!--<span class="icons icon-visa"></span>
                <span class="icons icon-master-card"></span>
                <span class="icons icon-adult"></span>
                <span class="icons icon-norton"></span>
                <span class="icons icon-credorax"></span>
                <span class="icons icon-mcafee"></span>
                <span class="icons icon-wirecard"></span>-->
            </div>

            <!--            <div id="footer-images" class="no-padd col-xs-12">-->
            <!--                --><?php
            //                if( have_rows('footer_images', 'option') ):
            //                    while ( have_rows('footer_images', 'option') ) : the_row();
            //                        $link = get_sub_field('link', 'option');
            //                        $image_class = get_sub_field('image_class', 'option'); ?>
            <!--                        --><?php //if( $link ): ?>
            <!--                            <a class="icons --><?php //echo $image_class; ?><!--" href="--><?php //echo $link; ?><!--">-->
            <!--                        --><?php //endif; ?>
            <!--                        <span class="icons --><?php //echo $image_class; ?><!--"></span>-->
            <!--                        --><?php //if( $link ): ?>
            <!--                            </a>-->
            <!--                        --><?php //endif;
            //                    endwhile;
            //                endif;
            //                ?>
            <!--            </div>-->

        </div>
    </div>

    <div class="footer text-center" id="footer-bottom">
        <div class="container home-page-container">
            <p class="copyright">
                &copy; 2017 Planet Lotto.
            </p>
            <p class="owned-by f-12">{{::translation.footer_txt}}</p>
        </div>
    </div>
</div>
<div loader-css="ball-scale-multiple"></div>
</body>
<?php wp_footer(); ?>
<!-- <script type="text/javascript" src="/wp-content/plugins/lotto-yard/frontend/src/pages/common/directives/lotto-menu-dropdown.js"></script> -->
</html>
