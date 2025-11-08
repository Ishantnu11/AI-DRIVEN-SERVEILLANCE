import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import { api, Sensor } from '../services/api';

function Settings() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  const [showSensorModal, setShowSensorModal] = useState(false);
  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch settings
  const { data: settings = {}, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: api.getSettings,
  });

  // Fetch sensors
  const { data: sensors = [], isLoading: sensorsLoading, refetch: refetchSensors } = useQuery({
    queryKey: ['sensors'],
    queryFn: api.getSensors,
  });

  // Local state for form data
  const [formData, setFormData] = useState({
    systemName: settings.systemName || 'AI Surveillance System',
    dataRetention: settings.dataRetention || '90',
    alertThreshold: settings.alertThreshold || 0.7,
    autoExport: settings.autoExport ?? true,
    emailNotifications: settings.emailNotifications ?? true,
    smsNotifications: settings.smsNotifications ?? false,
    pushNotifications: settings.pushNotifications ?? true,
    alertEmail: settings.alertEmail || '',
    alertSms: settings.alertSms || '',
    lowThreshold: settings.lowThreshold || 0.3,
    mediumThreshold: settings.mediumThreshold || 0.6,
    highThreshold: settings.highThreshold || 0.8,
    criticalThreshold: settings.criticalThreshold || 0.9,
    alertCooldown: settings.alertCooldown || 300,
    enableSoundAlerts: settings.enableSoundAlerts ?? true,
    enableVisualAlerts: settings.enableVisualAlerts ?? true,
  });

  // Sensor form data
  const [sensorForm, setSensorForm] = useState({
    id: '',
    name: '',
    type: 'video' as 'video' | 'audio' | 'iot',
    location: '',
    sensitivity: 0.5,
  });

  // Update form data when settings load
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData({
        systemName: settings.systemName || 'AI Surveillance System',
        dataRetention: settings.dataRetention || '90',
        alertThreshold: settings.alertThreshold || 0.7,
        autoExport: settings.autoExport ?? true,
        emailNotifications: settings.emailNotifications ?? true,
        smsNotifications: settings.smsNotifications ?? false,
        pushNotifications: settings.pushNotifications ?? true,
        alertEmail: settings.alertEmail || '',
        alertSms: settings.alertSms || '',
        lowThreshold: settings.lowThreshold || 0.3,
        mediumThreshold: settings.mediumThreshold || 0.6,
        highThreshold: settings.highThreshold || 0.8,
        criticalThreshold: settings.criticalThreshold || 0.9,
        alertCooldown: settings.alertCooldown || 300,
        enableSoundAlerts: settings.enableSoundAlerts ?? true,
        enableVisualAlerts: settings.enableVisualAlerts ?? true,
      });
    }
  }, [settings]);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: api.saveSettings,
    onSuccess: () => {
      setSaving(false);
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setTimeout(() => setSaveMessage(null), 3000);
    },
    onError: () => {
      setSaving(false);
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
      setTimeout(() => setSaveMessage(null), 3000);
    },
  });

  // Create sensor mutation
  const createSensorMutation = useMutation({
    mutationFn: api.createSensor,
    onSuccess: () => {
      setShowSensorModal(false);
      setSensorForm({ id: '', name: '', type: 'video', location: '', sensitivity: 0.5 });
      refetchSensors();
    },
  });

  // Update sensor mutation
  const updateSensorMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Sensor> }) => api.updateSensor(id, data),
    onSuccess: () => {
      setShowSensorModal(false);
      setEditingSensor(null);
      setSensorForm({ id: '', name: '', type: 'video', location: '', sensitivity: 0.5 });
      refetchSensors();
    },
  });

  // Delete sensor mutation
  const deleteSensorMutation = useMutation({
    mutationFn: api.deleteSensor,
    onSuccess: () => {
      refetchSensors();
    },
  });

  const handleSaveSettings = async () => {
    setSaving(true);
    saveSettingsMutation.mutate(formData);
  };

  const handleAddSensor = () => {
    setEditingSensor(null);
    setSensorForm({ id: '', name: '', type: 'video', location: '', sensitivity: 0.5 });
    setShowSensorModal(true);
  };

  const handleEditSensor = (sensor: Sensor) => {
    setEditingSensor(sensor);
    setSensorForm({
      id: sensor.id,
      name: sensor.name,
      type: sensor.type,
      location: sensor.location,
      sensitivity: sensor.sensitivity,
    });
    setShowSensorModal(true);
  };

  const handleDeleteSensor = async (sensorId: string) => {
    if (window.confirm('Are you sure you want to delete this sensor?')) {
      deleteSensorMutation.mutate(sensorId);
    }
  };

  const handleSaveSensor = () => {
    if (!sensorForm.name || !sensorForm.location) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingSensor) {
      updateSensorMutation.mutate({ id: editingSensor.id, data: sensorForm });
    } else {
      createSensorMutation.mutate(sensorForm);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return 'bg-green-500';
    if (status === 'warning') return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getTypeIcon = (type: string) => {
    if (type === 'video') return 'videocam';
    if (type === 'audio') return 'mic';
    return 'sensors';
  };

  const tabs = ['general', 'sensors', 'alerts', 'notifications'];
  
  return (
    <div className="min-h-screen text-gray-900 animate-fadeIn" style={{ backgroundColor: '#FFF2E0' }}>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 animate-slideDown">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure system preferences and sensor management</p>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Save Message */}
        {saveMessage && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              saveMessage.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6 animate-slideUp">
            <Card title="System Configuration">
              <div className="space-y-4">
                <Input
                  label="System Name"
                  value={formData.systemName}
                  onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                  icon="settings"
                  placeholder="Enter system name"
                />
                <Select
                  label="Data Retention (Days)"
                  value={formData.dataRetention}
                  onChange={(e) => setFormData({ ...formData, dataRetention: e.target.value })}
                  options={[
                    { value: '30', label: '30 Days' },
                    { value: '60', label: '60 Days' },
                    { value: '90', label: '90 Days' },
                    { value: '180', label: '180 Days' },
                    { value: '365', label: '365 Days' },
                  ]}
                />
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="autoExport"
                    checked={formData.autoExport}
                    onChange={(e) => setFormData({ ...formData, autoExport: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="autoExport" className="text-sm font-medium text-gray-700">
                    Enable automatic data export
                  </label>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <Button
                variant="primary"
                onClick={handleSaveSettings}
                disabled={saving || settingsLoading}
                icon={saving ? 'hourglass_empty' : 'save'}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}

        {/* Sensors Tab */}
        {activeTab === 'sensors' && (
          <div className="space-y-6 animate-slideUp">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Sensor Management</h2>
              <Button variant="primary" onClick={handleAddSensor} icon="add">
                Add Sensor
              </Button>
            </div>

            {sensorsLoading ? (
              <div className="text-center py-8 text-gray-600">Loading sensors...</div>
            ) : sensors.length === 0 ? (
              <Card>
                <div className="text-center py-8 text-gray-600">
                  <span className="material-symbols-outlined text-4xl mb-2 block">sensors_off</span>
                  <p>No sensors configured</p>
                  <Button variant="primary" onClick={handleAddSensor} className="mt-4" icon="add">
                    Add Your First Sensor
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sensors.map((sensor) => (
                  <Card key={sensor.id} className="hover-lift">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-purple-600">
                            {getTypeIcon(sensor.type)}
                          </span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{sensor.name}</h3>
                            <p className="text-xs text-gray-500">{sensor.id}</p>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${getStatusBadge(sensor.status)} animate-pulse`}></div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Type:</span> {sensor.type.toUpperCase()}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Location:</span> {sensor.location}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Sensitivity:</span> {(sensor.sensitivity * 100).toFixed(0)}%
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Status:</span>{' '}
                          <span className={`capitalize ${sensor.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                            {sensor.status}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSensor(sensor)}
                          className="flex-1"
                          icon="edit"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSensor(sensor.id)}
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          icon="delete"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6 animate-slideUp">
            <Card title="Alert Configuration">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Alert Threshold
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.alertThreshold}
                    onChange={(e) => setFormData({ ...formData, alertThreshold: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span className="font-medium text-purple-600">
                      {(formData.alertThreshold * 100).toFixed(0)}%
                    </span>
                    <span>High</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Low Threshold</label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.lowThreshold}
                      onChange={(e) =>
                        setFormData({ ...formData, lowThreshold: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medium Threshold</label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.mediumThreshold}
                      onChange={(e) =>
                        setFormData({ ...formData, mediumThreshold: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">High Threshold</label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.highThreshold}
                      onChange={(e) =>
                        setFormData({ ...formData, highThreshold: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Critical Threshold</label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.criticalThreshold}
                      onChange={(e) =>
                        setFormData({ ...formData, criticalThreshold: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alert Cooldown (seconds)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.alertCooldown}
                    onChange={(e) =>
                      setFormData({ ...formData, alertCooldown: parseInt(e.target.value) || 0 })
                    }
                    placeholder="300"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum time between alerts from the same source
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="enableSoundAlerts"
                      checked={formData.enableSoundAlerts}
                      onChange={(e) => setFormData({ ...formData, enableSoundAlerts: e.target.checked })}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="enableSoundAlerts" className="text-sm font-medium text-gray-700">
                      Enable sound alerts
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="enableVisualAlerts"
                      checked={formData.enableVisualAlerts}
                      onChange={(e) => setFormData({ ...formData, enableVisualAlerts: e.target.checked })}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="enableVisualAlerts" className="text-sm font-medium text-gray-700">
                      Enable visual alerts
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <Button
                variant="primary"
                onClick={handleSaveSettings}
                disabled={saving}
                icon={saving ? 'hourglass_empty' : 'save'}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-slideUp">
            <Card title="Notification Preferences">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={(e) =>
                        setFormData({ ...formData, emailNotifications: e.target.checked })
                      }
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                      Enable email notifications
                    </label>
                  </div>
                  {formData.emailNotifications && (
                    <Input
                      label="Alert Email Address"
                      type="email"
                      value={formData.alertEmail}
                      onChange={(e) => setFormData({ ...formData, alertEmail: e.target.value })}
                      placeholder="alerts@example.com"
                      icon="email"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="smsNotifications"
                      checked={formData.smsNotifications}
                      onChange={(e) => setFormData({ ...formData, smsNotifications: e.target.checked })}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="smsNotifications" className="text-sm font-medium text-gray-700">
                      Enable SMS notifications
                    </label>
                  </div>
                  {formData.smsNotifications && (
                    <Input
                      label="Alert Phone Number"
                      type="tel"
                      value={formData.alertSms}
                      onChange={(e) => setFormData({ ...formData, alertSms: e.target.value })}
                      placeholder="+1234567890"
                      icon="phone"
                    />
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    checked={formData.pushNotifications}
                    onChange={(e) => setFormData({ ...formData, pushNotifications: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="pushNotifications" className="text-sm font-medium text-gray-700">
                    Enable push notifications
                  </label>
                </div>
              </div>
            </Card>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="primary"
                onClick={handleSaveSettings}
                disabled={saving}
                icon={saving ? 'hourglass_empty' : 'save'}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </main>
      
      {/* Sensor Modal */}
      <Modal
        isOpen={showSensorModal}
        onClose={() => {
          setShowSensorModal(false);
          setEditingSensor(null);
          setSensorForm({ id: '', name: '', type: 'video', location: '', sensitivity: 0.5 });
        }}
        title={editingSensor ? 'Edit Sensor' : 'Add New Sensor'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Sensor Name"
            value={sensorForm.name}
            onChange={(e) => setSensorForm({ ...sensorForm, name: e.target.value })}
            placeholder="e.g., Main Entrance Camera"
            icon="label"
          />
          <Select
            label="Sensor Type"
            value={sensorForm.type}
            onChange={(e) =>
              setSensorForm({ ...sensorForm, type: e.target.value as 'video' | 'audio' | 'iot' })
            }
            options={[
              { value: 'video', label: 'Video Camera' },
              { value: 'audio', label: 'Audio Sensor' },
              { value: 'iot', label: 'IoT Sensor' },
            ]}
          />
          <Input
            label="Location"
            value={sensorForm.location}
            onChange={(e) => setSensorForm({ ...sensorForm, location: e.target.value })}
            placeholder="e.g., Main Entrance"
            icon="location_on"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sensitivity: {(sensorForm.sensitivity * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={sensorForm.sensitivity}
              onChange={(e) =>
                setSensorForm({ ...sensorForm, sensitivity: parseFloat(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowSensorModal(false);
                setEditingSensor(null);
                setSensorForm({ id: '', name: '', type: 'video', location: '', sensitivity: 0.5 });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSaveSensor}
              disabled={createSensorMutation.isPending || updateSensorMutation.isPending}
              icon={editingSensor ? 'save' : 'add'}
            >
              {createSensorMutation.isPending || updateSensorMutation.isPending
                ? 'Saving...'
                : editingSensor
                ? 'Update Sensor'
                : 'Add Sensor'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Settings;
