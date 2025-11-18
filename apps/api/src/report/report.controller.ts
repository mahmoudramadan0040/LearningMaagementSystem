import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportService } from './report.service';


@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  
  
  

  
}
