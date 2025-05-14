import { InjectModel } from "@nestjs/sequelize";
import { Injectable } from "@nestjs/common";
import { InjectBot, On } from "nestjs-telegraf";
import { BOT_NAME } from "../../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Master } from "../models/usta_model";

@Injectable()
export class MasterService {
  constructor(
    @InjectModel(Master) private readonly masterModel: typeof Master
  ) {}

  async register(ctx: Context) {
    if ("text" in ctx.message!) {
      try {
        const user_id = ctx.from?.id;
        await this.masterModel.create({
          user_id: user_id!,
          last_state: "specialization",
        });
        await ctx.replyWithHTML(`Kerakli yo'nalishni tanlang:`, {
          ...Markup.keyboard([
            [
              "SARTAROSHXONA",
              "GO'ZALLIK SALONI",
              "ZARGARLIK USTAXONASI",
              "SOATSOZ",
              "POYABZAL USTAXONASI",
            ],
          ])
            .oneTime()
            .resize(),
        });
      } catch (error) {
        console.log(`Error on master register`, error);
      }
    }
  }

  async onLocation(ctx: Context) {
    try {
      const id = ctx.from?.id;
      const master = await this.masterModel.findOne({
        where: {
          user_id: id,
          last_state: "location",
        },
      });
      if (master && "location" in ctx.message!) {
        const { latitude, longitude } = ctx.message.location!;
        master.location = `${latitude} | ${longitude}`;
        master.last_state = "start_time";
        await master.save();
        await ctx.replyWithHTML(`Ish boshlash vaqtingizni kiriting:`, {
          ...Markup.removeKeyboard(),
        });
      }
    } catch (error) {
      console.log("Error on location:", error);
    }
  }

  async onContact(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const master = await this.masterModel.findOne({ where: { user_id } });
      if (master && master.last_state == "tel_number") {
        if ("contact" in ctx.message!) {
          let phone = ctx.message.contact.phone_number;
          if (phone[0] != "+") {
            phone = "+" + phone;
          }
          master.telefon_number = phone;
          master.last_state = "ustaxona_nomi";
          await master.save();
          await ctx.replyWithHTML(`Ishlash joyingizni nomini kiriting:`, {
            ...Markup.removeKeyboard(),
          });
        }
      }
    } catch (error) {
      console.log(`Error on method "onContact"`, error);
    }
  }

  async onConfirmation(ctx: Context) {
    const user_id = ctx.from?.id;
    const master = await this.masterModel.findOne({ where: { user_id } });
    await ctx.replyWithHTML(
      `Sizni malumotlaringiz adminga yuborildi. Iltimos admin tasdiqlashini kuting`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Tekshirish",
                callback_data: `check_${master?.id}`,
              },
              {
                text: "Bekor qilish",
                callback_data: `cancel_${master?.id}`,
              },
            ],
          ],
        },
      }
    );
  }

  async onCancel(ctx: Context) {
    const user_id = ctx.from?.id;
    const master = await this.masterModel.findOne({ where: { user_id } });
    await master?.destroy();
    await ctx.replyWithHTML(`Siz kiritgan ma'lumotlar bekor qilindi`, {
      ...Markup.keyboard([["/start"]])
        .oneTime()
        .resize(),
    });
  }
}
