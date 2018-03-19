<?php

namespace Proxy\Plugin;

use Proxy\Plugin\AbstractPlugin;
use Proxy\Event\ProxyEvent;

class DailyMotionPlugin extends AbstractPlugin {

	protected $url_pattern = 'dailymotion.com/video/';
	
	public function onCompleted(ProxyEvent $event){
		
		$response = $event['response'];
		
		$output = $response->getContent();
		
		if(preg_match('/video\/([^_]+)/', $event['request']->getUri(), $matches)){
		
			$id = $matches[1];
			
			$html = file_get_contents("http://www.dailymotion.com/embed/video/{$id}");
			
			if(preg_match('/stream_h264_ld_url":"([^"]+)"/is', $html, $matches)){

				$url = $matches[1];
				$url = stripslashes($url); 
						
				$output = preg_replace('#\<div\sclass\=\"dmpi_video_playerv4(.*?)>.*?\<\/div\>#s', 
			'<div class="dmpi_video_playerv4${1}>'.vid_player($url, 620, 348).'</div>', $output, 1);
			
			
				$response->setContent($output);
			}
		}
	
	}

}


?>