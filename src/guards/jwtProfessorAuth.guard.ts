import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ProfessorJwtAuthGuard extends AuthGuard('professor-jwt') {}
