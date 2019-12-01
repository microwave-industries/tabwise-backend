const generate = require('project-name-generator');
const mongo = require('mongodb').MongoClient;
const client = new mongo(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
const uuid = require('uuid/v4');
console.log('bringing up database...');

let callback = () => {};
let db = null;
client.connect(err => {
	if (err != null)  console.error(`failed to connect to database: ${err}`);
	else {
		db = client.db('Rooms');
		console.log('database is ready.');
		callback();
	}
});

const createRoom = async(userName, tabData) => {
	const code = generate().dashed;
	const uid = uuid();
	const {place, currency, date, items, total, charges} = tabData;
	await db.collection("Rooms").insertOne({
		code: code,
		users: [],
		place,
		items,
		date,
		currency,
		charges,
		total
	});
	return code;
}

const joinRoom = async(code, userName) => {
	const uid = uuid();
	const user = {uid, name: userName, payer: false, items: []};
	const f = 
		await db.collection('Rooms').findOneAndUpdate({code: code}, {$push: {users: user}}, {returnOriginal: false});
	const {items, place, date, total, users, charges} = f.value;
	return {uid, items, place, date, total, users, charges};
}

const claimItems = async(uid, claims) => {
	const f = 
		await db.collection('Rooms')
			.findOneAndUpdate(
				{'users.uid': uid},
				{$set: {'users.$.items': claims}},
				{returnOriginal: false}
			);
	const {items, users} = f.value;
	return {items, users};
}

const queryRoom = async(uid) => {
	const {place, items, users, charges} = await db.collection('Rooms').findOne({'users.uid': uid});
	return {place, items, users, charges};
}

const attachPaymentInfo = async(uid, url) => {
	await db.collection('Rooms').findOneAndUpdate({'users.uid': uid}, {$set: {paymentUrl: url, 'users.$.payer': true}}, {returnOriginal: false});
}

const getPaymentInfo = async(uid) => {
	const {paymentUrl} = await db.collection('Rooms').findOne({'users.uid': uid});
	return paymentUrl;
}

const onReady = (fn) => {
	callback = fn;
}

module.exports = {createRoom, joinRoom, claimItems, queryRoom, attachPaymentInfo, getPaymentInfo, onReady};

