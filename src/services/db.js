const axios = require('axios').default;

export const call = async (url, params) => {
	return await axios({
			method: 'post',
			url,
			data: JSON.stringify(params),
			withCredentials: true,
			headers: {
					'Content-Type': 'application/json',
					"Accept": "*/*"
			}
	})
}
