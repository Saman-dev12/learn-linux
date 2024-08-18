import mongoose, { Document, Model, Schema, FilterQuery } from 'mongoose';

// Define the types for your document and model
interface Command {
  command: string;
  description: string;
  syntax: string;
}

interface Section {
  section: string;
  details?: string[] | { [key: string]: string }[];
  commands?: Command[];
}

interface Chapter {
  chapterNumber: number;
  title: string;
  objective: string;
  content: Section[];
}

interface Course extends Document {
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

// Define the Mongoose schema and model
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

const CourseModel: Model<Course> = mongoose.models.Course || mongoose.model<Course>('Course', courseSchema);

export default CourseModel;
