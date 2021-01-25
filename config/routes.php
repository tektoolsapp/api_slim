<?php

use Slim\App;

return function (App $app) {
    //HOME
    $app->get('/', \App\Action\HomeAction::class)->setName('home');

    $app->get('/users', \App\Action\UserListAction::class)->setName('user-list');
    $app->get('/users/{id}', \App\Action\UserReadAction::class)->setName('users-get');
    $app->post('/users', \App\Action\UserCreateAction::class)->setName('user-post');
    $app->get('/hello', \App\Action\HelloAction::class);

    //SCHEDULER
    $app->get('/scheduler', \App\Action\SchedulerAction::class)->setName('scheduler');
    $app->get('/scheduler/filter', \App\Action\SchedulerFilterAction::class)->setName('scheduler-filter');

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
    $app->get('/bookings/quote/{req_id}', \App\Action\BookingsQuoteFetchAction::class)->setName('bookings-quote-fetch');
    $app->post('/booking/add', \App\Action\BookingAddAction::class)->setName('booking-add');
    $app->post('/booking/update', \App\Action\BookingUpdateAction::class)->setName('booking-update');
    $app->post('/booking/delete', \App\Action\BookingDeleteAction::class)->setName('booking-delete');

    //CUSTOMERS
    $app->get('/customers', \App\Action\CustomersAction::class)->setName('customers');
    $app->get('/customers/auto', \App\Action\CustomersAutoAction::class)->setName('customers-auto');
    $app->get('/customer/name', \App\Action\CustomerNameAction::class)->setName('customer-name');
    $app->post('/customer', \App\Action\CustomerAddAction::class)->setName('customer-add');
    $app->get('/customer/{cust_id}', \App\Action\CustomerFetchAction::class)->setName('customer-fetch');
    $app->post('/customer/{cust_id}', \App\Action\CustomerUpdateAction::class)->setName('customer-update');

    //WORKSPACE
    $app->get('/workspace', \App\Action\WorkspaceAction::class)->setName('workspace');

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
    $app->post('/email/send', \App\Action\EmailSendAction::class)->setName('email-send');

    //FILE UPLOAD
    $app->post('/filepond/process', \App\Action\FilePondProcessAction::class);
    $app->delete('/filepond/revert', \App\Action\FilePondRevertAction::class);



};