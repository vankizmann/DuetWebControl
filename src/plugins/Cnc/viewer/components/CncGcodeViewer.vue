<script lang="jsx">
import * as update from '../lib/update';
import { setup, teardown } from '../lib/scene';
import store from "@/store";
import Path from "@/utils/path";
import { Arr, Obj } from "@kizmann/pico-js";
const holes = require('arraybuffer-loader!../demo/holes.cnc.gcode');

export default {

    name: 'CncGcodeViewer',

    props: {

        file: {
            default()
            {
                return holes;
            }
        }

    },

    computed: {

        xAxis()
        {
            let axis = Arr.find(store.state.machine.model.move.axes, {
                letter: 'X'
            });

            return Obj.get(axis, 'userPosition', 0);
        },

        yAxis()
        {
            let axis = Arr.find(store.state.machine.model.move.axes, {
                letter: 'Y'
            });

            return Obj.get(axis, 'userPosition', 0);
        },

        zAxis()
        {
            let axis = Arr.find(store.state.machine.model.move.axes, {
                letter: 'Z'
            });

            return Obj.get(axis, 'userPosition', 0);
        },

    },

    watch: {

        xAxis()
        {
            this.sendUpdate();
        },

        yAxis()
        {
            this.sendUpdate();
        },

        zAxis()
        {
            this.sendUpdate();
        },

    },

    mounted()
    {
        setup(this.$refs.canvas);

        this.sendUpdate();

        this.sendFile();
    },

    beforeDestroy()
    {
        teardown();
    },

    methods: {

        async sendFile()
        {
            await update.file(this.file, (percent) => {
                this.$emit('progress', percent);
            });
        },

        sendUpdate()
        {
            update.drill({
                X: this.xAxis, Y: this.yAxis, Z: this.zAxis,
            });
        },

        cameraReset()
        {
            update.camera();
        },

        cameraTop()
        {
            update.camera(0, 0, 50);
        },

        cameraFront()
        {
            update.camera(0, 50, 0);
        }

    },

    renderToolbar()
    {

        return (
            <div class="cnc-gcode-viewer__toolbar">
                <vBtn color="primary" on-click={this.cameraReset}>
                    <vIcon>mdi-camera-retake</vIcon>
                    {this.$t('Reset')}
                </vBtn>
                <vBtn color="default" on-click={this.cameraTop}>
                    {this.$t('Top view')}
                </vBtn>
                <vBtn color="default" on-click={this.cameraFront}>
                    {this.$t('Front view')}
                </vBtn>
            </div>
        );
    },

    renderCanvas()
    {
        return (
            <div class="cnc-gcode-viewer__canvas" ref="canvas" />
        );
    },

    render()
    {
        return (
            <div class="cnc-gcode-viewer">
                {[this.ctor('renderToolbar')(), this.ctor('renderCanvas')()]}
            </div>
        );
    }

};
</script>
<style lang="scss">

@import "../../scss/vars";

.cnc-gcode-viewer {
    position: relative;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
}

.cnc-gcode-viewer__canvas {
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
}

.cnc-gcode-viewer__toolbar {
    z-index: 200;
    position: absolute;
    top: 15px;
    left: 15px;
    display: flex;
}

.cnc-gcode-viewer__toolbar > *:not(:last-child) {
    margin-right: 10px;
}

</style>