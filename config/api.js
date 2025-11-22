// API Configuration
// Set USE_MOCK to false to connect to real backend
const USE_MOCK = true; // ⬅️ Changed to true temporarily until CORS is fixed

const API_CONFIG = {
    // Real backend URL
    BACKEND_URL: 'https://721bms2s-8000.inc1.devtunnels.ms',

    // Local mock API (Next.js API routes)
    MOCK_URL: '',

    // Get the base URL based on USE_MOCK flag
    getBaseUrl() {
        return USE_MOCK ? this.MOCK_URL : this.BACKEND_URL;
    },

    // API endpoints - All endpoints from backend spec
    endpoints: {
        // Auth endpoints
        login: '/api/auth/login',
        signup: '/api/auth/signup',
        logout: '/api/auth/logout',

        // User management endpoints
        getAllUser: '/api/manage/getAllUser',
        banUser: '/api/manage/banUser',
        unbanUser: '/api/manage/unbanUser',
        getBannedUser: '/api/manage/getBannedUser',
        getActiveUser: '/api/manage/getActiveUser',
        getInactiveUser: '/api/manage/getInactiveUser',
        getUserWithToken: '/api/manage/getUserWithToken',
        getUserWithTokenByApp: '/api/manage/getUserWithTokenByApp',

        // App management endpoints
        getUrlAndToken: '/api/manage/getUrlAndToken',
        postAddApps: '/api/manage/postAddApps',
        putUpdateApps: '/api/manage/putUpdateApps',
        getApp: '/api/manage/getApp',
        getAppById: '/api/manage/getAppById',
        deleteApp: '/api/manage/deleteApp',

        // Role management endpoints
        postCreateRole: '/api/manage/postCreateRole',
        putUpdateRole: '/api/manage/putUpdateRole',
        deleteRole: '/api/manage/deleteRole',
        getRoles: '/api/manage/getRoles',
        postAssinRole: '/api/manage/postAssinRole',
        putUpdateAssinRole: '/api/manage/putUpdateAssinRole',
        deleteAssinRole: '/api/manage/deleteAssinRole',
        getAlluserWithAssinRoleByAppId: '/api/manage/getAlluserWithAssinRoleByAppId',

        // Secret management endpoints
        postAddAndUpdateSecret: '/api/manage/postAddAndUpdateSecret',
        getSecret: '/api/manage/getSecret',
    },

    // Get full URL for an endpoint
    getUrl(endpoint) {
        const baseUrl = this.getBaseUrl();
        return `${baseUrl}${this.endpoints[endpoint] || endpoint}`;
    }
};

export default API_CONFIG;
