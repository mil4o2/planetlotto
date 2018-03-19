<?php

namespace Proxy\Plugin;

use Proxy\Plugin\AbstractPlugin;
use Proxy\Event\ProxyEvent;

class ProxifyPlugin extends AbstractPlugin {

	private $base_url = '';
	
	// TODO: relative urls ../fonts/base/TheSans_LT_TT4i.svg
	private function css_url($matches){
	
		$url = trim($matches[1]);
		
		if(stripos($url, 'data:') === 0){
			return $matches[0];
		}
		
		return ': url(\''.proxify_url($url, $this->base_url).'\')';
	}

	private function html_href($matches){
		
		$url = $matches[2];
		
		/*
		if(stripos($url, "javascript:") === 0){
			return $matches[0];
		}
		*/
		
		// do we even need to proxify this URL?
		if(true){
			return str_replace($url, proxify_url($url, $this->base_url), $matches[0]);
		}
		
		return $matches[0];
	}

	private function html_src($matches){

		if(stripos(trim($matches[1]), 'data:') === 0){
			return $matches[0];
		}
		
		return 'src="'.proxify_url($matches[1], $this->base_url).'"';
	}

	private function form_action($matches){
		
		// $matches[1] = " or '
		$new_action = proxify_url($matches[2], $this->base_url);
		
		// what is form method?
		$form_post = preg_match('@method=(["\'])post\1@i', $matches[0]) == 1;
		
		// take entire form string - find real url and replace it with proxified url
		$result = str_replace($matches[2], $new_action, $matches[0]);
		
		// must be converted to POST otherwise GET form would just start appending name=value pairs to your proxy url
		if(!$form_post){
		
			// may throw Duplicate Attribute warning but only first method matters
			$result = str_replace("<form", '<form method="POST"', $result);
			
			// got the idea from Glype - insert this input field to notify proxy later that this form must be converted to GET during http
			$result .= '<input type="hidden" name="convertGET" value="1">';
		}
		
		return $result;
	}
	
	public function onBeforeRequest(ProxyEvent $event){
		// check if one of the POST pairs is convertGET - if so, convert this request to GET
	}
	
	public function onCompleted(ProxyEvent $event){
	
		// to be used when proxifying all the relative links
		$this->base_url = $event['request']->getUri();
		
		$response = $event['response'];
		$str = $response->getContent();

		// let's remove all frames??
		$str = preg_replace('@<iframe[^>]+>.*?<\\/iframe>@is', '', $str);
		
		// css
		$str = preg_replace_callback('@:\s*url\s*\((?:\'|"|)(.*?)(?:\'|"|)\)@im', array($this, 'css_url'), $str);
		
		// html
		$str = preg_replace_callback('@href\s*=\s*(["\'])(.+?)\1@im', array($this, 'html_href'), $str);
		$str = preg_replace_callback('@src=["|\']([^"\']+)["|\']@i', array($this, 'html_src'), $str);
		$str = preg_replace_callback('@<form[^>]*action=(["\'])(.+?)\1[^>]*>@i', array($this, 'form_action'), $str);
		
		$response->setContent($str);
	}



}

?>