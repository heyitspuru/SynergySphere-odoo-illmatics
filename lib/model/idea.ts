import { mongoose } from '../mongodb';

// Define the schema
const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  techStack: {
    type: [String],
    default: [],
  },
  implementation: {
    frontend: { type: String, default: '' },
    backend: { type: String, default: '' },
    database: { type: String, default: '' },
    deployment: { type: String, default: '' },
  },
  features: {
    type: [String],
    default: [],
  },
  challenges: {
    type: [String],
    default: [],
  },
  timeline: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isSaved: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: -1,
    max: 1,
  },
});

// Use mongoose.models to prevent OverwriteModelError
export const Idea = mongoose.models.Idea || mongoose.model('Idea', IdeaSchema);