<style>

.cnc-view .v-main__wrap > div:last-child {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 10px 20px 20px
}

.cnc-view .theme--light .v-main__wrap > div:last-child {
    background: linear-gradient(0deg, #ffffff 0%, #B7DAF7 100%);
}

.cnc-view .theme--dark .v-main__wrap > div:last-child {
    background: linear-gradient(180deg, #121212 0%, #0B1D2C 100%);
}

.cnc-menu {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border-bottom: 2px solid #2196f3;
}

.cnc-menu > a {
    padding: 6px 16px;
    font-size: 19px;
    display: inline-block;
    margin-right: 10px;
    color: rgba(255, 255, 255, 0.4);
    border-radius: 5px;
    text-decoration: none;
}

.cnc-menu > a:first-child {
    color: #2196f3;
}

.cnc-menu > a:hover {
    background: rgba(255, 255, 255, 0.1);
}

.cnc-home {
    display: flex;
    margin-top: 30px;
    padding: 15px;
    color: #fff;
    background: #177FD1;
    border-radius: 5px;
}

.cnc-home > div,
.cnc-spindle > div {
    display: flex;
    align-items: center;
    padding: 0 15px;
}

.cnc-home > div:not(:last-child),
.cnc-spindle > div:not(:last-child) {
    border-right: 1px solid rgba(255, 255, 255, 0.15);
}

.cnc-home > div > strong {
    margin-right: 15px;
}

.cnc-home > div > span {
    display: inline-block;
    width: 116px;
    margin-right: 15px;
    padding: 5px 0;
    text-align: center;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    font-weight: 600;
}

.cnc-home > div > span i {
    opacity: 0.5;
    font-weight: 400;
    font-style: normal;
}

.cnc-home > div > span i:after {
    content: '/';
    margin-left: 5px;
}


.cnc-joystick {
    margin-top: 30px;
    padding: 20px;
    border-radius: 5px;
    background: #272727;
}

.cnc-spindle {
    display: flex;
    margin-top: 30px;
    padding: 20px;
    border-radius: 5px;
    background: #1B1B1B;
}

.cnc-spindle > div > *:not(:last-child) {
    margin-right: 15px;
}

.cnc-spindle > div > button {
    //padding: 0 !important;
    min-width: 36px !important;
}

.cnc-spindle > div > span {
    display: inline-block;
    width: 120px;
    padding: 5px 0;
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

</style>

<script lang="jsx">
import Vue from "vue";

import store from "@/store";
import { Dom } from "@kizmann/pico-js";
import { MachineEvent } from "@/store/machine";
import { mapState } from "vuex";
import ObjectModel from "@duet3d/objectmodel";
import zprobe from "@/plugins/Cnc/assets/z-probe.svg";

// const benchy = require('arraybuffer-loader!./benchy.gcode');
// const holes = require('arraybuffer-loader!./CutManyHoles.cnc.gcode');

export default Vue.extend({

    data()
    {
        return {
            renderMe: false, file: holes
        };
    },

    mounted()
    {

    },

    beforeRouteEnter(from, to, next)
    {
        Dom.find(document.body).addClass('cnc-view');

        next();
    },

    beforeRouteLeave(to, from, next)
    {
        Dom.find(document.body).removeClass('cnc-view');

        next();
    },

    computed: {
        loop()
        {
            return store.state.tooloffset.loop;
        },
        model()
        {
            return store.state.machine.model;
        },
    },

    methods: {
        increase()
        {
            store.commit('tooloffset/patch');
        }
    },

    renderMenu()
    {
        return (
            <div class="cnc-menu">
                <a href="/Cnc/Control">Control</a>
                <a href="/Cnc/Viewer">Viewer</a>
            </div>
        )
    },

    renderTest()
    {
        let zprobe = require('../Cnc/assets/z-probe.svg');

        return (
            <div style="margin-top: 30px; display: flex; flex-direction: row; align-items: center; backgr1ound: #000; backgroun2d: rgba(255, 255, 255, 0.1); border-radius: 5px;">
            <div style="width: 110px; height: 110px; padding: 30px">
                <img src={zprobe} alt="" />
            </div>
                <div>
                    <vBtn color="primary">Puck probe Z (19.5 mm)</vBtn>
                </div>
            </div>
        );
    },

    render()
    {
        if ( ! this.renderMe ) {
            return null;
        }

        return (
            <div>
                {this.ctor('renderMenu')()}
                <div class="cnc-spindle">
                    <div>
                        <strong>Spindle</strong>
                        <span>14.000 RPM</span>
                        <vBtn color="primary">Turn on</vBtn>
                        <vBtn>-</vBtn>
                        <vBtn>+</vBtn>
                    </div>
                    <div>
                        <strong>Speed</strong>
                        <span>100 %</span>
                        <vBtn>-</vBtn>
                        <vBtn>+</vBtn>
                    </div>
                </div>
                <div class="cnc-home">
                    <div>
                        <strong>X</strong> <span><i>2</i> 32.2</span>
                        <vBtn color="primary">Ref X</vBtn>
                    </div>
                    <div>
                        <strong>Y</strong> <span><i>200</i> -102.9</span>
                        <vBtn color="primary">Ref Y</vBtn>
                    </div>
                    <div>
                        <strong>Z</strong> <span><i>2</i> -10.2</span>
                        <vBtn color="primary">Ref Z</vBtn>
                    </div>
                    <div>
                        <vBtn>Home all</vBtn>
                    </div>
                </div>
                <div class="cnc-joystick">
                    Foobar
                </div>
                {this.ctor('renderTest')()}
            </div>
        );
    }
});
</script>
