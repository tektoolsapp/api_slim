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

    $app->post('/auth/register', \App\Action\UserRegisterAction::class)
        ->setName('user-register');

    $app->post('/auth/update/{id}', \App\Action\UserUpdateAction::class)
        ->setName('user-update');

    //HOME

    $app->get('/', \App\Action\UserSigninIndexAction::class)
        ->setName('login')
        ->add(RedirectIfGuest::class)
        ->add(Guard::class);

    $app->get('/dashboard', \App\Action\DashboardAction::class)
        ->setName('dashboard')
        ->add(RedirectIfGuest::class)
        ->add(Guard::class);

    //USERS
    $app->get('/users', \App\Action\UsersAction::class)->setName('users');
    $app->get('/users/{id}', \App\Action\UserReadAction::class)->setName('users-get');
    $app->post('/users', \App\Action\UserCreateAction::class)->setName('user-post');
    $app->get('/user/{id}/{username}', \App\Action\UserCheckAction::class)->setName('user-check');
    $app->post('/user/dets', \App\Action\UserUpdateDetsAction::class)->setName('user-update-dets');

    //SCHEDULER
    $app->get('/scheduler', \App\Action\SchedulerAction::class)->setName('scheduler')
        ->add(RedirectIfGuest::class)
        ->add(Guard::class);
    $app->get('/scheduler/filter', \App\Action\SchedulerFilterAction::class)->setName('scheduler-filter');
    $app->get('/workspace/filter', \App\Action\SchedulerWorkspaceFilterAction::class)->setName('scheduler-workspace-filter');
    $app->post('/scheduler/template', \App\Action\SchedulerTemplateAction::class)->setName('scheduler-template');
    $app->post('/scheduler/swing', \App\Action\SchedulerSwingAction::class)->setName('scheduler-swing');
    $app->get('/scheduler/template/{template_id}', \App\Action\SchedulerFetchTemplateAction::class)->setName('scheduler-fetch-template');
    $app->get('/scheduler/templates', \App\Action\SchedulerTemplatesAction::class)->setName('scheduler-templates');
    $app->post('/scheduler/bookings/template', \App\Action\SchedulerBookingsTemplateAction::class)->setName('scheduler-bookings-template');
    $app->post('/scheduler/booking/template', \App\Action\SchedulerBookingTemplateAction::class)->setName('scheduler-booking-template');
    $app->post('/scheduler/booking/template/delete', \App\Action\SchedulerBookingDeleteTemplateAction::class)->setName('scheduler-booking-template-delete');

    //EMPLOYEES
    $app->get('/employees', \App\Action\EmployeesAction::class)->setName('employees');
    $app->get('/employee/{emp_id}', \App\Action\EmployeeFetchAction::class)->setName('emp-fetch');

    $app->get('/empdets/{name}', \App\Action\EmployeeNameFetchAction::class)->setName('empdets-fetch');

    $app->get('/employees/{trade_types}', \App\Action\EmployeesFetchTradesAction::class)->setName('employees-fetch-trades');
    $app->post('/emps/check', \App\Action\EmployeesCheckTradesAction::class)->setName('emps-check-trades');
    $app->post('/employee', \App\Action\EmployeeAddAction::class)->setName('employee-add');
    $app->post('/employee/{emp_id}', \App\Action\EmployeeUpdateAction::class)->setName('employee-update');

    $app->get('/employees/auto/{term}', \App\Action\EmployeesFetchAutoAction::class)->setName('employees-auto');

    //TRAVEL
    $app->post('/travel/save', \App\Action\TravelAddAction::class)->setName('travel-add');
    $app->get('/travel/{td_swing}', \App\Action\TravelFetchAction::class)->setName('travel-fetch');
    $app->post('/travel/delete/{td_id}', \App\Action\TravelDeleteAction::class)->setName('travel-delete');

    //SKILLS
    $app->get('/skills', \App\Action\SkillsAction::class)->setName('skills');
    $app->post('/skill', \App\Action\SkillAddAction::class)->setName('skill-add');
    $app->get('/skill/{skill_id}', \App\Action\SkillFetchAction::class)->setName('skill-fetch');
    $app->post('/skill/{skill_id}', \App\Action\SkillUpdateAction::class)->setName('skill-update');

    //TRADES
    $app->get('/trades', \App\Action\TradesAction::class)->setName('trades');
    $app->get('/trade/{trade_id}', \App\Action\TradeFetchAction::class)->setName('trade-fetch');
    $app->post('/trade', \App\Action\TradeAddAction::class)->setName('trade-add');
    $app->post('/trade/{trade_id}', \App\Action\TradeUpdateAction::class)->setName('trade-update');

    //BOOKINGS
    $app->get('/bookings', \App\Action\BookingsAction::class)->setName('bookings');
    $app->get('/bookings/availability', \App\Action\BookingsAvailabilityAction::class)->setName('bookings-availability');
    $app->get('/bookings/request/{req_id}', \App\Action\BookingsRequestFetchAction::class)->setName('bookings-request-fetch');
    $app->get('/shifts/request/{req_id}', \App\Action\BookingsShiftsRequestFetchAction::class)->setName('bookings-shifts-request-fetch');
    $app->get('/bookings/{req_id}/{emp_id}', \App\Action\BookingsReqEmpFetchAction::class)->setName('bookings-req-emp-fetch');
    $app->get('/booking/{booking_id}', \App\Action\BookingFetchAction::class)->setName('booking-fetch');
    $app->get('/fetch/batch/{batch_id}', \App\Action\BookingsBatchFetchAction::class)->setName('bookings-batch-fetch');
    $app->post('/swing/delete/{swing_id}', \App\Action\BookingSwingDeleteAction::class)->setName('swing-delete');
    $app->get('/bkgs/shift/{shift_id}', \App\Action\BookingsShiftDetsFetchAction::class)->setName('bookings-shift-dets-fetch');
    $app->get('/bookings/emp/{emp_name}', \App\Action\BookingsShiftFetchAction::class)->setName('bookings-emp-fetch');
    $app->get('/newbookings/quote/{req_id}', \App\Action\BookingsNewQuoteFetchAction::class)->setName('bookings-new-quote-fetch');
    $app->post('/booking/add', \App\Action\BookingAddAction::class)->setName('booking-add');
    $app->post('/booking/update', \App\Action\BookingUpdateAction::class)->setName('booking-update');
    $app->post('/booking/delete', \App\Action\BookingDeleteAction::class)->setName('booking-delete');
    $app->post('/bookings/delete', \App\Action\BookingsDeleteAction::class)->setName('bookings-delete');
    $app->get('/bookings/conflict', \App\Action\BookingsConflictAction::class)->setName('bookings-conflict');
    $app->post('/booking/reschedule', \App\Action\BookingRescheduleAction::class)->setName('booking-reschedule');
    $app->post('/bkg/update', \App\Action\BookingUpdateDetsAction::class)->setName('bkg-update');

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

    $app->get('/quote/preview/{req_id}', \App\Action\QuotePreviewAction::class)->setName('quote-preview');

    //MESSAGES
    $app->get('/messages/{message_to}', \App\Action\MessagesFetchAction::class)->setName('messages-fetch');
    $app->post('/message/update', \App\Action\MessageUpdateAction::class)->setName('message-update');
    
    //EMAIL
    $app->post('/email/send', \App\Action\EmailSendAction::class)->setName('email-send');
    $app->post('/email/confirm', \App\Action\EmailConfirmAction::class)->setName('email-confirm');

    //FILE UPLOAD
    $app->post('/filepond/process', \App\Action\FilePondProcessAction::class);
    $app->delete('/filepond/revert', \App\Action\FilePondRevertAction::class);
    
    //API
    $app->post('/api/signin', \App\Action\ApiSigninAction::class)->setName('api-signin');
    $app->get('/api/employee', \App\Action\ApiEmployeeFetchAction::class)->setName('api-employee-fetch');
    $app->get('/api/shifts', \App\Action\ApiEmployeeShiftsFetchAction::class)->setName('api-employee-shifts-fetch');
    $app->get('/api/shift/{shift_id}', \App\Action\ApiEmployeeShiftFetchAction::class)->setName('api-employee-shift-fetch');
    $app->post('/api/booking/update', \App\Action\ApiBookingUpdateAction::class)->setName('api-booking-update');
    $app->get('/api/messages/{message_to}', \App\Action\ApiMessagesFetchAction::class)->setName('api-messages-fetch');
    $app->get('/api/test/{test_id}', \App\Action\ApiTestFetchAction::class)->setName('api-test-fetch');
    $app->post('/api/test/{test_id}', \App\Action\ApiTestUpdateAction::class)->setName('api-test-update');
    $app->post('/api/fcm/remove', \App\Action\ApiFcmRemoveAction::class)->setName('api-fcm-remove');
    $app->get('/api/travel/{td_swing}', \App\Action\ApiTravelFetchAction::class)->setName('api-travel-fetch');
    $app->post('/api/upload/files', \App\Action\UploadFilesAction::class)->setName('upload-files');

    //FCM FILES

    $app->post('/fcm/send', \App\Action\FcmSendAction::class)->setName('fcm-send');
    $app->post('/fcm/update/{message_id}', \App\Action\FcmUpdateAction::class)->setName('fcm-update');
    $app->post('/fcm/add', \App\Action\FcmAddAction::class)->setName('fcm-add');
    $app->post('/fcm/notify', \App\Action\FcmNotifyAction::class)->setName('fcm-notify');
    $app->get('/fcm/{message_to}', \App\Action\FcmFetchAction::class)->setName('fcm-fetch');
    //UTILITY
    $app->get('/emp/upload', \App\Action\EmpUploadAction::class)->setName('emp-upload');

};