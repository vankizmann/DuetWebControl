<script lang="jsx">
import store from "@/store";
import { Arr, Any } from "@kizmann/pico-js";

export default {

    name: 'CncFileList',

    data()
    {
        return {
            files: []
        }
    },

    computed: {

        uiFrozen() {
            return store.getters["uiFrozen"];
        },

    },

    mounted()
    {
        if ( ! this.uiFrozen ) {
            this.getFiles();
        }
    },

    methods: {

        getFiles()
        {
            store.dispatch("machine/getFileList", '0:/gcodes/').then((res) => {
                this.files = Arr.filter(res, (val) => !val.isDirectory);
            });
        },

        setFile(name)
        {
            store.commit('cnc_settings/updateFile', name);
        }

    },

    renderFile(file)
    {
        let nameHtml = (
            <div class="cnc-file-list__name">
                {file.name.replace(/(\.cnc)?\.gcode$/, '')}
            </div>
        );

        let dateHtml = (
            <div class="cnc-file-list__date">
                <span>{file.lastModified.toLocaleDateString("en-GB")}</span>
                <span>{file.lastModified.toLocaleTimeString("en-GB")}</span>
            </div>
        );

        let buttonEvents = {
            click: () => this.setFile(file.name)
        };

        let buttonHtml = (
            <div class="cnc-file-list__button">
                <vBtn color="primary" on={buttonEvents}>
                    <vIcon>mdi-progress-upload</vIcon>
                </vBtn>
            </div>
        );


        return (
            <div class="cnc-file-list__file">
                {[nameHtml, dateHtml, buttonHtml]}
            </div>
        );
    },

    renderEmpty()
    {
        return (
            <div class="cnc-file-list__empty">{this.$t('Empty')}</div>
        );
    },

    render()
    {
        let files = Arr.sort(this.files, (a, b) => {

            if ( a.lastModified / 1 === b.lastModified / 1 ) {
                return 0;
            }

            return a.lastModified / 1 > b.lastModified / 1 ? - 1 : 1;
        });

        let slots = Arr.each(Arr.slice(files, 0, 5), (file) => {
            return this.ctor('renderFile')(file);
        });

        if ( Any.isEmpty(slots) ) {
            slots = [this.ctor('renderEmpty')()];
        }

        return (
            <div class="cnc-file-list">
                {slots}
            </div>
        );
    }
};
</script>
<style lang="scss">

@import "../../scss/vars";

.cnc-file-list {
    display: flex;
    flex-direction: column;
    background: $color-box-dark;
    padding: 5px 25px;
    border-radius: 5px;
}

.cnc-file-list__file {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 13px 70px 13px 0;
}

.cnc-file-list__file:not(:last-child) {
    border-bottom: 1px solid rgba(#fff, 0.1);
}

.cnc-file-list__name {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.cnc-file-list__date span {
    font-size: 14px;
    color: rgba(#fff, 0.5);
}

.cnc-file-list__date span:not(:last-child) {
    margin-right: 5px;
}

.cnc-file-list__button {
    position: absolute;
    top: 50%;
    right: 0;
    margin-top: -25px;
}

.cnc-file-list__button button {
    width: 50px !important;
    min-width: 50px !important;
    height: 50px !important;
    padding: 0 !important;
}

.cnc-file-list__empty {
    padding: 20px 0;
    text-align: center;
}

</style>