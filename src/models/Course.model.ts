import mongoose, { Schema, model, Document } from 'mongoose';

// Define the structure of a command
interface Command {
  command: string;
  description: string;
  syntax: string;
}

// Define the structure of a section
interface Section {
  section: string;
  details?: string[] | { [key: string]: string }[];
  commands?: Command[];
}

// Define the structure of a chapter
interface Chapter {
  chapterNumber: number;
  title: string;
  objective: string;
  content: Section[];
}

// Define the structure of the course
interface Course {
  for: string;
  course: {
    title: string;
    chapters: Chapter[];
    additionalResources: {
      glossary: string;
      references: string;
    };
  };
}

// Define the Mongoose schema for a course
const commandSchema = new Schema<Command>({
  command: { type: String, required: true },
  description: { type: String, required: true },
  syntax: { type: String, required: true }
});

const sectionSchema = new Schema<Section>({
  section: { type: String, required: true },
  details: [Schema.Types.Mixed],
  commands: [commandSchema]
});

const chapterSchema = new Schema<Chapter>({
  chapterNumber: { type: Number, required: true },
  title: { type: String, required: true },
  objective: { type: String, required: true },
  content: [sectionSchema]
});

const courseSchema = new Schema<Course>({
  for: { type: String, required: true },
  course: {
    title: { type: String, required: true },
    chapters: [chapterSchema],
    additionalResources: {
      glossary: { type: String, required: true },
      references: { type: String, required: true }
    }
  }
});
// Create the model
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

export default Course;
