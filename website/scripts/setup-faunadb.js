#!/usr/bin/env node

/**
 * This script sets up the FaunaDB database for the Neo N3 Proposals website.
 * It creates the necessary collections, indexes, and roles for storing and retrieving comments.
 * 
 * Usage:
 * 1. Set your FaunaDB secret key in the .env file or as an environment variable:
 *    FAUNA_SECRET=your_fauna_secret_key_here
 * 
 * 2. Run the script:
 *    node scripts/setup-faunadb.js
 */

require('dotenv').config();
const faunadb = require('faunadb');
const q = faunadb.query;

// Check for FaunaDB secret
if (!process.env.FAUNA_SECRET) {
  console.error('Error: FAUNA_SECRET environment variable is required');
  console.error('Please set it in your .env file or environment');
  process.exit(1);
}

// Initialize FaunaDB client
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET
});

// Main setup function
async function setup() {
  console.log('🦋 Setting up FaunaDB database for Neo N3 Proposals website...');
  
  try {
    // Create collections
    console.log('Creating collections...');
    await createCollection('comments');
    
    // Create indexes
    console.log('Creating indexes...');
    await createIndex('comments_by_nep', 'comments', ['data.nepNumber']);
    await createIndex('all_comments', 'comments');
    
    console.log('✅ FaunaDB setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up FaunaDB:', error);
    process.exit(1);
  }
}

// Helper function to create a collection
async function createCollection(name) {
  try {
    await client.query(q.CreateCollection({ name }));
    console.log(`  ✓ Created collection: ${name}`);
  } catch (error) {
    if (error.description === 'Collection already exists.') {
      console.log(`  ℹ Collection already exists: ${name}`);
    } else {
      throw error;
    }
  }
}

// Helper function to create an index
async function createIndex(name, collection, terms = null) {
  try {
    const indexOptions = {
      name,
      source: q.Collection(collection)
    };
    
    if (terms) {
      indexOptions.terms = terms.map(term => ({ field: ['data', ...term.split('.')] }));
    }
    
    await client.query(q.CreateIndex(indexOptions));
    console.log(`  ✓ Created index: ${name}`);
  } catch (error) {
    if (error.description === 'Index already exists.') {
      console.log(`  ℹ Index already exists: ${name}`);
    } else {
      throw error;
    }
  }
}

// Run the setup
setup()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
