import { Application } from "./Application";
import { CameraHandle } from "./CameraHandle";
import { HandleMap } from "./HandleMap";

export class CameraManager extends HandleMap<CameraHandle> {
  constructor() {
    super(CameraHandle);
  }
}
