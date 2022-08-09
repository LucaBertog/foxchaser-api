import { Module } from '@nestjs/common';
import { NewsScrapingController } from './news-scraping.controller';
import { NewsScrapingService } from './news-scraping.service';

@Module({
  controllers: [NewsScrapingController],
  providers: [NewsScrapingService],
})
export class NewsScrapingModule {}
