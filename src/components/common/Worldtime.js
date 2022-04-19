const axios = require('axios').default;

export const getGlobalTime = async() => {
	const url = "https://worldtimeapi.org/api/timezone/Etc/UTC";
	const response = await axios.get(url);
	if(response.status !== 200) return 0;
	else return response.data.unixtime;
}
