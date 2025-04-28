import type { Metadata } from 'next';
import RegistrationForm from '@/components/RegistrationForm';

export const metadata: Metadata = {
  title: 'Register for REFLECTIONS ON THE AFRICA JOBS SCENARIOS REPORT',
  description: 'Register for our DIALOGUE FOR ACTION: REFLECTIONS ON THE AFRICA JOBS SCENARIOS REPORT and get access to exclusive content',
};

export default function RegisterPage() {
  return <RegistrationForm />;
}
