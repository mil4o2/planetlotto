<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */


define('WP_HOME','http://www.planetlotto.com.au');
define('WP_SITEURL','http://www.planetlotto.com.au');


define('DB_NAME', 'chgwpprd');

/** MySQL database username */
define('DB_USER', 'chgwpprd');

/** MySQL database password */
define('DB_PASSWORD', 'd32aa9523542db205b3c1b3');

/** MySQL hostname */
define('DB_HOST', 'localhost');
// define('DB_HOST', 'dbase.ftp.sh');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');


// /** The name of the database for WordPress */
// define('DB_NAME', 'test222');

// /** MySQL database username */
// define('DB_USER', 'root');

// /** MySQL database password */
// define('DB_PASSWORD', 'password123');

// /** MySQL hostname */
// define('DB_HOST', 'localhost');

// /** Database Charset to use in creating database tables. */
// define('DB_CHARSET', 'utf8mb4');

// /** The Database Collate type. Don't change this if in doubt. */
// define('DB_COLLATE', '');


/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'nK:Lf]mgdrKLxtatA_p~=M)~&sScA/P!c!,V-2L7`Y2e#-0c_ui8gvvw>KB>.ZwT');
define('SECURE_AUTH_KEY',  'KrBj?~q,$`x!Pn^9?]h_M}.!9X3>oh)bF_T%cQ.Cq&HU)l^Sej,Z*13E/@f(_*j=');
define('LOGGED_IN_KEY',    '?C!rh<>RO`9KtA6FKU?7[ufE&]Ge(B=.^;LUBZ#eR@/dssb+ks8:s!sXR@qKzbyb');
define('NONCE_KEY',        'vzAQcxzw^E{bwA]Fv7*~LRcv:xd:<Z!e52t&&Sj-:4_PjQ2S|W_>5r^@VXE/KTm6');
define('AUTH_SALT',        '#nRpmpF~.*7:<VTKmqd,euiyS+,ytim@AN@kq.paY4R]_-;hJ;h_W_{pi]i=t&7|');
define('SECURE_AUTH_SALT', 'b:}1.^OJ:6i^J_E-k)bIekNm?gyKf<P*=+f0|Ews`0(piE1{71Wo}^BXryTmbv_<');
define('LOGGED_IN_SALT',   'wxuW4pj)V>-0Y{LqzI??U<eApLx_/U}VhE_0afZ1J~W20s5}w<#(I[$|Ud/r h>r');
define('NONCE_SALT',       'HCUGNrn}]IAQ,~*o0g0@c%/r$/RHv0PUav67,hI!LHCvt;T5/yx-5=[LhWOu5#zI');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', false);
define('SAVEQUERIES', false);
define('WP_POST_REVISIONS', false);
$table_prefix  = 'icelotto_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
