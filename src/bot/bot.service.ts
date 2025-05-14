import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Context, Markup } from "telegraf";
import { Op } from "sequelize";
import { Master } from "./models/usta_model";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Master) private readonly masterModel: typeof Master
  ) {}

  async start(ctx: Context) {
    try {
      await ctx.replyWithHTML(`Iltimos, quyidagi rolelardan birini tanlang`, {
        ...Markup.keyboard([["MIJOZ", "USTA"]])
          .oneTime()
          .resize(),
      });
    } catch (error) {
      console.log(`Error on start`, error);
    }
  }

  async onText(ctx: Context) {
    try {
      if ("text" in ctx.message!) {
        const id = ctx.from?.id;
        const master = await this.masterModel.findOne({
          where: {
            user_id: id,
            last_state: { [Op.ne]: "finish" },
          },
          order: [["id", "DESC"]],
        });
        if (master) {
          const masterInput = ctx.message.text;
          switch (master.last_state) {
            case "specialization":
              master.specialization = masterInput;
              master.last_state = "name";
              await master.save();
              await ctx.replyWithHTML(`Ismingizni kiriting:`, {
                ...Markup.removeKeyboard(),
              });
              break;
            case "name":
              master.name = masterInput;
              master.last_state = "tel_number";
              await master.save();
              await ctx.replyWithHTML(`Telefon raqamingizni kiriting:`, {
                ...Markup.keyboard([
                  Markup.button.contactRequest("Telefon raqamni yuborish"),
                ])
                  .oneTime()
                  .resize(),
              });
              break;
            case "ustaxona_nomi":
              master.ustaxona_nomi = masterInput;
              master.last_state = "address";
              await master.save();
              await ctx.replyWithHTML(
                `Ishlash joyingizni manzilini kiriting:`,
                {
                  ...Markup.removeKeyboard()
                }
              );
              break;
            case "address":
              master.address = masterInput;
              master.last_state = "landmark";
              await master.save();
              await ctx.replyWithHTML(
                `Ishlash joyingizni mo'ljalini kiriting:`,
                {
                  ...Markup.removeKeyboard(),
                }
              );
              break;
            case "landmark":
              master.landmark = masterInput;
              master.last_state = "location";
              await master.save();
              await ctx.replyWithHTML(
                `Ishlash joyingizni lokatsiyasini kiriting:`,
                {
                  ...Markup.keyboard([
                    [Markup.button.locationRequest("Lokatsiya yuborish")],
                  ]).resize(),
                }
              );
              break;
            case "start_time":
              master.start_time = masterInput;
              master.last_state = "end_time";
              await master.save();
              await ctx.replyWithHTML(`Ish tugash vaqtingizni kiriting:`, {
                ...Markup.removeKeyboard(),
              });
              break;

            case "end_time":
              master.start_time = masterInput;
              master.last_state = "time";
              await master.save();
              await ctx.replyWithHTML(
                `Har bir mijozga ketadigan o'rtacha vaqtni kiriting:`,
                {
                  ...Markup.removeKeyboard(),
                }
              );
              break;

            case "time":
              master.time = masterInput;
              master.last_state = "finish";
              await master.save();
              await ctx.replyWithHTML(
                `Siz barcha kerakli ma'lumotlarni kiritdingiz`,
                {
                  ...Markup.keyboard([["Tasdiqlash", "Bekor qilish"]])
                    .oneTime()
                    .resize(),
                }
              );
              break;
          }
        }
      }
    } catch (error) {
      console.log(`Error on text`, error);
    }
  }
}
