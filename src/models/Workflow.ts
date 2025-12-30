
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkflow extends Document {
  name: string;
  nodes: any[];
  edges: any[];
  createdAt: Date;
  updatedAt: Date;
}

const WorkflowSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    nodes: { type: Array, required: true },
    edges: { type: Array, required: true },
  },
  { timestamps: true }
);

// Prevent overwrite errors in dev mode
const Workflow: Model<IWorkflow> = mongoose.models.Workflow || mongoose.model<IWorkflow>('Workflow', WorkflowSchema);

export default Workflow;
