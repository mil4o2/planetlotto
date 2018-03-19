<?php
namespace Lotto_Yard;

use Proxy\Http\Request;
use Proxy\Proxy;

class LottoYardProxy
{
    public function ly_proxy($get)
    {
        $request = Request::createFromGlobals();
            
        $request->headers->set('Token', TOKEN, false);
        $request->headers->set('Content-Type', 'application/json');
        $request->headers->set('sslverify', false);

        $proxy = new Proxy();

        $body = json_decode($request->getRawBody());
        
        $body->brandid = BRAND_ID;
        $body->ip = $_SERVER['REMOTE_ADDR'];
        
        $request->setBody(json_encode($body));
        
        $response = $proxy->forward($request, $get);

        $response->send();
        exit;
    }

    public function ly_remote_post($method_url, $set_transient = false) {
        $transient_key = 'ly_'.$method_url;
        
        if($set_transient && !empty(get_transient($transient_key))) {
            return get_transient($transient_key);
        }

        $response = wp_remote_post(BASE_API_URL.$method_url, array(
            'headers' => array(
                'Token' => TOKEN,
            ),
            'sslverify' => false,
            'body' => array(
                    'BrandId' => BRAND_ID
                )
            )
        );
        if (!is_wp_error($response)) {
            $resp = json_decode(wp_remote_retrieve_body($response));
            if($set_transient) {
                set_transient($transient_key, $resp, 7 * 24 * 60 * 60);
            }
        } else {
            // send urgent mail with error
        }

        return $resp;
    }
}