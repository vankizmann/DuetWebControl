<script lang="jsx">
import Vue from "vue";
import { Dom } from "@kizmann/pico-js";
import CncAxisControl from "@/plugins/Cnc/control/components/CncAxisControl.vue";
import CncAxisStatus from "@/plugins/Cnc/control/components/CncAxisStatus.vue";
import CncFileList from "@/plugins/Cnc/viewer/components/CncFileList.vue";
import CncGcodeViewer from "@/plugins/Cnc/viewer/components/CncGcodeViewer.vue";

export default Vue.extend({

    name: 'CncViewer',

    components: {
        [CncFileList.name]: CncFileList,
        [CncGcodeViewer.name]: CncGcodeViewer,
        [CncAxisControl.name]: CncAxisControl,
        [CncAxisStatus.name]: CncAxisStatus,
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
        if ( this.$route.path !== '/Cnc/Viewer' ) {
            return null;
        }

        return (
            <div>
                {this.ctor('renderMenu')()}
                <div class="cnc-view-viewer">
                    <div class="cnc-view-viewer__content">
                        <CncGcodeViewer></CncGcodeViewer>
                    </div>
                    <div class="cnc-view-viewer__sidebar">
                        <CncFileList class="is-odd"></CncFileList>
                        <CncAxisControl class="is-even"></CncAxisControl>
                        <CncAxisStatus vertical={true} class="is-full"></CncAxisStatus>
                    </div>
                </div>
            </div>
        );
    }
});
</script>
<style lang="scss">

@import "../scss/index.scss";

.cnc-view-viewer {
    display: flex;
    padding: 30px 0;
}

@media (max-width: 1024px) {
    .cnc-view-viewer {
        flex-direction: column;
    }
}

.cnc-view-viewer__content {
    position: relative;
    flex: 1 1 auto;
    width: 100%;
    min-height: 500px;
}

.cnc-view-viewer__content > div {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background: rgba(#000, 0.5);
}

.cnc-view-viewer__sidebar {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 400px;
    padding-left: 30px;
}

@media (max-width: 1024px) {
    .cnc-view-viewer__sidebar {
        width: 100%;
        flex-direction: row;
        padding-left: 0;
        padding-top: 30px;
    }
}

.cnc-view-viewer__sidebar > div {
    width: 100%;
    box-shadow: $plugin-box-shadow;
}

@media (max-width: 1024px) {
    .cnc-view-viewer__sidebar > div {
        width: calc(50% - 15px);
    }

    .cnc-view-viewer__sidebar > div.is-odd {
        margin-right: 15px;
    }

    .cnc-view-viewer__sidebar > div.is-even {
        margin-left: 15px;
    }
}

.cnc-view-viewer__sidebar > div.is-full {
    width: 100%;
    margin-left: 0 !important;
    margin-right: 0 !important;
}

.cnc-view-viewer__sidebar > div:not(:last-child) {
    margin-bottom: 30px;
}

</style>
