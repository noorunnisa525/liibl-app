// Authentication

export const business_login = '/login';
export const create_account = 'register/business';
export const forgot_password = '/forgot_password';
export const phone_verification = '/verify_phone';
export const email_verification = '/verify_email';
export const resend_email_verification = '/resend_email_verification_otp';
export const resend_phone_verification = '/resend_phone_verification_otp';
export const reset_password = '/reset_password';
export const get_categories = '/get_categories';
export const get_sub_categories = '/get_sub_categories';
export const get_skills = '/get_skills';
export const change_password = '/change_password';
export const update_profile = '/business/update';
export const social_login = 'social_login';

//Subscription
export const add_subscription = '/add_subscription';
export const get_subscription = '/get_subscriptions';

//Job
export const create_job = '/jobs/create_job';

//Home
export const get_employees = '/get_employees';
export const view_employee_by_id = '/view_employee';
export const send_hire_invite = 'send_job_invite';

//MyJobs

export const posted_job = '/jobs/get_business_posted_jobs?page=';
export const active_job = '/jobs/get_business_active_jobs?page=';
export const invites_job = '/jobs/get_employee_invited_jobs?page=';
export const progress_job = '/jobs/get_business_inprogress_jobs?page=';
export const completed_job = '/jobs/get_business_completed_jobs?page=';
export const job_proposal = '/jobs/view_job_proposals?page=';
export const job_detail = '/jobs/view_job';
export const job_cancel = '/jobs/cancel_job';
export const start_job = '/jobs/start_job';
export const complete_job = '/jobs/complete_job';

//Review
export const business_review = '/review/business_review';
export const get_reviews = '/business/review';

//Cards
export const get_user_cards = '/card/get_user_cards';
export const add_cards = '/card/add_card';
export const delete_cards = '/card/delete_card';
export const default_card = '/card/default_card';

//Chat
export const find_chat = '/find-chat';
export const chat_list = 'get-chat?page=';
export const get_chat = '/get-current-chats?page=';
export const create_chat = '/create-chat';
export const add_message = '/add-message';

//Notification
export const get_notification = 'get_notifications';
