import { TaskModel } from "../http-clients/task-client";

export interface StageModel {
  id: number;
  name: string;
  dateEnd: Date;
  dateStart: Date;
  dateActualEnd: Date;
  finished: number;
  tasks: Array<TaskModel>;
}

export class StageClient {
  _api = "/stages/";
}
