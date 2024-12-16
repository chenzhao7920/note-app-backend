import { Controller, Get, Post, Body, Put, Param, Delete, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  async findAll() {
    return this.notesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.notesService.remove(id);
    return { statusCode: HttpStatus.OK, message: 'Note deleted successfully' };
  }
}
