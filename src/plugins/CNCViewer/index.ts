import CNCViewer from "./CNCViewer.vue"
import { registerRoute } from "@/routes";
import store from "@/store";

require('./panels/index');

registerRoute(CNCViewer, {
    Control: {
        CNCViewer: {
            icon: 'mdi-drag-variant',
            caption: 'plugins.cncViewer.caption',
            path: '/Plugins/CNCViewer',
        },
    },
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