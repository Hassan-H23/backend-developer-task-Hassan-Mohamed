import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  Query,
  ParseUUIDPipe, 
  HttpCode, 
  HttpStatus
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDTO } from './dto/create-member.dto';
import { UpdateMemberDTO } from './dto/update-member.dto';
import { MemberDTO } from './dto/member.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

@Post()
  async create(@Body() createMemberDto: CreateMemberDTO): Promise<MemberDTO> {
    return this.membersService.create(createMemberDto);
}

@Get()
async findAll(@Query('limit') limit?: string, @Query('offset') offset?: string,): Promise<MemberDTO[]> {
  return this.membersService.findAll(limit, offset);
}

  @Get(':id')
async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<MemberDTO> {
  return this.membersService.findOne(id);
}

@Patch(':id')
async update(
  @Param('id', new ParseUUIDPipe()) id: string,
  @Body() updateMemberDto: UpdateMemberDTO,
): Promise<MemberDTO> {
  return this.membersService.update(id, updateMemberDto);
}

@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
  return this.membersService.delete(id);
}
}
