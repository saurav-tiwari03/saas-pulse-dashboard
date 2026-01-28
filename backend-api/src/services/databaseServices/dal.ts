import { TransactionClient, ModelDelegate } from "../../types";

/**
 * Data Access Layer (DAL)
 * Base class for all model services providing common CRUD operations
 */
class Dal<T extends ModelDelegate> {
  protected model: T;
  protected modelName: string;

  constructor(model: T, modelName: string) {
    this.model = model;
    this.modelName = modelName;
  }

  protected getModel(tx?: TransactionClient): T {
    if (tx) {
      // Use unknown as intermediate type for safe casting
      return (tx as unknown as Record<string, T>)[this.modelName];
    }
    return this.model;
  }

  create(data: Parameters<T["create"]>[0], tx?: TransactionClient) {
    return this.getModel(tx).create({ ...data });
  }

  createMany(data: Parameters<T["createMany"]>[0], tx?: TransactionClient) {
    return this.getModel(tx).createMany({ ...data });
  }

  findMany(params?: Parameters<T["findMany"]>[0], tx?: TransactionClient) {
    return this.getModel(tx).findMany({ ...params });
  }

  findOne(params: Parameters<T["findUnique"]>[0], tx?: TransactionClient) {
    return this.getModel(tx).findUnique({ ...params });
  }

  findFirst(params?: Parameters<T["findFirst"]>[0], tx?: TransactionClient) {
    return this.getModel(tx).findFirst({ ...params });
  }

  update(params: Parameters<T["update"]>[0], tx?: TransactionClient) {
    return this.getModel(tx).update({ ...params });
  }

  updateMany(params: Parameters<T["updateMany"]>[0], tx?: TransactionClient) {
    return this.getModel(tx).updateMany({ ...params });
  }

  upsert(params: Parameters<T["upsert"]>[0], tx?: TransactionClient) {
    return this.getModel(tx).upsert({ ...params });
  }

  delete(params: Parameters<T["delete"]>[0], tx?: TransactionClient) {
    return this.getModel(tx).delete({ ...params });
  }

  deleteMany(params?: Parameters<T["deleteMany"]>[0], tx?: TransactionClient) {
    return this.getModel(tx).deleteMany({ ...params });
  }

  count(params?: Parameters<T["count"]>[0], tx?: TransactionClient) {
    return this.getModel(tx).count({ ...params });
  }

  aggregate(params: Parameters<T["aggregate"]>[0], tx?: TransactionClient) {
    return this.getModel(tx).aggregate({ ...params });
  }

  groupBy(params: Parameters<T["groupBy"]>[0], tx?: TransactionClient) {
    return this.getModel(tx).groupBy({ ...params });
  }
}

export default Dal;
