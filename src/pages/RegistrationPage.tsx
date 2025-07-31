import RegistrationForm from '../components/RegistrationForm';

const RegistrationPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32 }}>User Registration</h1>
      <RegistrationForm />
    </div>
  );
};

export default RegistrationPage;