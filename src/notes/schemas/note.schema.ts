import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Create an interface for Note properties
export interface INote {
  _id: string,
  title: string;
  content: string;
  createdAt: Date;
}
@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
NoteSchema.index({ title: 1 });
NoteSchema.index({ createdAt: -1 });