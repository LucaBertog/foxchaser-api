import { Controller, Get } from '@nestjs/common';
import { NewsScrapingService } from './news-scraping.service';

@Controller('news-scraping')
export class NewsScrapingController {
  constructor(private newsScrapingService: NewsScrapingService) {}

  @Get()
  async test() {
    const response = await this.newsScrapingService.test();
    return response;
  }
}
