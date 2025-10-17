// test-atlas.js
const { MongoClient } = require('mongodb');
const path = require('path');

// Load .env from parent folder
require('dotenv').config({ path: path.join(__dirname, '../../.env') });


async function testAtlasConnection() {
  // Get connection string from environment variable
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is not set");
    console.log("💡 Create a .env file with your connection string");
    return;
  }

  console.log("🔗 Attempting to connect to MongoDB Atlas...");
  const client = new MongoClient(uri);

  try {
    // Connect to the database
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");
    
    // Get database reference
    const database = client.db();
    console.log("📊 Using database:", database.databaseName);
    
    // Create or get tasks collection
    const tasks = database.collection('tasks');
    
    // Insert a sample task
    const insertResult = await tasks.insertOne({
      title: "Test Task from Atlas",
      description: "This task was inserted via Node.js connection",
      status: "pending",
      priority: "medium",
      created_at: new Date()
    });
    
    console.log("✅ Sample task inserted with ID:", insertResult.insertedId);
    
    // Read back all tasks
    const allTasks = await tasks.find({}).toArray();
    console.log("\n📋 All tasks in collection:");
    console.log("----------------------------");
    allTasks.forEach(task => {
      console.log(`- ${task.title} (${task.status})`);
    });
    
    // Get collection count
    const taskCount = await tasks.countDocuments();
    console.log(`\n📈 Total tasks in database: ${taskCount}`);
    
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.log("\n🔧 Troubleshooting tips:");
    console.log("1. Check your connection string in .env file");
    console.log("2. Verify your IP is whitelisted in MongoDB Atlas");
    console.log("3. Check your database user credentials");
    console.log("4. Ensure your cluster is running in Atlas");
  } finally {
    // Close the connection
    await client.close();
    console.log("\n🔌 Database connection closed");
  }
}

// Run the function
testAtlasConnection();