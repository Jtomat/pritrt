import { WorkerModel } from "../http-clients/worker-client";

export interface TaskModel {
  id: number;
  name: string;
  info: string;
  actDate: Date;
  dateEnd: Date;
  dateStart: Date;
  finished: number;
  worker: WorkerModel;
}
