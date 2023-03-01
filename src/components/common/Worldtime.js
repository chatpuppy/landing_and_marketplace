import axios from 'axios';

export const getGlobalTime = async () => {
  const url = 'https://worldtimeapi.org/api/timezone/Etc/UTC';
  const response = await axios.get(url);
  if (response.status !== 200) return 0;
  return response.data.unixtime;
};
