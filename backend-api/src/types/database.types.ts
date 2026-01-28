import { PrismaClient } from "@prisma/client";

/**
 * Transaction client type - Prisma client without connection methods
 */
export type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

/**
 * Generic model delegate interface for DAL operations
 */
export interface ModelDelegate {
  create: (args: any) => Promise<any>;
  createMany: (args: any) => Promise<any>;
  findMany: (args?: any) => Promise<any[]>;
  findUnique: (args: any) => Promise<any>;
  findFirst: (args?: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  updateMany: (args: any) => Promise<any>;
  upsert: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
  deleteMany: (args?: any) => Promise<any>;
  count: (args?: any) => Promise<number>;
  aggregate: (args: any) => Promise<any>;
  groupBy: (args: any) => Promise<any[]>;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  skip?: number;
  take?: number;
}
