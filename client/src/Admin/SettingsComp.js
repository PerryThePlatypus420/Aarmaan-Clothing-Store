import React, { useState, useEffect } from 'react';
import { useSettings } from '../settingsContext';

const API_URL = process.env.REACT_APP_API_URL;

const SettingsComp = ({ onBack }) => {
    const { refreshSettings } = useSettings();
    const [settings, setSettings] = useState({
        freeDeliveryThreshold: null,
        deliveryFee: 250
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/api/settings`);
            if (!response.ok) {
                throw new Error('Failed to fetch settings');
            }
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setMessage('Error loading settings');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        setMessage('');
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    freeDeliveryThreshold: settings.freeDeliveryThreshold,
                    deliveryFee: settings.deliveryFee
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update settings');
            }

            const data = await response.json();
            setSettings(data.settings);
            setMessage('Settings updated successfully!');
            setMessageType('success');
            
            // Refresh global settings
            refreshSettings();
        } catch (error) {
            console.error('Error updating settings:', error);
            setMessage('Error updating settings');
            setMessageType('error');
        } finally {
            setSaving(false);
        }
    };

    const handleThresholdChange = (e) => {
        const value = e.target.value;
        setSettings({
            ...settings,
            freeDeliveryThreshold: value === '' ? null : parseFloat(value)
        });
    };

    const handleDeliveryFeeChange = (e) => {
        const value = e.target.value;
        setSettings({
            ...settings,
            deliveryFee: value === '' ? 0 : parseFloat(value)
        });
    };

    const handleEnableFreeDelivery = (enabled) => {
        if (!enabled) {
            setSettings({
                ...settings,
                freeDeliveryThreshold: null
            });
        } else {
            setSettings({
                ...settings,
                freeDeliveryThreshold: 2500 // Default threshold
            });
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-secondary" onClick={onBack}>
                    Back to Dashboard
                </button>
            </div>

            {message && (
                <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                    {message}
                    <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                </div>
            )}

            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-dark text-white">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-shipping-fast me-2"></i>
                                Delivery Settings
                            </h5>
                        </div>
                        <div className="card-body">
                            {/* Current Configuration */}
                            <div className="mb-4">
                                <div className="form-check form-switch">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="enableFreeDelivery"
                                        checked={settings.freeDeliveryThreshold !== null}
                                        onChange={(e) => handleEnableFreeDelivery(e.target.checked)}
                                    />
                                    <label className="form-check-label fw-bold" htmlFor="enableFreeDelivery">
                                        Enable Free Delivery Threshold
                                    </label>
                                </div>
                                <small className="text-muted">
                                    When enabled, customers will get free delivery when their order exceeds the specified amount.
                                    {settings.freeDeliveryThreshold === null && (
                                        <> When disabled, the standard delivery fee will apply to all orders.</>
                                    )}
                                </small>
                            </div>

                            {settings.freeDeliveryThreshold !== null && (
                                <div className="mb-4">
                                    <label htmlFor="thresholdAmount" className="form-label fw-bold">
                                        Free Delivery Threshold Amount (Rs.)
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text">Rs.</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="thresholdAmount"
                                            value={settings.freeDeliveryThreshold || ''}
                                            onChange={handleThresholdChange}
                                            min="0"
                                            step="1"
                                            placeholder="Enter minimum amount for free delivery"
                                        />
                                    </div>
                                    <small className="text-muted">
                                        Customers will get free delivery when their order total is equal to or greater than this amount.
                                    </small>
                                </div>
                            )}

                            {/* Delivery Fee Configuration */}
                            <div className="mb-4">
                                <label htmlFor="deliveryFee" className="form-label fw-bold">
                                    Standard Delivery Fee (Rs.)
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text">Rs.</span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="deliveryFee"
                                        value={settings.deliveryFee || ''}
                                        onChange={handleDeliveryFeeChange}
                                        min="0"
                                        step="1"
                                        placeholder="Enter delivery fee"
                                    />
                                </div>
                                <small className="text-muted">
                                    This amount will be charged for delivery when free delivery is not applicable.
                                </small>
                            </div>

                            <div className="d-grid">
                                <button 
                                    className="btn btn-primary btn-lg"
                                    onClick={handleSaveSettings}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Saving Settings...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save me-2"></i>
                                            Save Settings
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="card shadow-sm mt-4">
                        <div className="card-header bg-light">
                            <h6 className="card-title mb-0">
                                <i className="fas fa-eye me-2"></i>
                                Preview
                            </h6>
                        </div>
                        <div className="card-body">
                            <p className="mb-2"><strong>Current Configuration:</strong></p>
                            {settings.freeDeliveryThreshold !== null ? (
                                <div className="alert alert-info mb-3">
                                    <i className="fas fa-check-circle me-2"></i>
                                    Free delivery is <strong>enabled</strong> for orders of Rs. {settings.freeDeliveryThreshold?.toLocaleString()} or more.
                                </div>
                            ) : (
                                <div className="alert alert-warning mb-3">
                                    <i className="fas fa-times-circle me-2"></i>
                                    Free delivery is <strong>disabled</strong>.
                                </div>
                            )}
                            <div className="alert alert-secondary mb-0">
                                <i className="fas fa-truck me-2"></i>
                                Standard delivery fee: <strong>Rs. {settings.deliveryFee?.toLocaleString()}</strong>
                                <small className="d-block mt-1 text-muted">
                                    This fee applies when free delivery conditions are not met.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsComp;
