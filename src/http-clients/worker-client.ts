import { AppUserModel } from "../http-clients/app-user-client";
import { WorkerRoleModel } from "../http-clients/worker-role-client";
import { $host } from "@/http-clients/clients";

export class WorkerModel {
  id!: number;
  user!: AppUserModel;
  role!: WorkerRoleModel;
  fullInfo = "";
}
export class WorkerClient {
  _api = "/au/";

  async getAllWorkers(): Promise<WorkerModel[]> {
    const { data } = await $host.get<WorkerModel[]>(this._api + `/conf/worker`);
    data.forEach(
      (item) => (item.fullInfo = `${item.user.name}: ${item.role.name}`)
    );
    return data;
  }

  async getAllRoles(): Promise<any[]> {
    const { data } = await $host.get<any[]>(this._api + `/conf/roles`);
    return data;
  }

  async updateWorker(worker: WorkerModel, role: WorkerRoleModel): Promise<any> {
    const body = { appuserId: worker.user.id, workerRoleId: role.id };
    const { data } = await $host.put<any>(
      this._api + `/conf/worker/upd/${worker.id}`,
      body
    );
    return data;
  }
}
