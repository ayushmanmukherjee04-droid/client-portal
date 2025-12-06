// API Client Utility
// Helper functions for making authenticated API calls

import API_CONFIG from '../config/api';

/**
 * Get the access token from cookies
 */
export function getAccessToken() {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
    return match ? match[2] : null;
}

/**
 * Make an authenticated API request
 * @param {string} endpoint - The endpoint key from API_CONFIG.endpoints
 * @param {object} options - Fetch options (method, body, etc.)
 */
export async function apiRequest(endpoint, options = {}) {
    let url = API_CONFIG.getUrl(endpoint);

    // Handle URL parameters (e.g. :appId)
    if (options.params) {
        Object.keys(options.params).forEach(key => {
            url = url.replace(`:${key}`, options.params[key]);
        });
    }

    const token = getAccessToken();

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && {
                'Authorization': `Bearer ${token}`,
                'token': token
            }),
            ...options.headers,
        },
        credentials: 'include',
    };

    const fetchOptions = {
        ...defaultOptions,
        ...options,
        headers: { ...defaultOptions.headers, ...options.headers },
    };

    try {
        const response = await fetch(url, fetchOptions);
        const data = await response.json();

        if (data.status === 'success' || response.ok) {
            return { success: true, data: data.data || data, message: data.message };
        } else {
            return { success: false, error: data.message || 'Request failed', data: null };
        }
    } catch (error) {
        return { success: false, error: error.message || 'Network error', data: null };
    }
}

/**
 * GET request helper
 */
export async function apiGet(endpoint) {
    return apiRequest(endpoint, { method: 'GET' });
}

/**
 * POST request helper
 */
export async function apiPost(endpoint, body) {
    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

/**
 * PUT request helper
 */
export async function apiPut(endpoint, body, params) {
    return apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
        params: params
    });
}

/**
 * DELETE request helper
 */
export async function apiDelete(endpoint, body, params) {
    return apiRequest(endpoint, {
        method: 'DELETE',
        body: body ? JSON.stringify(body) : undefined,
        params: params
    });
}
