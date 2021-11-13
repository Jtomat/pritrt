import { $host } from "@/http-clients/clients";

export interface WorkerRoleModel {
  id: number;
  name: string;
  rate: number;
}

export class WorkerRoleClient {
  _api = "/au/conf/roles/";

  async updateRole(role: WorkerRoleModel): Promise<any> {
    const { data } = await $host.put<any>(this._api + `${role.id}`, role);
    return data;
  }

  async addRole(role: WorkerRoleModel): Promise<any> {
    const { data } = await $host.post<any>(this._api, role);
    return data;
  }

  async delete(role: WorkerRoleModel): Promise<any> {
    const { data } = await $host.delete<any>(this._api + `${role.id}`);
    return data;
  }
}
