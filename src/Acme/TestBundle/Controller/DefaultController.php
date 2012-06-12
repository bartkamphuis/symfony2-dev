<?php

namespace Acme\TestBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class DefaultController extends Controller
{
    /**
	 * indexAction loads index.html.twig by default naming convention
     * @Route("/", name="_home")
     * @Template()
     */
    public function indexAction()
    {
        return array('name' => "world");
    }
	
	
	/**
	 * 
     * @Route("/daniel", name="_daniel")
     * @Template()
     */
    public function danielAction()
    {
        return array(
					'name' => "world",
					'ROOT_FOLDER' => '/kn', 
					'THEME' => '/default', 
					'FULL_PATH' => $_SERVER['DOCUMENT_ROOT'].'/kn'
					);
    }
	
	
	/**
     * @Route("/whitelabel", name="_whitelabel")
     * @Template()
     */
    public function whitelabelAction()
    {
        return array(
					'name' => "Whitelabel template",
					'ROOT_FOLDER' => 'whitelabel', 
					'THEME' => 'whitelabel', 
					'FULL_PATH' => $_SERVER['DOCUMENT_ROOT'].'/whitelabel'
					);
    }
	
	/**
     * @Route("/widgetcontent", name="_widgetcontent")
     * @Template()
     */
    public function widgetcontentAction()
    {
        // make the loading time a bit longer
		sleep(1);
		return array(
					'date' => date('r')
					);
    }
	
	
	
}
