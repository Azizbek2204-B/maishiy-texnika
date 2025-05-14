import { Ctx, Hears, On, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { BotService } from "./bot.service";
import { MasterService } from "./master/master.service";

@Update()
export class BotUpdate {
  constructor(
    private readonly botService: BotService,
    private readonly masterService: MasterService
  ) {}
  @Start()
  async onStart(@Ctx() ctx: Context) {
    return this.botService.start(ctx);
  }
  @Hears("USTA")
  async register(@Ctx() ctx: Context) {
    return this.masterService.register(ctx);
  }

  @On("text")
  async onText(@Ctx() ctx:Context) {
    return this.botService.onText(ctx);
  }
}
