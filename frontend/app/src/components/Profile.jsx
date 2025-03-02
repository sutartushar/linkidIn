import { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box, Grid } from '@mui/material';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [formData, setFormData] = useState({
    skills: [],
    experience: [],
    preferredJobRoles: [],
    manualUpdates: {
      bio: '',
      additionalSkills: []
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const profileData = response.data || {};
        setProfile(profileData);
        setFormData({
          skills: Array.isArray(profileData.skills) ? profileData.skills : [],
          experience: Array.isArray(profileData.experience) ? profileData.experience : [],
          preferredJobRoles: Array.isArray(profileData.preferredJobRoles) ? profileData.preferredJobRoles : [],
          manualUpdates: {
            bio: profileData.manualUpdates?.bio || '',
            additionalSkills: Array.isArray(profileData.manualUpdates?.additionalSkills) 
              ? profileData.manualUpdates.additionalSkills 
              : []
          }
        });
      } catch (error) {
        setError(error.message || 'Error fetching profile');
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: typeof value === 'string' ? value.split(', ').filter(Boolean) : value
    }));
  };

  const handleManualUpdateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      manualUpdates: {
        ...prevData.manualUpdates,
        [name]: name === 'additionalSkills' ? value.split(', ').filter(Boolean) : value
      }
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedExperience = [...prevData.experience];
      updatedExperience[index] = {
        ...updatedExperience[index],
        [field]: value
      };
      return { ...prevData, experience: updatedExperience };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await axios.patch('/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated successfully!');
      // Optional: Refresh profile data after update
      // fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <Typography>Loading profile...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!profile) {
    return <Typography>No profile data available</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        My Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">LinkedIn Details</Typography>
            <Typography>Name: {profile.firstName || ''} {profile.lastName || ''}</Typography>
            <Typography>Headline: {profile.headline || 'Not provided'}</Typography>
            <Typography>Location: {profile.location || 'Not provided'}</Typography>
            <Typography>Email: {profile.email || 'Not provided'}</Typography>
            {profile.profileUrl && (
              <Typography>
                LinkedIn Profile:{' '}
                <a href={profile.profileUrl} target="_blank" rel="noopener noreferrer">
                  View Profile
                </a>
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Skills"
              name="skills"
              value={formData.skills.join(', ')}
              onChange={handleInputChange}
              helperText="Separate skills with commas"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Experience</Typography>
            {formData.experience.map((exp, index) => (
              <Box key={index} sx={{ mb: 2, border: '1px solid #eee', p: 2, borderRadius: 1 }}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={exp.title || ''}
                  onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Company"
                  value={exp.company || ''}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Duration"
                  value={exp.duration || ''}
                  onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                  margin="normal"
                />
              </Box>
            ))}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Preferred Job Roles"
              name="preferredJobRoles"
              value={formData.preferredJobRoles.join(', ')}
              onChange={handleInputChange}
              helperText="Separate roles with commas"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Additional Information</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Bio"
              name="bio"
              value={formData.manualUpdates.bio}
              onChange={handleManualUpdateChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Additional Skills"
              name="additionalSkills"
              value={formData.manualUpdates.additionalSkills.join(', ')}
              onChange={handleManualUpdateChange}
              helperText="Separate skills with commas"
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}