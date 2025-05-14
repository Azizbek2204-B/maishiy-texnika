import { InjectModel } from "@nestjs/sequelize";
import { Ctx, Hears, On, Start, Update } from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { Bot } from "./models/bot.model";
import { BotService } from "./bot.service";

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    return this.botService.start(ctx);
  }

  @Hears("Master")
  async ustaMessage(@Ctx() ctx: Context) {
    return this.botService.ustaMessage(ctx);
  }

  @Hears("Bekor qilish")
  async cancel(@Ctx() ctx: Context) {
    return this.botService.cancel(ctx);
  }

  @On("text")
  async onText(@Ctx() ctx: Context) {
    return this.botService.onText(ctx);
  }
}
