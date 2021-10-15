import { WorkerModel } from "../http-clients/worker-client";
import {$host} from "@/http-clients/clients";

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

export class TaskClient {
  _api = "/tasks/";

  async getTasksForUser(id: number): Promise<any[]>{
    const { data } = await $host.get<any[]>(this._api + `/user/${id}`);
    return data;
  }

  async closeTask(taskModel: TaskModel): Promise<any> {
    taskModel.finished = 100;
    const { data } = await $host.put<any>(this._api + `/edit/${taskModel.id}`,  taskModel);
    return data;
  }
}
