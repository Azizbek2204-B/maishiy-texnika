import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Master } from "../models/usta_model";
import { Context, Markup } from "telegraf";
import { Op } from "sequelize";

@Injectable()
export class MasterService {
  constructor(
    @InjectModel(Master) private readonly masterModel: typeof Master
  ) {}

  async start(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const master = await this.masterModel.findOne({
        where: {
          user_id,
          last_state: { [Op.ne]: "finish" },
        },
      });
      if (master) {
        let userInput: any;
        if ("text" in ctx.message!) {
          userInput = ctx.message.text;
        }

        if (userInput === "Saqlash" && master.last_state === "customer_time") {
          master.last_state = "finish";
          await master.save();
          await ctx.replyWithHTML("Ma'lumotlar muvaffaqiyatli saqlandi!", {
            ...Markup.keyboard([
              ["Tekshirish", "Bekor qilish"],
              ["Admin bilan bog'lanish"],
            ])
              .oneTime()
              .resize(),
          });
          return;
        }

        switch (master.last_state) {
          case "role":
            let role: any;
            if ("text" in ctx.message!) {
              role = ctx.message.text;
            }
            master.role = role;
            master.last_state = "name";
            await master.save();
            await ctx.reply("Ismizni kiriting:", {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            });
            break;

          case "name":
            master.first_name = userInput;
            master.last_state = "phone";
            await master.save();
            await ctx.reply("Telefon raqamingizni kiriting:", {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            });
            break;

          case "phone":
            master.phone = userInput;
            master.last_state = "workshop_name";
            await master.save();
            await ctx.reply("Ish manzilini kiriting:", {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            });
            break;

          case "workshop_name":
            master.workshop_name = userInput;
            master.last_state = "address";
            await master.save();
            await ctx.reply("Ish joy nomi kiriting:", {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            });
            break;

          case "address":
            master.address = userInput;
            master.last_state = "target";
            await master.save();
            await ctx.reply("Mo'ljalni kiriting:", {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            });
            break;

          case "target":
            master.target = userInput;
            master.last_state = "location";
            await master.save();
            await ctx.reply("Locationni kiriting", {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            });
            break;

          case "location":
            master.location = userInput;
            master.last_state = "start_time";
            await master.save();
            await ctx.reply("Ish boshlanish vaqtini kiriting:", {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            });
            break;

          case "start_time":
            master.start_time = userInput;
            master.last_state = "end_time";
            await master.save();
            await ctx.reply("Ish tugash vaqtini kiriting:", {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            });
            break;

          case "end_time":
            master.end_time = userInput;
            master.last_state = "customer_time";
            await master.save();
            await ctx.reply("Qancha vaqt ketadi bitta odamga", {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            });
            break;

          case "customer_time":
            master.customer_time = userInput;
            master.last_state = "finish";
            await master.save();
            await ctx.replyWithHTML(`Saqlansinmi?`, {
              ...Markup.keyboard([["Saqlash", "Bekor qilish"]]),
            });
            break;
        }
      } else {
        await ctx.replyWithHTML(`Saqlandi`, {
          ...Markup.keyboard([
            ["Tekshirish", "Bekor qilish"],
            ["Admin bilan bog'lanish"],
          ])
            .oneTime()
            .resize(),
        });
      }
    } catch (error) {
      console.log(`Error on Master Start`, error);
    }
  }
}
