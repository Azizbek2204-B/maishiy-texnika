import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Context, Markup } from "telegraf";
import { Bot } from "./models/bot.model";
import { MasterService } from "./master/master.service";
import { Master } from "./models/usta_model";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    private readonly masterService: MasterService,
    @InjectModel(Master) private readonly masterModel: typeof Master
  ) {}

  async start(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await this.botModel.create({
          user_id: user_id!,
          username: ctx.from?.username!,
          first_name: ctx.from?.first_name!,
          language_code: ctx.from?.language_code!,
          role: "",
        });

        await ctx.replyWithHTML(`Iltimos, kimligingizni belgilang`, {
          ...Markup.keyboard([
            Markup.button.text("Master"),
            Markup.button.text("Mijoz"),
          ])
            .oneTime()
            .resize(),
        });
      } else {
        await ctx.replyWithHTML(`Iltimos, kimligingizni belgilang`, {
          ...Markup.keyboard([
            Markup.button.text("Master"),
            Markup.button.text("Mijoz"),
          ])
            .oneTime()
            .resize(),
        });
      }
    } catch (error) {
      console.log(`Error on Start`, error);
    }
  }

  async ustaMessage(ctx: Context) {
    if ("text" in ctx.message!) {
      const message = ctx.message.text;
      if (message === "Master") {
        const user_id = ctx.from?.id;
        await this.masterModel.create({
          user_id: user_id!,
          last_state: "role",
        });
        await ctx.replyWithHTML(`O'z yo'nalishni kiriting`, {
          ...Markup.keyboard([
            ["Sartaroshxona", "Go'zallik saloni"],
            ["Zargarlik ustaxonasi", "Soatsoz"],
            ["Poyabzal ustaxonasi", "..."],
          ])
            .oneTime()
            .resize(),
        });
      }
    }
  }

  async onText(ctx: Context) {
    await this.masterService.start(ctx);
  }

  async cancel(ctx: Context) {
    await this.masterModel.destroy({
      where: {
        user_id: ctx.from?.id,
      },
    })
    return this.onText(ctx);
  }
}
