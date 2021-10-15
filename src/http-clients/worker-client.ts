import { AppUserModel } from "../http-clients/app-user-client";
import { WorkerRoleModel } from "../http-clients/worker-role-client";

export interface WorkerModel {
  id: number;
  user: AppUserModel;
  workerRole: WorkerRoleModel;
}
