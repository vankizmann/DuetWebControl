<script lang="jsx">
import Vue from "vue";
import { Dom } from "@kizmann/pico-js";
import CncSpindleControl from "@/plugins/Cnc/control/components/CncSpindleControl.vue";
import CncAxisStatus from "@/plugins/Cnc/control/components/CncAxisStatus.vue";
import CncAxisControl from "@/plugins/Cnc/control/components/CncAxisControl.vue";
import CncProbeControl from "@/plugins/Cnc/control/components/CncProbeControl.vue";
import CncLightControl from "@/plugins/Cnc/control/components/CncLightControl.vue";
import CncMachineSpeed from "@/plugins/Cnc/control/components/CncMachineSpeed.vue";

export default Vue.extend({

    name: 'CncControl',

    components: {
        [CncSpindleControl.name]: CncSpindleControl,
        [CncAxisControl.name]: CncAxisControl,
        [CncAxisStatus.name]: CncAxisStatus,
        [CncProbeControl.name]: CncProbeControl,
        [CncLightControl.name]: CncLightControl,
        [CncMachineSpeed.name]: CncMachineSpeed,
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

    renderMenu()
    {
        return (
            <CncMenu></CncMenu>
        );
    },

    render()
    {
        if ( this.$route.path !== '/Cnc/Control' ) {
            return null;
        }

        return (
            <div>
                {this.ctor('renderMenu')()}
                <div class="cnc-view-control">
                    <div class="is-row">
                        <CncLightControl class="is-fixed"></CncLightControl>
                        <CncMachineSpeed class="is-auto"></CncMachineSpeed>
                        <CncSpindleControl class="is-auto"></CncSpindleControl>
                    </div>
                    <div class="is-row">
                        <CncAxisStatus class="is-100"></CncAxisStatus>
                        <CncAxisControl class="is-50"></CncAxisControl>
                        <CncProbeControl class="is-50"></CncProbeControl>
                    </div>
                </div>
            </div>
        );
    }
});
</script>
<style lang="scss">

@import "../scss/index.scss";

.cnc-view-control {
    padding: 30px 0 0;
    width: calc(100% + 30px);
    margin-left: -15px;
}

.cnc-view-control .is-row {
    display: flex;
    flex-wrap: wrap;
}

.cnc-view-control .is-row > div {
    flex: 1 1 auto;
    margin-left: 15px;
    margin-right: 15px;
    box-shadow: $plugin-box-shadow;
}

.cnc-view-control .is-row > div.is-fixed {
    flex: 0 0 auto !important;
}

.cnc-view-control .is-row > div.is-100 {
    width: calc(100% - 30px);
}

.cnc-view-control .is-row > div.is-50 {
    width: calc(50% - 30px);
    min-width: 450px;
}

.cnc-view-control .is-row > div {
    margin-bottom: 30px;
}

</style>