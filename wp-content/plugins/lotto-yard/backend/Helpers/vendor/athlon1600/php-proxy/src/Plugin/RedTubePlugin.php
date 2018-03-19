<?php

namespace Proxy\Plugin;

use Proxy\Plugin\AbstractPlugin;
use Proxy\Event\ProxyEvent;

class RedTubePlugin extends AbstractPlugin {

	public function onCompleted(ProxyEvent $event){
	
		$output = $event['response']->getContent();
	
		if(preg_match('@video_url=([^&]+)@', $output, $matches)){
		
			$vid_url = rawurldecode($matches[1]);
			
			$player = vid_player($vid_url, 650, 365);
					
			$output = preg_replace('@<div id="redtube_flv_player"(.*?)>.*?<noscript>.*?<\/noscript>.*?<\/div>@s', 
			'<div id="redtube_flv_player"$1>'.$player.'</div>', $output);
			
			$event['response']->setContent($output);
		}
	}

}

?>