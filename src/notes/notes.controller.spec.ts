import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { INote, Note} from './schemas/note.schema';

describe('NotesModule', () => {
  let notesController: NotesController;
  let notesService: NotesService;

  const mockNote = {
    _id: 'some-id',
    title: 'Test Title',
    content: 'Test Content',
    createdAt: new Date(),
  } as Note & Document;

  const mockNotesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    }).compile();

    notesController = module.get<NotesController>(NotesController);
    notesService = module.get<NotesService>(NotesService);
  });

  describe('findAll', () => {
    it('should return an array of notes', async () => {
      const mockNotes: Note[] = [mockNote];
      jest.spyOn(notesService, 'findAll').mockResolvedValue(mockNotes);

      const result = await notesController.findAll();
      expect(result).toEqual(mockNotes);
    });

    it('should handle errors when getting notes fails', async () => {
      jest.spyOn(notesService, 'findAll').mockRejectedValue(new Error('Database error'));

      await expect(notesController.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return a single note', async () => {
      jest.spyOn(notesService, 'findOne').mockResolvedValue(mockNote);

      const result = await notesController.findOne('some-id');
      expect(result).toEqual(mockNote);
    });

    it('should handle note not found', async () => {
      jest.spyOn(notesService, 'findOne').mockRejectedValue(new Error('Note not found'));

      await expect(notesController.findOne('invalid-id')).rejects.toThrow('Note not found');
    });
  });

  describe('create', () => {
    it('should create a new note', async () => {
      const createNoteDto: CreateNoteDto = {
        title: 'Test Title',
        content: 'Test Content',
      };

      jest.spyOn(notesService, 'create').mockResolvedValue(mockNote);

      const result = await notesController.create(createNoteDto);
      expect(result).toEqual(mockNote);
    });

    it('should handle validation errors', async () => {
      const invalidDto: CreateNoteDto = {
        title: '',  // Invalid: empty title
        content: 'Test Content',
      };

      jest.spyOn(notesService, 'create').mockRejectedValue(new Error('Validation failed'));

      await expect(notesController.create(invalidDto)).rejects.toThrow('Validation failed');
    });
  });

  describe('update', () => {
    it('should update an existing note', async () => {
      const updateNoteDto: UpdateNoteDto = {
        title: 'Updated Title',
      };

      const updatedNote = {
        ...mockNote,
        title: 'Updated Title',
      };

      jest.spyOn(notesService, 'update').mockResolvedValue(updatedNote as Note & Document);

      const result = await notesController.update('some-id', updateNoteDto);
      expect(result).toEqual(updatedNote);
    });

    it('should handle note not found during update', async () => {
      const updateNoteDto: UpdateNoteDto = {
        title: 'Updated Title',
      };

      jest.spyOn(notesService, 'update').mockRejectedValue(new Error('Note not found'));

      await expect(notesController.update('invalid-id', updateNoteDto)).rejects.toThrow('Note not found');
    });
  });

  describe('remove', () => {
    it('should delete an existing note', async () => {
      jest.spyOn(notesService, 'remove').mockResolvedValue();

      await expect(notesController.remove('some-id')).resolves.not.toThrow();
    });

    it('should handle note not found during deletion', async () => {
      jest.spyOn(notesService, 'remove').mockRejectedValue(new Error('Note not found'));

      await expect(notesController.remove('invalid-id')).rejects.toThrow('Note not found');
    });
  });
});