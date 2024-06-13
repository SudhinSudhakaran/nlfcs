export default {

  // dev : 54.254.176.206
  // new production ip : 18.138.180.139

  BASE_URL: 'http://18.138.180.139',

  ENDPOINTS: {
    LOGIN: '/api/login',
    ACCOUNT: '/api/account',
    TRANSACTION: '/api/transactions',
    SHARE_TRANSACTION: '/api/share_capital_transactions',

    BENEFIT: '/api/benefits',
    CHANGE_PASSWORD: '/api/change_password',
    RESET_PASSWORD: '/api/reset_password',
    LOANS: '/api/loans',
    DOCUMENT_TYPES: '/api/document_types',
    SEARCH_MEMBER_ID: '/api/search_member?member_id',
    UPLOAD_DOCUMENT: '/api/upload_document',
    VERIFY_2FA: '/api/2fa/login',
    DOCUMENTS: '/api/documents',
    ANNOUNCEMENTS: '/api/announcements',
    NOTIFICATIONS: '/api/notifications',
    CREATE_TICKET: '/api/tickets/create_ticket',
    MY_TICKET: '/api/tickets/my_tickets',
    REPLY_TICKET: '/api/tickets/reply_ticket/',
    READ_NOTIFICATION: '/api/notification/',
    FDR: '/api/fdrs',
  },
  KEYS: {
    ACCOUNT_NUMBER: 'account_number',
    PASSWORD: 'password',
    OLD_PASSWORD: 'oldpassword',
    NEW_PASSWORD: 'password',
    CONFIRM_PASSWORD: 'password_confirmation',
    MEMBER_ID: 'member_id',
    DOCUMENT_NAME: 'document_name',
    DOCUMENT_TYPE_ID: 'document_type_id',
    DOCUMENT: 'document',
    DOCUMENT_ARRAY: 'document[]',
    USER_ID: 'user_id',
    ONE_TIME_PASSWORD: 'one_time_password',
    SUBJECT: 'subject',
    MESSAGE: 'message',
    ATTACHMENT: 'attachment',
    STATUS: 'status',
    GOOGLE_2FA_SECRET: 'google2fa_secret',
  },
};
