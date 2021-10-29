import { $host } from "../http-clients/clients";
import { StageModel } from "../http-clients/stage-client";

export abstract class ProjectModel {
  id = -1;
  name = "";
  info = "";
  stages: Array<StageModel> = [];
  dateStart;
  dateEnd;
}

export interface GanttItemModel {
  id: number;
  orderId: number;
  parentId: number;
  resources: string;
  title: string;
  summary: true;
  expanded: true;
  percentComplete: 0;
  start: Date;
  end: Date;
}

export class ProjectClient {
  _api = "/project/";

  async getTableData(): Promise<any[]> {
    const { data } = await $host.get<any[]>(this._api + "excel");
    return data;
  }

  async getAllProjects(): Promise<ProjectModel[]> {
    const { data } = await $host.get<ProjectModel[]>(this._api);
    data.forEach((pr) => {
      let minDate = new Date(8640000000000000);
      pr.stages.forEach((stage) => {
        if (new Date(stage.dateStart) < minDate)
          minDate = new Date(stage.dateStart);
      });
      let maxDate = new Date(-8640000000000000);
      pr.stages.forEach((stage) => {
        if (new Date(stage.dateEnd) > maxDate)
          maxDate = new Date(stage.dateEnd);
      });
      pr.dateEnd = maxDate;

      pr.dateStart = minDate;
      pr.stages.forEach((st) => {
        st.finished = new StageModel(st).finished;
      });
    });
    return data;
  }

  async remove(dataItem: ProjectModel): Promise<void> {
    const { data } = await $host.delete<void>(
      this._api + `remove/${dataItem.id}`
    );
    return data;
  }

  async create(dataItem: ProjectModel): Promise<ProjectModel> {
    const { data } = await $host.post<ProjectModel>(
      this._api + "add",
      dataItem
    );
    return data;
  }
}
