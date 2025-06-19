const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://dimastw:dya0gVD7m9xJNJpo@cluster0.jez3b.mongodb.net/sabu-raijua?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', uri);
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db('sabu-raijua');
    const collection = db.collection('kecamatans');
    
    const count = await collection.countDocuments();
    console.log(`📊 Found ${count} kecamatan documents`);
    
    const sample = await collection.findOne({}, { projection: { name: 1, code: 1 } });
    console.log('📄 Sample document:', sample);
    
    await client.close();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
