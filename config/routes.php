<?php

use Slim\App;
use App\Middleware\RedirectIfAuthenticated;
use App\Middleware\RedirectIfGuest;
use Slim\Csrf\Guard;

return function (App $app) {

    //AUTH
    $app->group('/auth', function($route) {

        $route->group('', function($route){
            $route->get('/signin', \App\Action\UserSigninIndexAction::class)
                ->setName('user-signin-index');
            $route->post('/signin', \App\Action\UserSigninAction::class)
                ->setName('user-signin');

        })
            ->add(RedirectIfAuthenticated::class);

        $route->post('/signout', \App\Action\UserSignoutAction::class)
            ->setName('user-signout');
       
    });
    
    //->add(Guard::class);

    $app->get('/auth/register', \App\Action\UserRegisterAction::class)
        ->setName('user-register');

    //HOME

    $app->get('/', \App\Action\UserSigninIndexAction::class)
        ->setName('login')
        ->add(RedirectIfGuest::class)
        ->add(Guard::class);

    $app->get('/dashboard', \App\Action\DashboardAction::class)
        ->setName('dashboard')
        ->add(RedirectIfGuest::class)
        ->add(Guard::class);

    //$app->get('/users', \App\Action\UserListAction::class)->setName('user-list');

    $app->get('/users', \App\Action\UsersAction::class)->setName('users');

    
    
    $app->get('/users/{id}', \App\Action\UserReadAction::class)->setName('users-get');
    $app->post('/users', \App\Action\UserCreateAction::class)->setName('user-post');
    $app->get('/hello', \App\Action\HelloAction::class);

    //USERS
    //$app->get('/users', \App\Action\UsersAction::class)->setName('users');

    //SCHEDULER
    $app->get('/scheduler', \App\Action\SchedulerAction::class)->setName('scheduler')
        ->add(RedirectIfGuest::class)
        ->add(Guard::class);
    $app->get('/scheduler/filter', \App\Action\SchedulerFilterAction::class)->setName('scheduler-filter');
    $app->post('/scheduler/template', \App\Action\SchedulerTemplateAction::class)->setName('scheduler-template');
    $app->get('/scheduler/template/{template_id}', \App\Action\SchedulerFetchTemplateAction::class)->setName('scheduler-fetch-template');
    $app->get('/scheduler/templates', \App\Action\SchedulerTemplatesAction::class)->setName('scheduler-templates');
    $app->post('/scheduler/bookings/template', \App\Action\SchedulerBookingsTemplateAction::class)->setName('scheduler-bookings-template');
    $app->post('/scheduler/booking/template', \App\Action\SchedulerBookingTemplateAction::class)->setName('scheduler-booking-template');
    $app->post('/scheduler/booking/template/delete', \App\Action\SchedulerBookingDeleteTemplateAction::class)->setName('scheduler-booking-template-delete');

    //EMPLOYEES
    $app->get('/employees', \App\Action\EmployeesAction::class)->setName('employees');
    $app->get('/employee/{emp_id}', \App\Action\EmployeeFetchAction::class)->setName('employee-fetch');
    $app->post('/employee', \App\Action\EmployeeAddAction::class)->setName('employee-add');
    $app->post('/employee/{emp_id}', \App\Action\EmployeeUpdateAction::class)->setName('employee-update');

    //SKILLS
    $app->get('/skills', \App\Action\SkillsAction::class)->setName('skills');
    $app->post('/skill', \App\Action\SkillAddAction::class)->setName('skill-add');
    $app->get('/skill/{skill_id}', \App\Action\SkillFetchAction::class)->setName('skill-fetch');
    $app->post('/skill/{skill_id}', \App\Action\SkillUpdateAction::class)->setName('skill-update');

    //TRADES
    $app->get('/trades', \App\Action\TradesAction::class)->setName('trades');

    //BOOKINGS
    $app->get('/bookings', \App\Action\BookingsAction::class)->setName('bookings');
    $app->get('/bookings/availability', \App\Action\BookingsAvailabilityAction::class)->setName('bookings-availability');
    $app->get('/bookings/request/{req_id}', \App\Action\BookingsRequestFetchAction::class)->setName('bookings-request-fetch');
    
    $app->get('/bookings/{req_id}/{emp_id}', \App\Action\BookingsReqEmpFetchAction::class)->setName('bookings-req-emp-fetch');
    
    $app->get('/booking/{booking_id}', \App\Action\BookingFetchAction::class)->setName('booking-fetch');
    $app->get('/bookings/batch/{batch_id}', \App\Action\BookingsBatchFetchAction::class)->setName('bookings-batch-fetch');
    $app->get('/bookings/shift/{shift_id}', \App\Action\BookingsShiftFetchAction::class)->setName('bookings-shift-fetch');
    $app->get('/bookings/emp/{emp_name}', \App\Action\BookingsShiftFetchAction::class)->setName('bookings-emp-fetch');

    //$app->get('/bookings/quote/{req_id}', \App\Action\BookingsQuoteFetchAction::class)->setName('bookings-quote-fetch');
    
    $app->get('/newbookings/quote/{req_id}', \App\Action\BookingsNewQuoteFetchAction::class)->setName('bookings-new-quote-fetch');


    $app->post('/booking/add', \App\Action\BookingAddAction::class)->setName('booking-add');
    $app->post('/booking/update', \App\Action\BookingUpdateAction::class)->setName('booking-update');
    $app->post('/booking/delete', \App\Action\BookingDeleteAction::class)->setName('booking-delete');
    $app->post('/bookings/delete', \App\Action\BookingsDeleteAction::class)->setName('bookings-delete');
    $app->get('/bookings/conflict', \App\Action\BookingsConflictAction::class)->setName('bookings-conflict');

    //CUSTOMERS
    $app->get('/customers', \App\Action\CustomersAction::class)->setName('customers');
    $app->get('/customers/auto', \App\Action\CustomersAutoAction::class)->setName('customers-auto');
    $app->get('/customer/name', \App\Action\CustomerNameAction::class)->setName('customer-name');
    $app->post('/customer', \App\Action\CustomerAddAction::class)->setName('customer-add');
    $app->get('/customer/{cust_id}', \App\Action\CustomerFetchAction::class)->setName('customer-fetch');
    $app->post('/customer/{cust_id}', \App\Action\CustomerUpdateAction::class)->setName('customer-update');

    $app->get('/customer/sites/{cust_id}', \App\Action\CustomerSitesFetchAction::class)->setName('customer-sites-fetch');
    $app->post('/customer/site/add', \App\Action\CustomerSiteAddAction::class)->setName('customer-site-add');
    $app->get('/customer/site/edit/{site_id}', \App\Action\CustomerSiteFetchAction::class)->setName('customer-site-fetch');
    $app->post('/customer/site/{cust_id}', \App\Action\CustomerSiteUpdateAction::class)->setName('customer-site-update');

    //WORKSPACE
    $app->get('/workspace', \App\Action\WorkspaceAction::class)->setName('workspace')
        ->add(RedirectIfGuest::class)    
        ->add(Guard::class);

    //REQUESTS
    $app->get('/requests', \App\Action\RequestsAction::class)->setName('requests');
    $app->post('/request', \App\Action\RequestAddAction::class)->setName('request-add');
    $app->get('/request/{ws_id}', \App\Action\RequestFetchAction::class)->setName('request-fetch');
    $app->post('/request/{ws_id}', \App\Action\RequestUpdateAction::class)->setName('request-update');
    $app->get('/requests/scheduler', \App\Action\RequestsSchedulerAction::class)->setName('requests-scheduler');
    $app->get('/request/scheduler/{raw}', \App\Action\RequestSchedulerRawAction::class)->setName('request-scheduler-raw');

    //PDF
    $app->get('/pdf', \App\Action\PdfTestAction::class)->setName('pdf-test');
    $app->post('/pdf/create', \App\Action\PdfCreateAction::class)->setName('pdf-create');
    $app->post('/pdf/save', \App\Action\PdfSaveAction::class)->setName('pdf-save');
    $app->post('/pdf/quote', \App\Action\PdfQuoteAction::class)->setName('pdf-quote');
    $app->get('/pdf/fields/{req}/{pdf}', \App\Action\PdfFieldsAction::class)->setName('pdf-fields');

    //EMAIL
    $app->post('/email/send/{req_id}', \App\Action\EmailSendAction::class)->setName('email-send');

    //FILE UPLOAD
    $app->post('/filepond/process', \App\Action\FilePondProcessAction::class);
    $app->delete('/filepond/revert', \App\Action\FilePondRevertAction::class);

    $app->post('/upload/files', \App\Action\UploadFilesAction::class)->setName('upload-files');

    //API
    $app->post('/api/signin', \App\Action\ApiSigninAction::class)->setName('api-signin');
    
    $app->get('/api/employee', \App\Action\ApiEmployeeFetchAction::class)->setName('api-employee-fetch');

    $app->get('/api/shifts', \App\Action\ApiEmployeeShiftsFetchAction::class)->setName('api-employee-shifts-fetch');
    $app->get('/api/shift/{shift_id}', \App\Action\ApiEmployeeShiftFetchAction::class)->setName('api-employee-shift-fetch');

    $app->post('/api/booking/update', \App\Action\ApiBookingUpdateAction::class)->setName('api-booking-update');

    $app->get('/api/messages/{message_to}', \App\Action\ApiMessagesFetchAction::class)->setName('api-messages-fetch');

    $app->get('/api/test/{test_id}', \App\Action\ApiTestFetchAction::class)->setName('api-test-fetch');
    $app->post('/api/test/{test_id}', \App\Action\ApiTestUpdateAction::class)->setName('api-test-update');

    //API FILES

    //$app->post('/files/upload', \App\Action\ApiFileUploadAction::class)->setName('api-file-upload');    

    //FCM

    $app->post('/fcm/send', \App\Action\FcmSendAction::class)->setName('fcm-send');

    $app->post('/fcm/update/{message_id}', \App\Action\FcmUpdateAction::class)->setName('fcm-update');

    $app->post('/fcm/add', \App\Action\FcmAddAction::class)->setName('fcm-add');

    $app->get('/fcm/{message_to}', \App\Action\FcmFetchAction::class)->setName('fcm-fetch');



};