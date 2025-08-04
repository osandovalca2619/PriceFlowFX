import { Controller, Get, Post, Body, Param, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

// Interface para tipar el request con user
interface AuthenticatedRequest extends ExpressRequest {
  user: any;
}

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ status: 201, description: 'Transaction created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req: AuthenticatedRequest) {
    return this.transactionsService.create(createTransactionDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Request() req: AuthenticatedRequest) {
    return this.transactionsService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Transaction retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.transactionsService.findOne(id, req.user);
  }
}