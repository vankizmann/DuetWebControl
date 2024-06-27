import { registerCategory, registerRoute } from "@/routes";
import store from "@/store";
import Vue from "vue";
import ConfirmBtn from "@/plugins/Cnc/element/ConfirmBtn.vue";
import CncMenu from "@/plugins/Cnc/element/CncMenu.vue";
import CncControl from "@/plugins/Cnc/control/CncControl.vue"
import CncViewer from "@/plugins/Cnc/viewer/CncViewer.vue"
import CncToolchanger from "@/plugins/Cnc/toolchanger/CncToolchanger.vue";

Vue.component(ConfirmBtn.name, ConfirmBtn);
Vue.component(CncMenu.name, CncMenu);

// require('./panels/index');
// require('./viewer/index');

registerCategory('Cnc', 'mdi-ruler-square-compass', 'CNC', false, 500).then(() => {

    registerRoute(CncControl, {
        Cnc: {
            CncControl: {
                icon: 'mdi-drag-variant',
                caption: 'Control',
                path: '/Cnc/Control',
            }
        },
    });

    registerRoute(CncViewer, {
        Cnc: {
            CncViewer: {
                icon: 'mdi-vector-curve',
                caption: 'Viewer',
                path: '/Cnc/Viewer',
            }
        },
    });

    registerRoute(CncToolchanger, {
        Cnc: {
            CncViewer: {
                icon: 'mdi-tools',
                caption: 'Toolchanger',
                path: '/Cnc/Toolchanger',
            }
        },
    });

});

interface CncSettings {
    step: number;
    drill: number;
}

declare module "@/store" {
    interface RootState {
        cnc_settings: CncSettings;
    }
}

store.registerModule('cnc_settings', {
    namespaced: true,
    state: {
        step: 0.1, drill: 0, file: null
    },
    mutations: {
        updateStep (state, val) {
            state.step = val;
        },
        updateDrill (state, val) {
            state.drill = val;
        },
        updateFile (state, val) {
            state.file = val;
        }
    }
});