import { HttpService } from "@nestjs/axios"
import { SERVICES } from "../../config/services.config";

export class GatewayUsersService {
  constructor(private readonly httpService: HttpService) {}

  // Define methods for user-related operations
  async getUserById(userId: string) {
    try {
        const res = await fetch(`${SERVICES.users}/${userId}`);
            if (!res.ok) {
                throw new Error("Failed to fetch user");
            }
            return await res.json();
    } catch (error) {
      throw new Error("Failed to fetch user, userId: " + userId);   
    }
  }
  // Get user by email
  async getUserByEmail(email: string) {
    console.log("Fetching user by email:", email);
    console.log("URL:", `${SERVICES.users}/email/${email}`);
    try {
        const res = await fetch(`${SERVICES.users}/email/${email}`);
        console.log("Response status:", res.status);
        if (res.status === 404) {
          console.log("User not found");
          return null; // or handle as needed
        }
        if (!res.ok) {
          throw new Error("Failed to fetch user by email");
        }
        return await res.json();
    } catch (error) {
      throw new Error("Failed to fetch user by email");
    }
  }
  async getAllUsers() {
    try {
        console.log(`${SERVICES.users}`);
        const res = await fetch(`${SERVICES.users}`);
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        return await res.json();
    }catch (error) {
      throw new Error("Failed to fetch users");
    }
  }

  async Students(){
    const allusers = await this.getAllUsers();
    const studentsList = allusers.filter((user: any) => user.role.name === "student");
    return studentsList;
  }

  async createUser(userData: any) {
    try {
      const res = await fetch(`${SERVICES.users}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        throw new Error("Failed to create user");
      }
      return await res.json();
    }
    catch (error) {
      throw new Error("Failed to create user");
    }
  }

  async updateUser(userId: string, userData: any) {
    console.log("Updating user with ID:", userId);
    console.log("URL:", `${SERVICES.users}/${userId}`);
    try {
      const res = await fetch(`${SERVICES.users}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        throw new Error("Failed to update user");
      }
      return await res.json();
    }
    catch (error) {
      throw new Error("Failed to update user, userId: " + userId);
    }
  }

  async deleteUser(userId: string) {
    try {
      const res = await fetch(`${SERVICES.users}/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete user");
      }
      return await res.json();
    }
    catch (error) {
      throw new Error("Failed to delete user, userId: " + userId);
    }
  }

  async getRoleIdByName(roleName: string) {
    try {
      const res = await fetch(`${SERVICES.roles}/${roleName}`);
      if (!res.ok) {
        throw new Error("Failed to fetch role ID");
      }
      return await res.json();
    }
    catch (error) {
      throw new Error("Failed to fetch role ID");
    }
  }
}