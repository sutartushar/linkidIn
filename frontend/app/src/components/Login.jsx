import { Button } from '@mui/material';

export default function Login() {
  const handleLinkedInLogin = () => {
    window.location.href = 'http://localhost:5000/auth/linkedin';
  };

  return (
    <Button 
      variant="contained" 
      color="primary"
      onClick={handleLinkedInLogin}
    >
      Sign in with LinkedIn
    </Button>
  );
}