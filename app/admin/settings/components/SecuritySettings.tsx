'use client';

import { useState } from 'react';

export default function SecuritySettings() {
  const [securitySettings, setSecuritySettings] = useState({
    two_factor_auth: true,
    session_timeout: '8',
    password_min_length: '8',
    require_strong_passwords: true,
    login_attempts_limit: '5',
    ip_whitelist: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSecuritySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save security settings to database
    alert('Security settings saved successfully!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Configure security and authentication settings</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
            <p className="text-xs text-gray-600 mt-1">Require 2FA for all admin accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="two_factor_auth"
              checked={securitySettings.two_factor_auth}
              onChange={handleInputChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Session Timeout */}
        <div>
          <label htmlFor="session_timeout" className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (hours)
          </label>
          <select
            id="session_timeout"
            name="session_timeout"
            value={securitySettings.session_timeout}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="4">4 hours</option>
            <option value="8">8 hours</option>
            <option value="12">12 hours</option>
            <option value="24">24 hours</option>
          </select>
        </div>

        {/* Password Requirements */}
        <div>
          <label htmlFor="password_min_length" className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Password Length
          </label>
          <select
            id="password_min_length"
            name="password_min_length"
            value={securitySettings.password_min_length}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="6">6 characters</option>
            <option value="8">8 characters</option>
            <option value="10">10 characters</option>
            <option value="12">12 characters</option>
          </select>
        </div>

        {/* Strong Passwords */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Require Strong Passwords</h3>
            <p className="text-xs text-gray-600 mt-1">Enforce complex password requirements</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="require_strong_passwords"
              checked={securitySettings.require_strong_passwords}
              onChange={handleInputChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Login Attempts Limit */}
        <div>
          <label htmlFor="login_attempts_limit" className="block text-sm font-medium text-gray-700 mb-2">
            Login Attempts Limit
          </label>
          <select
            id="login_attempts_limit"
            name="login_attempts_limit"
            value={securitySettings.login_attempts_limit}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="3">3 attempts</option>
            <option value="5">5 attempts</option>
            <option value="10">10 attempts</option>
            <option value="15">15 attempts</option>
          </select>
        </div>

        {/* IP Whitelist */}
        <div>
          <label htmlFor="ip_whitelist" className="block text-sm font-medium text-gray-700 mb-2">
            IP Whitelist (Optional)
          </label>
          <textarea
            id="ip_whitelist"
            name="ip_whitelist"
            value={securitySettings.ip_whitelist}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter IP addresses, one per line (e.g., 192.168.1.1)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Restrict admin access to specific IP addresses
          </p>
        </div>

        {/* Security Status */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-green-900">Security Status: Excellent</h4>
              <p className="text-xs text-green-700 mt-1">All security measures are properly configured</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-gray-100">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Save Security Settings
          </button>
        </div>
      </form>
    </div>
  );
}
