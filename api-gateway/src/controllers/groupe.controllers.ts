import { Controller, Get } from "@nestjs/common";
import { GatewayGroupService } from "../services/groupe/gatewaye.groupe.service";

@Controller("groups")
export class GroupController {
  constructor(private readonly groupService: GatewayGroupService) {}
  // Define methods for group-related operations

  @Get("all")
    public async getAllGroups() {
        return await this.groupService.getAllGroups();
    }
}