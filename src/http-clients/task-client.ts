import { WorkerModel } from "../http-clients/worker-client";
import { $host } from "@/http-clients/clients";
import { StageModel } from "@/http-clients/stage-client";

export interface TaskModel {
  id: number;
  name: string;
  info: string;
  actDate: Date;
  dateEnd: Date;
  dateStart: Date;
  finished: number;
  worker: WorkerModel;
  stageId?: number;
}

export class TaskClient {
  _api = "/tasks/";

  async getTasksForUser(id: number): Promise<any[]> {
    const { data } = await $host.get<any[]>(this._api + `user/${id}`);
    return data;
  }

  async closeTask(taskModel: TaskModel): Promise<any> {
    taskModel.finished = 100;
    const { data } = await $host.put<any>(
      this._api + `/edit/${taskModel.id}`,
      taskModel
    );
    return data;
  }

  async remove(dataItem: TaskModel): Promise<void> {
    const { data } = await $host.delete<void>(
      this._api + `remove/${dataItem.id}`
    );
    return data;
  }

  async create(dataItem: any, stageId: number): Promise<TaskModel> {
    dataItem.stageId = stageId;
    dataItem.workerId = dataItem.worker.id;
    const { data } = await $host.post<TaskModel>(this._api + "add", dataItem);
    return data;
  }
}
