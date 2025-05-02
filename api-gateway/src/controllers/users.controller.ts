import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { GatewayUsersService } from "../services/user/gateway.users.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: GatewayUsersService) {}

    @Get("/all")
    async getAllUsers(req: Request, res: Response) {
        try {
            console.log("Fetching all users");
            const users = await this.userService.getAllUsers();
            return users
        } catch (error) {
            throw new Error("Failed to fetch users");
        }
    }
    @Get("/role/:name")
    async getRoleIdByName(@Param("name") roleName: string) {
        try {
            console.log("Fetching users by role");
            console.log("roleName", roleName);
            const role = await this.userService.getRoleIdByName(roleName);
            return role;
        } catch (error) {
            throw new Error("Failed to fetch users by role");
        }
    }

    @Get("/:id")
    async getUserById(@Param("id") id: string) {
        const userId = id;
        try {
            return await this.userService.getUserById(userId);
        } catch (error) {
            throw new Error("Failed to fetch user");
        }
    }

    @Post("/create")
    async createUser(@Body() Data: any) {
        const userData = Data;
        try {
            return await this.userService.createUser(userData);
        } catch (error) {
            throw new Error("Failed to create user");
        }
    }

    @Post("/:id/update")
    async updateUser(@Param("id") id: string, @Body() Data: any) {
        const userId = id;
        const userData = Data;

        try {
            return await this.userService.updateUser(userId, userData);
        } catch (error) {
            throw new Error("Failed to update user");
        }
    }

    @Delete("/:id")
    async deleteUser(@Param("id") id: string) {
        try {
            await this.userService.deleteUser(id);
        } catch (error) {
            throw new Error("Failed to delete user");
        }
    }
}