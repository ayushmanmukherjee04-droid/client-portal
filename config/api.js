// API Configuration
// Set USE_MOCK to false to connect to real backend
const USE_MOCK = false; // ✅ Enabled backend connection via Next.js proxy

const API_CONFIG = {
    // Real backend URL (proxied through Next.js to avoid CORS)
    BACKEND_URL: '/backend',

    // Local mock API (Next.js API routes)
    MOCK_URL: '',

    // Get the base URL based on USE_MOCK flag
    getBaseUrl() {
        return USE_MOCK ? this.MOCK_URL : this.BACKEND_URL;
    },

    // API endpoints - Matching backend manage-routes.js
    // Base: /api/AaaS/v1
    endpoints: {
        // Auth endpoints
        login: '/api/AaaS/v1/login',
        signup: '/api/AaaS/v1/signup',
        logout: '/api/AaaS/v1/logout',

        // User management endpoints
        getAllUser: '/api/AaaS/v1/user/all',
        userSignup: '/api/AaaS/user/v1', // Create new user (note: different path - user auth microservice)
        banUser: '/api/AaaS/v1/user/ban',
        unbanUser: '/api/AaaS/v1/user/unban',
        getBannedUser: '/api/AaaS/v1/user/banned',
        getActiveUser: '/api/AaaS/v1/user/active',
        getInactiveUser: '/api/AaaS/v1/user/inactive',
        getUserWithToken: '/api/AaaS/v1/token/user',
        getUserWithTokenByApp: '/api/AaaS/v1/token/app',

        // App management endpoints
        getUrlAndToken: '/api/AaaS/v1/getUrlAndToken',
        postAddApps: '/api/AaaS/v1/add',
        putUpdateApps: '/api/AaaS/v1/update', // Note: requires /:appId param
        getApp: '/api/AaaS/v1/all',
        getAppById: '/api/AaaS/v1', // Note: requires /:appId param
        deleteApp: '/api/AaaS/v1/:appId', // Note: requires /:appId param

        // Role management endpoints
        postCreateRole: '/api/AaaS/v1/role/create',
        putUpdateRole: '/api/AaaS/v1/role/update',
        deleteRole: '/api/AaaS/v1/role/delete',
        getRoles: '/api/AaaS/v1/role/all',
        postAssinRole: '/api/AaaS/v1/role/assign',
        putUpdateAssinRole: '/api/AaaS/v1/role/assign/update',
        deleteAssinRole: '/api/AaaS/v1/role/assign/delete',
        getAlluserWithAssinRoleByAppId: '/api/AaaS/v1/role/assign/app',

        // Secret management endpoints
        postAddAndUpdateSecret: '/api/AaaS/v1/app/secret',
        getSecret: '/api/AaaS/v1/app/get-secret',
    },

    // Get full URL for an endpoint
    getUrl(endpoint) {
        const baseUrl = this.getBaseUrl();
        return `${baseUrl}${this.endpoints[endpoint] || endpoint}`;
    }
};

export default API_CONFIG;
