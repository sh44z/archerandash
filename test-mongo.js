const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('test'); // Or archerandash? Usually test for default connection if not specified in URI before ?
    let posts = await database.collection('blogposts').find({}).toArray();
    
    if (posts.length === 0) {
      const db2 = client.db('myFirstDatabase');
      posts = await db2.collection('blogposts').find({}).toArray();
    }
    
    if (posts.length === 0) {
      const db3 = client.db('archerandash');
      posts = await db3.collection('blogposts').find({}).toArray();
    }

    console.log(`Found ${posts.length} posts`);
    
    for (const p of posts) {
      console.log(`Title: ${p.title}`);
      console.log(`CoverImage: ${p.coverImage}`);
      
      const contentImages = (p.content || '').match(/<img[^>]+src="([^">]+)"/g);
      console.log(`Images in content:`, contentImages);
      console.log('---');
    }
  } finally {
    await client.close();
  }
}

main().catch(console.error);
