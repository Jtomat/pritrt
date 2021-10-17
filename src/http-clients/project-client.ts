import { $host } from "../http-clients/clients";
import { StageModel } from "../http-clients/stage-client";

export abstract class ProjectModel {
  id = -1;
  name = "";
  info = "";
  stages: Array<StageModel> = [];
  dateStart() {
    let minDate = new Date();
    this.stages.forEach((stage) => {
      if (stage.dateStart < minDate) minDate = stage.dateStart;
    });
    return minDate;
  }
  dateEnd() {
    let maxDate = new Date();
    this.stages.forEach((stage) => {
      if (stage.dateEnd < maxDate) maxDate = stage.dateEnd;
    });
    return maxDate;
  }
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
    return data;
  }
}
