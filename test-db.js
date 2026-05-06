const mongoose = require('mongoose');

async function check() {
  try {
    const uri = "mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash";
    await mongoose.connect(uri);
    const posts = await mongoose.connection.db.collection('blogposts').find({}).toArray();
    console.log("Found posts:", posts.length);
    posts.forEach(p => {
      console.log(`Title: ${p.title}`);
      console.log(`CoverImage: ${p.coverImage}`);
      console.log(`Content contains image: ${p.content && p.content.includes('<img') ? 'Yes' : 'No'}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

check();
