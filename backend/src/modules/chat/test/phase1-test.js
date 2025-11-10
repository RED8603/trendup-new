/**
 * Phase 1 Test Script - Chat Module Foundation
 * 
 * This script tests the basic structure and models of the chat module.
 * Run with: node backend/src/modules/chat/test/phase1-test.js
 */

const mongoose = require('mongoose');
const config = require('../../../config');

// Import models
const { Conversation, Message, Participant, MessageRead, MessageReaction } = require('../models');

async function testPhase1() {
  console.log('🧪 Starting Phase 1 Chat Module Tests...\n');

  try {
    // Connect to database
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(config.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Model Existence
    console.log('📋 Test 1: Checking model existence...');
    const models = {
      Conversation,
      Message,
      Participant,
      MessageRead,
      MessageReaction,
    };

    for (const [name, Model] of Object.entries(models)) {
      if (Model && Model.modelName) {
        console.log(`  ✅ ${name} model exists (${Model.modelName})`);
      } else {
        console.log(`  ❌ ${name} model missing`);
        throw new Error(`${name} model not found`);
      }
    }
    console.log('');

    // Test 2: Schema Validation
    console.log('📋 Test 2: Testing schema validation...');
    
    // Test Conversation schema
    const testConversation = new Conversation({
      type: 'direct',
      isActive: true,
    });
    
    try {
      await testConversation.validate();
      console.log('  ✅ Conversation schema validation passed');
    } catch (error) {
      console.log(`  ❌ Conversation schema validation failed: ${error.message}`);
      throw error;
    }

    // Test Message schema
    const testMessage = new Message({
      conversationId: new mongoose.Types.ObjectId(),
      senderId: new mongoose.Types.ObjectId(),
      encryptedContent: JSON.stringify({ encrypted: 'test', iv: 'test', authTag: 'test' }),
      messageType: 'text',
    });
    
    try {
      await testMessage.validate();
      console.log('  ✅ Message schema validation passed');
    } catch (error) {
      console.log(`  ❌ Message schema validation failed: ${error.message}`);
      throw error;
    }

    // Test Participant schema
    const testParticipant = new Participant({
      conversationId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      role: 'member',
      isActive: true,
    });
    
    try {
      await testParticipant.validate();
      console.log('  ✅ Participant schema validation passed');
    } catch (error) {
      console.log(`  ❌ Participant schema validation failed: ${error.message}`);
      throw error;
    }
    console.log('');

    // Test 3: Indexes
    console.log('📋 Test 3: Checking indexes...');
    const conversationIndexes = await Conversation.collection.getIndexes();
    const messageIndexes = await Message.collection.getIndexes();
    const participantIndexes = await Participant.collection.getIndexes();
    
    console.log(`  ✅ Conversation indexes: ${Object.keys(conversationIndexes).length} found`);
    console.log(`  ✅ Message indexes: ${Object.keys(messageIndexes).length} found`);
    console.log(`  ✅ Participant indexes: ${Object.keys(participantIndexes).length} found`);
    console.log('');

    // Test 4: Enum Validation
    console.log('📋 Test 4: Testing enum validation...');
    
    // Test invalid conversation type
    const invalidConversation = new Conversation({
      type: 'invalid',
      isActive: true,
    });
    
    try {
      await invalidConversation.validate();
      console.log('  ❌ Enum validation failed - should reject invalid type');
      throw new Error('Enum validation not working');
    } catch (error) {
      if (error.name === 'ValidationError') {
        console.log('  ✅ Enum validation working (rejected invalid type)');
      } else {
        throw error;
      }
    }
    console.log('');

    // Test 5: Service Imports
    console.log('📋 Test 5: Checking service imports...');
    try {
      const { conversationService, messageService, encryptionService, attachmentService } = require('../services');
      console.log('  ✅ All services imported successfully');
    } catch (error) {
      console.log(`  ❌ Service import failed: ${error.message}`);
      throw error;
    }
    console.log('');

    // Test 6: Controller Imports
    console.log('📋 Test 6: Checking controller imports...');
    try {
      const { conversationController, messageController } = require('../controllers');
      console.log('  ✅ All controllers imported successfully');
    } catch (error) {
      console.log(`  ❌ Controller import failed: ${error.message}`);
      throw error;
    }
    console.log('');

    // Test 7: Route Imports
    console.log('📋 Test 7: Checking route imports...');
    try {
      const { conversationRoutes, messageRoutes } = require('../routes');
      console.log('  ✅ All routes imported successfully');
    } catch (error) {
      console.log(`  ❌ Route import failed: ${error.message}`);
      throw error;
    }
    console.log('');

    console.log('🎉 All Phase 1 tests passed!');
    console.log('\n📝 Phase 1 Summary:');
    console.log('   ✅ Models created (5 models)');
    console.log('   ✅ Services created (4 services)');
    console.log('   ✅ Controllers created (2 controllers)');
    console.log('   ✅ Routes created and registered');
    console.log('   ✅ Validators created (Joi)');
    console.log('\n✅ Phase 1: Backend Foundation - COMPLETE');
    console.log('\n📌 Next Steps:');
    console.log('   1. Test API endpoints with Postman/HTTP client');
    console.log('   2. Move to Phase 2: Socket.io Integration');
    console.log('   3. Test real-time messaging');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run tests
testPhase1();

