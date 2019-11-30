const generate = require('project-name-generator');
const mongo = require('mongodb').MongoClient;
const client = new mongo(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
const uuid = require('uuid/v4');
console.log('bringing up database...');

let db = null;
client.connect(err => {
	if (err != null)  console.error(`failed to connect to database: ${err}`);
	else {
		db = client.db('Rooms');
		console.log('database is ready.');
	}
});

const createRoom = async(userName, tabData) => {
	const code = generate().dashed;
	const uid = uuid();
	const user = {uid, name: userName, payer: true};
	const {place, currency, date, items, total} = tabData;
	await db.collection("Rooms").insertOne({
		code: code,
		users: [user],
		place,
		items,
		date,
		currency,
		total
	});
	return {code, uid};
}

const joinRoom = async(code, userName) => {
	const uid = uuid();
	const user = {uid, name: userName};
	const f = 
		await db.collection('Rooms').findOneAndUpdate({code: code}, {$push: {users: user}}, {new: true});
	const {items, place, date, total} = f.value;
	return {uid, items, place, date, total};
}

const updateRoom = async(id, delta) => {
	
}

const getRoom = async(id) => {
	
}

/*const deleteObject = async(id) => {

}*/

module.exports = {createRoom, joinRoom, updateRoom};

