import CNCViewer from "./CNCViewer.vue"
import { registerCategory, registerRoute } from "@/routes";
import store from "@/store";

require('./panels/index');
require('./viewer/index');

registerCategory('Cnc', 'mdi-ruler-square-compass', 'CNC', false, 500).then(() => {

    registerRoute(CNCViewer, {
        Cnc: {
            CncControl: {
                icon: 'mdi-drag-variant',
                caption: 'Control',
                path: '/Cnc/Control2',
            }
        },
    });

    // registerRoute(CNCViewer, {
    //     Cnc: {
    //         CncViewer: {
    //             icon: 'mdi-vector-curve',
    //             caption: 'Viewer',
    //             path: '/Cnc/Viewer',
    //         }
    //     },
    // });

    // registerRoute(CNCViewer, {
    //     Cnc: {
    //         CncWorkpiece: {
    //             icon: 'mdi-ruler-square',
    //             caption: 'Workpiece',
    //             path: '/Cnc/Workpiece',
    //         },
    //     },
    // });

});

interface Tooloffset {
    loop: number;
    axis: string;
}

declare module "@/store" {
    interface RootState {
        tooloffset: Tooloffset;
    }
}

store.registerModule('tooloffset', {
    namespaced: true,
    state: {
        axis: '', loop: 0
    },
    mutations: {
        patch (state) {
            state.loop++;
        }
    }
});