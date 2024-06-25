<script lang="jsx">
import Vue from "vue";
import { Dom } from "@kizmann/pico-js";
import CncAxisControl from "@/plugins/Cnc/control/components/CncAxisControl.vue";
import CncAxisStatus from "@/plugins/Cnc/control/components/CncAxisStatus.vue";

export default Vue.extend({

    name: 'CncViewer',

    components: {
        [CncAxisControl.name]: CncAxisControl,
        [CncAxisStatus.name]: CncAxisStatus
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

    data()
    {
        return { test: 'jjaaaa' };
    },

    renderMenu()
    {
        return (
            <CncMenu></CncMenu>
        );
    },

    render()
    {
        return (
            <div>
                {this.ctor('renderMenu')()}
                <div class="cnc-view-toolchanger">
                    <vIcon>mdi-hammer-screwdriver</vIcon><span>Coming soon</span>
                </div>
            </div>
        );
    }
});
</script>
<style lang="scss">

@import "../scss/index.scss";

.cnc-view-toolchanger {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px;
}

.cnc-view-toolchanger i {
    font-size: 48px !important;
    opacity: 0.3;
}

.cnc-view-toolchanger span {
    font-size: 32px;
    opacity: 0.6;
}

</style>
