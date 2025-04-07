import { Users, Members, Organizations } from "@prisma/client";

export interface UserMembership {
  id: number;
  role: string;
  status: memberStatus;
  organizationId: number;
  organizationName: string;
  isAdmin: boolean;
}

export type memberStatus = "VOLUNTEER" | "SUBSCRIBER" | "INTERN" | "EMPLOYEE";

export interface SafeUser {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  isSuperAdmin: boolean;
  memberships: UserMembership[];
}

export interface UserWithMemberships extends Users {
  memberships: (Members & { organization: Organizations })[];
}

export function transformUserToSafeUser(user: UserWithMemberships): SafeUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isSuperAdmin: user.isSuperAdmin,
    memberships: user.memberships.map((membership) => ({
      id: membership.id,
      status: membership.status,
      role: membership.role,
      organizationId: membership.organizationId,
      organizationName: membership.organization.name,
      isAdmin: membership.isAdmin,
    })),
  };
}
