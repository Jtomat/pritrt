import { AppUserModel } from "../http-clients/app-user-client";
import { WorkerRoleModel } from "../http-clients/worker-role-client";
import { $host } from "@/http-clients/clients";

export interface WorkerModel {
  id: number;
  user: AppUserModel;
  role: WorkerRoleModel;
}
export class WorkerClient {
  _api = "/au/";

  async getAllWorkers(): Promise<any[]> {
    const { data } = await $host.get<any[]>(this._api + `/conf/worker`);
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
