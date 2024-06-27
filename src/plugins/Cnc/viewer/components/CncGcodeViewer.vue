<script lang="jsx">
import * as update from '../lib/update';
import { setup, teardown } from '../lib/scene';
import store from "@/store";
import Path, { escapeFilename } from "@/utils/path";
import { Arr, Obj, Any } from "@kizmann/pico-js";

export default {

    name: 'CncGcodeViewer',

    computed: {

        file()
        {
            return store.state.cnc_settings.file;
        },

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

        file()
        {
            this.loadFile();
        },

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

    data()
    {
        return {
            gcode: null
        };
    },

    mounted()
    {
        setup(this.$refs.canvas);

        if ( ! Any.isEmpty(this.file) ) {
            this.loadFile();
        }

        this.sendUpdate();
    },

    beforeDestroy()
    {
        teardown();
    },

    methods: {

        async loadFile()
        {
            if ( Any.isEmpty(this.file) ) {
                return;
            }

            this.gcode = await store.dispatch("machine/download", {
                filename: Path.combine('0:/gcodes/', this.file), type: "text", showSuccess: false
            });

            await this.sendFile();
        },

        async sendFile()
        {
            if ( Any.isEmpty(this.gcode) ) {
                return;
            }

            await update.file(this.gcode, (percent) => {
                this.$emit('progress', percent);
            });
        },

        async startJob()
        {
            let filename = Path.combine('0:/gcodes/', this.file);

            if ( Any.isEmpty(this.file) ) {
                return;
            }

            await store.dispatch("machine/sendCode", `M32 "${escapeFilename(filename)}"`);
        },

        sendUpdate()
        {
            update.drill({
                X: this.xAxis*-1, Y: this.yAxis, Z: this.zAxis,
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

    renderJob()
    {
        if ( Any.isEmpty(this.file) ) {
            return null;
        }

        return (
            <ConfirmBtn class="cnc-gcode-viewer__job" color="primary" on-click={this.startJob}>
                {this.$t('Start job')}
            </ConfirmBtn>
        );
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
                {[this.ctor('renderToolbar')(), this.ctor('renderCanvas')(), this.ctor('renderJob')()]}
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

.cnc-gcode-viewer__toolbar i {
    margin-right: 8px;
    font-size: 18px !important;
}

.cnc-gcode-viewer__job {
    z-index: 200;
    position: absolute;
    top: 15px;
    right: 15px;
    display: flex;
}

</style>