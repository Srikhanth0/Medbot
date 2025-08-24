import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ToggleSwitch from '@/components/ToggleSwitch';

const SettingsPage: React.FC = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567'
  });

  const handleManageData = () => {
    console.log('Manage data sharing');
  };

  const handleUpdatePrivacy = () => {
    console.log('Update privacy settings');
  };

  const handleUpdatePersonal = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  const handleSaveProfile = () => {
    console.log('Saving profile data:', profileData);
    setIsEditingProfile(false);
  };

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = () => {
    console.log('Change password');
  };

  const handleDeleteAccount = () => {
    console.log('Delete account');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Notifications Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Notifications</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Push Notifications</h3>
              <p className="text-white">
                Enable or Disable push notification for Important updates and alerts
              </p>
            </div>
            <ToggleSwitch
              checked={pushNotifications}
              onChange={setPushNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Email Notifications</h3>
              <p className="text-white">
                Choose how often you receive email notifications about your health Data
              </p>
            </div>
            <ToggleSwitch
              checked={emailNotifications}
              onChange={setEmailNotifications}
            />
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Privacy</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Data Sharing</h3>
              <p className="text-white">
                Manage Who can access your health data and reports
              </p>
            </div>
            <Button
              onClick={handleManageData}
              className="bg-blue-500 text-white px-8 py-2 rounded-full"
            >
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Privacy Settings</h3>
              <p className="text-white">
                Manage Who can access your health data and reports
              </p>
            </div>
            <Button
              onClick={handleUpdatePrivacy}
              className="bg-blue-500 text-white px-8 py-2 rounded-full"
            >
              Update
            </Button>
          </div>
        </div>
      </section>

      {/* Account Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Account</h2>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Personal Information</h3>
                <p className="text-white">
                  update your personal information
                </p>
              </div>
              <Button
                onClick={handleUpdatePersonal}
                className="bg-blue-500 text-white px-8 py-2 rounded-full"
              >
                {isEditingProfile ? 'Cancel' : 'Edit'}
              </Button>
            </div>
            
            {isEditingProfile && (
              <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-card-foreground">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleProfileInputChange('firstName', e.target.value)}
                      className="mt-1 bg-gray-500 text-white border-gray-400 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-card-foreground">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleProfileInputChange('lastName', e.target.value)}
                      className="mt-1 bg-gray-500 text-white border-gray-400 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-card-foreground">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileInputChange('email', e.target.value)}
                      className="mt-1 bg-gray-500 text-white border-gray-400 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-card-foreground">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                      className="mt-1 bg-gray-500 text-white border-gray-400 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => setIsEditingProfile(false)}
                    variant="outline"
                    className="px-6 py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Change Password</h3>
              <p className="text-white">
                Change your account password
              </p>
            </div>
            <Button
              onClick={handleChangePassword}
              className="bg-blue-500 text-white px-8 py-2 rounded-full"
            >
              Change
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Delete Password</h3>
              <p className="text-white">
                Delete your account and all associate data
              </p>
            </div>
            <Button
              onClick={handleDeleteAccount}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 py-2 rounded-full"
            >
              Delete
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;

