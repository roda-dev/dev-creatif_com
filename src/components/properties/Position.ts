import { Component, Mixins, Prop, Watch } from "vue-property-decorator";

import { ObjectComponent } from "../../mixins";

@Component
export class Position extends Mixins(ObjectComponent) {
  @Prop({
    required: true,
    type: Object
  })
  private value!: { x: number; y: number; z: number };

  @Watch("value", { deep: true })
  private onChange() {
    this.object!.position.set(this.value.x, this.value.y, this.value.z);
  }

  public created() {
    if (!this.object) {
      throw new Error(
        "Position property can only be added as child to an object component"
      );
    }
    this.onChange();
  }

  public render(h: any) {
    return h();
  }
}
