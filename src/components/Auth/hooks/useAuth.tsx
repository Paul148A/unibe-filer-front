import { useAuth as useAuthContext } from '../../Context/context';

export const useAuth = () => {
  const { user, loading } = useAuthContext();
  return { user, loading };
};
