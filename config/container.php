<?php

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Slim\App;
use Slim\Factory\AppFactory;
use Slim\Middleware\ErrorMiddleware;
use Slim\Interfaces\RouteParserInterface;
use Selective\BasePath\BasePathMiddleware;
use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;
use Symfony\Bridge\Twig\Extension\TranslationExtension;
use Symfony\Component\Translation\Translator;
use Symfony\Component\Translation\Formatter\MessageFormatter;
use Symfony\Component\Translation\IdentityTranslator;
use Symfony\Component\Translation\Loader\MoFileLoader;

use Selective\Validation\Encoder\JsonEncoder;
use Selective\Validation\Middleware\ValidationExceptionMiddleware;
use Selective\Validation\Transformer\ErrorDetailsResultTransformer;

use Cartalyst\Sentinel\Native\Facades\Sentinel;
use Slim\Flash\Messages as Flash;

use App\Views\CsrfExtension;
use Slim\Csrf\Guard;

return [

    'settings' => function () {
        return require __DIR__ . '/settings.php';
    },

    Flash::class => function (ContainerInterface $container) {
        return new Slim\Flash\Messages;
    },

    RouteParserInterface::class => function (ContainerInterface $container) {
        return $container->get(App::class)->getRouteCollector()->getRouteParser();
    },

    ValidationExceptionMiddleware::class => function (ContainerInterface $container) {
        $factory = $container->get(ResponseFactoryInterface::class);

        return new ValidationExceptionMiddleware(
            $factory,
            new ErrorDetailsResultTransformer(),
            new JsonEncoder()
        );
    },

    ResponseFactoryInterface::class => function (ContainerInterface $container) {
        return $container->get(App::class)->getResponseFactory();
    },

    /*
    Mongo::class => function (ContainerInterface $container) {

        //$user = "test_user";
        //$pwd = 'WRpt1tqRHQCtQ2dN';

        $user = "ahyde";
        $pwd = 'YwcOY0onJDj6OUSJ';

        $mongo = new Mongo("mongodb+srv://${user}:${pwd}@cluster0-05jzd.mongodb.net/test?serverSelectionTryOnce=false&serverSelectionTimeoutMS=15000&w=majority");

        return $mongo;
    },
    */

    PDO::class => function (ContainerInterface $container) {
   	 $settings = $container->get('settings')['db'];

   	 $host = $settings['host'];
   	 $dbname = $settings['database'];
   	 $username = $settings['username'];
   	 $password = $settings['password'];
   	 $charset = $settings['charset'];
   	 $flags = $settings['flags'];
   	 $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";

   	 return new PDO($dsn, $username, $password, $flags);
    },
	
    App::class => function (ContainerInterface $container) {
        AppFactory::setContainer($container);

        return AppFactory::create();
    },

    ErrorMiddleware::class => function (ContainerInterface $container) {
        $app = $container->get(App::class);
        $settings = $container->get('settings')['error'];

        return new ErrorMiddleware(
            $app->getCallableResolver(),
            $app->getResponseFactory(),
            (bool)$settings['display_error_details'],
            (bool)$settings['log_errors'],
            (bool)$settings['log_error_details']
        );
    },
	
    BasePathMiddleware::class => function (ContainerInterface $container) {
        return new BasePathMiddleware($container->get(App::class));
    },

    // Twig templates
    Twig::class => function (ContainerInterface $container) {
        $settings = $container->get('settings');
        $twigSettings = $settings['twig'];

        $options = $twigSettings['options'];
        $options['cache'] = $options['cache_enabled'] ? $options['cache_path'] : false;

        $twig = Twig::create($twigSettings['paths'], $options);

        $translator = $container->get(Translator::class);
        $twig->addExtension(new TranslationExtension($translator));

        //$_SESSION['my_var'] = 'bla bla bla';
        //$myVar = $_SESSION['my_var'];
        //$twig->getEnvironment()->addGlobal('test_var', $myVar);

        $host = $_SERVER['HTTP_HOST'];

        $twig->getEnvironment()->addGlobal('host', $host);

        $twig->getEnvironment()->addGlobal('token', $_SESSION['my_token']);

        $twig->getEnvironment()->addGlobal('user', Sentinel::check());
        $twig->getEnvironment()->addGlobal('flash', $container->get(Flash::class));

        $twig->getEnvironment()->addGlobal('status', $container->get(Flash::class)->getFirstMessage('status'));
        $twig->getEnvironment()->addGlobal('errors', $container->get(Flash::class)->getFirstMessage('errors'));

        // Add extension here
        // ...

        $twig->addExtension($container->get(CsrfExtension::class));

        return $twig;
    },

    Guard::class => function (ContainerInterface $container){

        $factory = $container->get(ResponseFactoryInterface::class);

        return new \Slim\Csrf\Guard($factory);
    },

    CsrfExtension::class => function (ContainerInterface $container){
        return new CsrfExtension($container->get(Guard::class));
    },

    TwigMiddleware::class => function (ContainerInterface $container) {
        return TwigMiddleware::createFromContainer(
            $container->get(App::class),
            Twig::class
        );
    },

    Translator::class => function (ContainerInterface $container) {
        $translator = new Translator(
            'en_US',
            new MessageFormatter(new IdentityTranslator())
        );

        $translator->addLoader('mo', new MoFileLoader());

        return $translator;
    },

];

