import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ReloadButton from '@/components/ReloadButton';
import { 
  User, 
  Edit3, 
  Camera, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Heart,
  Activity,
  Pill,
  FileText,
  Save,
  X
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Medical Center Dr, Health City, HC 12345',
    dateOfBirth: '1985-06-15',
    bloodType: 'O+',
    height: '5\'10"',
    weight: '175 lbs',
    emergencyContact: 'Jane Doe - +1 (555) 987-6543',
    allergies: 'Penicillin, Shellfish',
    medications: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
    medicalHistory: 'Hypertension (2018), Type 2 Diabetes (2020)'
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to a backend
    console.log('Profile saved:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  const vitals = [
    { label: 'Blood Pressure', value: '120/80 mmHg', icon: Heart, color: 'text-red-500' },
    { label: 'Heart Rate', value: '72 BPM', icon: Activity, color: 'text-green-500' },
    { label: 'BMI', value: '24.2', icon: Activity, color: 'text-blue-500' },
    { label: 'Last Checkup', value: 'Dec 15, 2024', icon: Calendar, color: 'text-purple-500' }
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Profile Header */}
      <div className="bg-card rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-primary-foreground" />
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors">
                <Camera className="w-4 h-4 text-accent-foreground" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-black">Patient ID: #MED-2024-001</p>
              <p className="text-black">Member since: January 2024</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <ReloadButton 
              componentKey="profile-data" 
              onReload={() => {
                // Refresh profile data from server
                console.log('Reloading profile data...');
              }}
              size="sm"
            />
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleSave}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {vitals.map((vital, index) => {
            const Icon = vital.icon;
            return (
              <div key={index} className="bg-muted rounded-xl p-4 text-center">
                <Icon className={`w-6 h-6 mx-auto mb-2 ${vital.color}`} />
                <p className="text-sm text-gray-500">{vital.label}</p>
                <p className="font-semibold text-card-foreground">{vital.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-card rounded-2xl p-6">
          <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-card-foreground">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-black">{profileData.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-card-foreground">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-black">{profileData.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-card-foreground flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-black">{profileData.email}</p>
              )}
            </div>

            <div>
              <Label className="text-card-foreground flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </Label>
              {isEditing ? (
                <Input
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-black">{profileData.phone}</p>
              )}
            </div>

            <div>
              <Label className="text-card-foreground flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Address
              </Label>
              {isEditing ? (
                <Input
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-black">{profileData.address}</p>
              )}
            </div>

            <div>
              <Label className="text-card-foreground flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Date of Birth
              </Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-black">
                  {new Date(profileData.dateOfBirth).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-card rounded-2xl p-6">
          <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Medical Information
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-card-foreground">Blood Type</Label>
                {isEditing ? (
                  <Input
                    value={profileData.bloodType}
                    onChange={(e) => handleInputChange('bloodType', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-black">{profileData.bloodType}</p>
                )}
              </div>
              <div>
                <Label className="text-card-foreground">Height</Label>
                {isEditing ? (
                  <Input
                    value={profileData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-black">{profileData.height}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-card-foreground">Weight</Label>
              {isEditing ? (
                <Input
                  value={profileData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-black">{profileData.weight}</p>
              )}
            </div>

            <div>
              <Label className="text-card-foreground">Emergency Contact</Label>
              {isEditing ? (
                <Input
                  value={profileData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-black">{profileData.emergencyContact}</p>
              )}
            </div>

            <div>
              <Label className="text-card-foreground">Allergies</Label>
              {isEditing ? (
                <Input
                  value={profileData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-black">{profileData.allergies}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Medical History & Medications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6">
          <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center">
            <Pill className="w-5 h-5 mr-2" />
            Current Medications
          </h2>
          {isEditing ? (
            <textarea
              value={profileData.medications}
              onChange={(e) => handleInputChange('medications', e.target.value)}
              className="w-full h-32 p-3 border rounded-lg resize-none"
              placeholder="List current medications..."
            />
          ) : (
            <p className="text-black">{profileData.medications}</p>
          )}
        </div>

        <div className="bg-card rounded-2xl p-6">
          <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Medical History
          </h2>
          {isEditing ? (
            <textarea
              value={profileData.medicalHistory}
              onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
              className="w-full h-32 p-3 border rounded-lg resize-none"
              placeholder="Medical history and conditions..."
            />
          ) : (
            <p className="text-black">{profileData.medicalHistory}</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-2xl p-6">
        <h2 className="text-xl font-bold text-card-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
            <FileText className="w-6 h-6 mb-2" />
            Download Medical Records
          </Button>
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
            <Calendar className="w-6 h-6 mb-2" />
            Schedule Appointment
          </Button>
          <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
            <Heart className="w-6 h-6 mb-2" />
            View Health Reports
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

