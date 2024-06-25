<style>
.vue-3d-viewer {
  display: block;
  width: 100% !important;
  height: 500px !important;
}
</style>

<script lang="jsx">
//Imports
import * as update from './lib/update';
import { setup, teardown } from './lib/scene';
import Vue from "vue";
import store from "@/store";
import Path from "@/utils/path";
import { Arr } from "@kizmann/pico-js";

export default Vue.extend({
  props: {
    extension: {
      type: String,
      required: true
    },
    plane: {
      default: () => ({
        X: 20,
        Y: 20
      }),
      type: Object
    },
    position: {
      default: () => ({
        X: 0,
        Y: 0,
        Z: 0
      }),
      type: Object
    },
    rotation: {
      default: () => ({
        X: - 90,
        Y: 0,
        Z: 180
      }),
      type: Object
    },
    scale: {
      default: () => ({
        X: 0.1,
        Y: 0.1,
        Z: 0.1
      }),
      type: Object
    },
    theme: {
      default: () => ({
        background: '#dfe4ed',
        plane: '#586375',
        primary: '#4287f5',
        secondary: '#0a2f6b'
      }),
      type: Object
    },
    transfer: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    visibleAxes()
    {
      return store.state.machine.model.move.axes.filter(axis => axis.visible);
    },
    yAxis()
    {

      let axis = null;

      this.visibleAxes.forEach((item) => {
        if ( item.letter.toLowerCase() == 'y' ) axis = item;
      });

      return axis;
    },
    xAxis()
    {

      let axis = null;

      this.visibleAxes.forEach((item) => {
        if ( item.letter.toLowerCase() == 'x' ) axis = item;
      });

      return axis;
    },
    zAxis()
    {

      let axis = null;

      this.visibleAxes.forEach((item) => {
        if ( item.letter.toLowerCase() == 'z' ) axis = item;
      });

      return axis;
    },
  },
  data()
  {
    return {
      filepath: null, file: null, filelist: [], drill: { X: 0, Y: 0, Z: 0 }
    };
  },
  mounted()
  {
    this.getFilelist();
    //Setup the scene
    setup(this.$refs.canvas, this.plane, this.theme);

    this.drill = {
      X: this.xAxis.userPosition,
      Y: this.yAxis.userPosition,
      Z: this.zAxis.userPosition,
    };

    update.drill(this.drill);
  },
  beforeDestroy()
  {
    teardown();
  },
  methods: {

    getFilelist()
    {
      store.dispatch("machine/getFileList", '0:/gcodes/').then((res) => {
        this.filelist = res;
        console.log(res);
        this.getFirstFile()
      });
    },
    async getFirstFile()
    {
      let ordered = Arr.sort(this.filelist, (a, b) => {

        if ( a.lastModified / 1000 === b.lastModified / 1000 ) {
          return 0;
        }

        return a.lastModified / 1000 > b.lastModified / 1000 ? - 1 : 1;
      });

      let first = Arr.first(ordered);

      if ( first == null ) {
        return;
      }

      let gcode = await store.dispatch("machine/download", {
        filename: this.filepath = Path.combine('0:/gcodes/', first.name), type: "text", showSuccess: false
      });

      let enc = new TextEncoder();

      this.file = enc.encode(gcode);
    }
  },
  watch: {
    'xAxis.userPosition': function () {
      this.drill.X = this.xAxis.userPosition;
      update.drill(this.drill);
    },
    'yAxis.userPosition': function () {
      this.drill.Y = this.yAxis.userPosition;
      update.drill(this.drill);
    },
    'zAxis.userPosition': function () {
      this.drill.Z = this.zAxis.userPosition;
      update.drill(this.drill);
    },
    file: async function (file) {
      await update.file(file, this.extension, this.transfer, this.theme, percent => {
        this.$emit('progress', percent);
      });

      update.position(this.position);
      update.rotation(this.rotation);
      update.scale(this.scale);

      this.$emit('done');
    },
    plane: {
      deep: true,
      handler: update.plane
    },
    position: {
      deep: true,
      handler: update.position
    },
    rotation: {
      deep: true,
      handler: update.rotation
    },
    scale: {
      deep: true,
      handler: update.scale
    },
    theme: {
      deep: true,
      handler: update.theme
    }
  },
  render()
  {
    return (
        <div class="mahwraap">
          <div class="vue-3d-viewer" ref="canvas" />
        </div>
    )
  }
});
</script>
