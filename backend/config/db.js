// backend/config/db.js
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI_SCMS = process.env.MONGO_URI_SCMS || process.env.MONGO_URI;
const MONGO_URI_AUTH = process.env.MONGO_URI_AUTH || MONGO_URI_SCMS;

export let scmsMongoClient = null;
export let documentDb = null;
export let studentProgressDb = null;
export let authConnection = null;
export let scmsConnection = null;

export const connectDatabases = async () => {
  try {
    // 1. Connect Primary Mongoose (SCMS Cluster)
    scmsConnection = await mongoose.connect(MONGO_URI_SCMS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to Primary MongoDB (SCMS Cluster)');

    // 2. Try Secondary Auth Mongoose or fallback to Primary
    if (MONGO_URI_AUTH && MONGO_URI_AUTH !== MONGO_URI_SCMS) {
      try {
        authConnection = mongoose.createConnection(MONGO_URI_AUTH, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 3000,
        });
        authConnection.on('connected', () => {
          console.log('✅ Connected to Secondary MongoDB (LoginDB Cluster)');
        });
        authConnection.on('error', (err) => {
          console.warn('⚠️ Secondary MongoDB cluster unavailable; falling back to primary cluster for Auth & Admin:', err.message);
          authConnection = scmsConnection;
        });
      } catch (err) {
        console.warn('⚠️ Secondary connection failed, using primary cluster.');
        authConnection = scmsConnection;
      }
    } else {
      authConnection = scmsConnection;
    }

    // 3. Connect Native MongoClient for High-Performance / Document DB operations
    scmsMongoClient = new MongoClient(MONGO_URI_SCMS, { useUnifiedTopology: true });
    await scmsMongoClient.connect();
    documentDb = scmsMongoClient.db('document_db');
    studentProgressDb = scmsMongoClient.db('student_progress_db');
    console.log('✅ Native MongoDB Client connected (document_db & student_progress_db ready)');

    return { scmsConnection, authConnection, documentDb, studentProgressDb };
  } catch (error) {
    console.error('❌ Database connection failure:', error);
    process.exit(1);
  }
};
