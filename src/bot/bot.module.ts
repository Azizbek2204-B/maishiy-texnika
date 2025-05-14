import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { Bot } from './models/bot.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { MasterService } from './master/master.service';
import { MasterUpdate } from './master/master.update';
import { Master } from './models/usta_model';

@Module({
  imports:[SequelizeModule.forFeature([Bot, Master])],
  controllers: [],
  providers: [BotService,MasterService , MasterUpdate ,BotUpdate]
})
export class BotModule {}
