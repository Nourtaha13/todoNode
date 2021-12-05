const { MongoClient } = require("mongodb")
const { host, port, dbName } = require("../config/db.js")
const client = new MongoClient(`mongodb://${host}:${port}`)
module.exports ={
				connect : async _ =>{
		           	await 	client.connect()
		           return client.db(dbName)
     },

				disConnect : async _ =>{
								await client.close()
								return 'Close MongoDB'
				}
} 