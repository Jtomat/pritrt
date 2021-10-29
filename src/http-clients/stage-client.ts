import { TaskModel } from "../http-clients/task-client";
import { $host } from "@/http-clients/clients";
import { ProjectModel } from "@/http-clients/project-client";

export class StageModel {
  id!: number;
  name!: string;
  dateEnd!: Date;
  dateStart!: Date;
  dateActualEnd!: Date;
  finished;
  tasks!: Array<TaskModel>;
  projectId?: number;
  constructor(data: StageModel) {
    this.id = data?.id;
    this.name = data?.name;
    this.tasks = data?.tasks;
    this.dateStart = data?.dateStart;
    this.dateEnd = data?.dateEnd;
    this.dateActualEnd = data?.dateActualEnd;
    this.projectId = data?.projectId;
    this.finished = () => {
      let all = 0;
      let fin = 0;
      this.tasks.forEach((task) => {
        all++;
        if (task.finished === 100) fin++;
      });
      return all > 0 ? fin / all : 0;
    };
  }
}

export class StageClient {
  _api = "/stages/";

  async create(dataItem: StageModel, projectId: number): Promise<StageModel> {
    dataItem.projectId = projectId;
    const { data } = await $host.post<StageModel>(this._api + "add", dataItem);
    return data;
  }

  async getAll(): Promise<StageModel[]> {
    const { data } = await $host.get<StageModel[]>(this._api);
    data.forEach((st) => {
      st.finished = new StageModel(st).finished;
    });
    return data;
  }

  async remove(dataItem: StageModel): Promise<void> {
    const { data } = await $host.delete<void>(
      this._api + `remove/${dataItem.id}`
    );
    return data;
  }

  async update(dataItem: StageModel): Promise<StageModel> {
    const { data } = await $host.put<StageModel>(
      this._api + `edit/${dataItem.id}`,
      dataItem
    );
    return data;
  }
}
