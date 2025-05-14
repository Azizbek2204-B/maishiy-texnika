import { Action, Ctx, On, Update } from "nestjs-telegraf";
import { MasterService } from "./master.service";
import { Context } from "telegraf";

@Update()
export class MasterUpdate {
  constructor(private readonly masterService: MasterService) {}

  @Action(/con_+\d+/)
  async onConfirmation(@Ctx() ctx: Context) {
    return this.masterService.onConfirmation(ctx);
  }

  @Action(/cancel_+\d+/)
  async onCancel(@Ctx() ctx: Context) {
    return this.masterService.onCancel(ctx);
  }

  @On("location")
  async onLocation(@Ctx() ctx: Context) {
    return this.masterService.onLocation(ctx);
  }

  @On("contact")
  async onContact(@Ctx() ctx: Context) {
    return this.masterService.onContact(ctx);
  }
}
