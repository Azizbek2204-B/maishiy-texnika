import { Ctx, Hears, On, Update } from "nestjs-telegraf";
import { MasterService } from "./master.service";
import { Context } from "telegraf";

@Update()
export class MasterUpdate {
  constructor(private readonly masterService: MasterService) {}
}
 