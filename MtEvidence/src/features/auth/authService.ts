import axios from '../../config/axios';

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await axios.post('/users/login', {email, password});
  return response.data;
};
