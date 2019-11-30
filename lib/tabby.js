const request = require('request-promise');

const TS_PROCESS_ENDPOINT = 'https://api.tabscanner.com/api/2/process';
const TS_RESULTS_ENDPOINT = 'https://api.tabscanner.com/api/result';
const TS_DEFAULT_RETRIES = 5;
const TS_WAIT_INTERVAL_MS = 500;

let apiKey = '';

/**
 * initialises the api with an api key for subsequent requests.
 **/
const init = (apikey) => {
	apiKey = apikey;
}

/** 
 * sends a blob (image/jpg)? to the serivce for processing. returns a token
 * which can be used with .results to retrieve line items.
 **/
const process = async(blob, name, type) => {
	const res = JSON.parse(await request.post({
		formData: {
			file: {
				value: blob,
				options: {
					filename: name || 'image.jpg',
					contentType: type || 'image/jpg',
				},
			},
			testMode: 'true',
		},
		headers: {
			apikey: apiKey,
		},
		method: 'POST',
		uri: TS_PROCESS_ENDPOINT,
	}));
	const token = (res.duplicateToken != null) ? res.duplicateToken : res.token;
	return token;
}

/**
 * sends for the results of a given token.
 **/
const results = async(token, retries) => {
	if (retries == null) retries = TS_DEFAULT_RETRIES;
	else if (retries === 0) return {success: false, reason: 'timed out'};
	const res = JSON.parse(await request.get({
		headers: {
			apikey: apiKey,
		},
		uri: `${TS_RESULTS_ENDPOINT}/${token}`
	}));
	if (res.code >= 500) {
	  // a server failure occurred. we probably need to re-queue the submission.
		return {success: false, reason: 'server failure'};
	} else if (res.code === 301) { // 'no results yet'
		return await results(token, retries - 1);
	}
	return res;
}

module.exports = {init, process, results};
