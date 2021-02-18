import { Renderer } from "three";

import { Application } from "./Application";
import { CameraHandle } from "./CameraHandle";
import { EventDispatcher } from "./EventDispatcher";
import { Handle } from "./Handle";
import { SceneHandle } from "./SceneHandle";

type OnChangeScene = (name: string, scene?: SceneHandle) => Promise<void>;
type OnChangeCamera = (name: string, camera?: CameraHandle) => Promise<void>;

interface DisposableRenderer {
  dispose?: () => void;
}

export class RendererHandle extends Handle {
  private _app: Application;

  private _sceneName?: string;
  private _cameraName?: string;

  private _scene?: SceneHandle;
  private _camera?: CameraHandle;

  private _onChangeScene = new EventDispatcher<OnChangeScene>();
  private _onChangeCamera = new EventDispatcher<OnChangeCamera>();

  private _changeQueue = Promise.resolve();

  private _renderer?: Renderer;

  public get scene() {
    return this._scene;
  }
  public get camera() {
    return this._camera;
  }
  public get onChangeScene() {
    return this._onChangeScene;
  }
  public get onChangeCamera() {
    return this._onChangeCamera;
  }

  constructor(app: Application) {
    super();
    this._app = app;
  }

  public render = () => {};

  public set(renderer?: Renderer) {
    if (this._renderer === renderer) {
      return;
    }
    this._renderer = renderer;
  }
  public get() {
    return this._renderer;
  }

  public setScene(name?: string): Promise<void> {
    if (this._sceneName !== name) {
      this._sceneName = name;
      const scene = name ? this._app.scenes.get(name) : undefined;
      return this.updateScene(scene);
    }
    return this._changeQueue;
  }
  public setCamera(name?: string): Promise<void> {
    if (this._cameraName !== name) {
      this._cameraName = name;
      if (this._scene) {
        const camera = name ? this._scene.cameras.get(name) : undefined;
        return this.updateCamera(camera);
      }
    }
    return this._changeQueue;
  }

  protected load() {
    this._app.scenes.watch(this.watchScenes);
    return super.load().then(() => {
      return this._changeQueue;
    });
  }

  protected unload() {
    this._app.scenes.unwatch(this.watchScenes);
    return super.unload().then(() => {
      const value = this.get() as DisposableRenderer | undefined;
      if (value && value.dispose) {
        value.dispose();
      }
      return this._changeQueue;
    });
  }

  private updateScene(scene?: SceneHandle): Promise<void> {
    if (this._scene !== scene) {
      this._changeQueue = this._changeQueue
        .then(() => {
          if (this._scene) {
            this._scene.cameras.unwatch(this.watchCameras);
          }
          return this._scene ? this._scene.unuse() : Promise.resolve();
        })
        .then(() => {
          this._scene = scene;
          if (this._scene) {
            this._scene.cameras.watch(this.watchCameras);
          }
          return scene ? scene.use() : Promise.resolve();
        });
    }
    return this._changeQueue;
  }
  private updateCamera(camera?: CameraHandle): Promise<void> {
    if (this._camera !== camera) {
      this._changeQueue = this._changeQueue
        .then(() => {
          return this._camera ? this._camera.unuse() : Promise.resolve();
        })
        .then(() => {
          this._camera = camera;
          return camera ? camera.use() : Promise.resolve();
        });
    }
    return this._changeQueue;
  }

  private watchScenes = (name: string, scene?: SceneHandle) => {
    if (this._sceneName === name) {
      this.updateScene(scene);
    }
  };
  private watchCameras = (name: string, camera?: CameraHandle) => {
    if (this._cameraName === name) {
      this.updateCamera(camera);
    }
  };
}
