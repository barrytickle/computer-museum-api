const {MongoClient, ObjectID} = require('mongodb');

function controller(){
    const url = 'mongodb://localhost:27017'
    const dbName = 'museum'
    function get(query, limit, document){
        return new Promise(async (resolve, reject) => {
           const client = new MongoClient(url)
           try{
               await client.connect();
               const db = client.db(dbName)
               let items = db.collection(document).find(query)
               if(limit > 0){
                   items = items.limit(limit)
               }
               resolve(await items.toArray())
               client.close();
           }catch(error){
               resolve(error)
           }
        });
    }
    function getById(id, document) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                const item = await db.collection(document).findOne({ _id: ObjectID(id) });
                resolve(item);
                client.close();
            } catch (error) {
                reject(error);
            }
        });
    }
    function update(id, newItem, document) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                const updatedItem = await db.collection(document)
                    .findOneAndReplace({_id: ObjectID(id)}, newItem, {returnOriginal:false});
                resolve(updatedItem.value);
                client.close();
            } catch (error) {
                reject(error);
            }
        });
    }

    function add(item, document) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                const addedItem = await db.collection(document).insertOne(item);
                resolve(addedItem.ops[0]);
                client.close();
            } catch (error) {
                reject(error);
            }
        });
    }

    function remove(id, document){
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                const removed = await db.collection(document).deleteOne({_id: ObjectID(id)});

                resolve(removed.deletedCount === 1);
                client.close();
            } catch (error) {
                reject(error);
            }
        });
    }
    return {get, getById, add, remove, update}
}

module.exports = controller();