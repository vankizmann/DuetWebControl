<script lang="jsx">
import store from "@/store";

export default {

    name: 'CncLightControl',

    methods: {

        async turnOn()
        {
            await store.dispatch("machine/sendCode", `M98 P"cnc-light-on.g"`);
        },

        async turnOff()
        {
            await store.dispatch("machine/sendCode",`M98 P"cnc-light-off.g"`);
        }

    },

    renderIcon()
    {
        return (
            <div class="cnc-light-control__icon">
                <vIcon>mdi-brightness-6</vIcon>
            </div>
        );
    },

    renderOn()
    {
        return (
            <div class="cnc-light-control__button">
                <vBtn text on-click={this.turnOn}>{this.$t('On')}</vBtn>
            </div>
        );
    },

    renderOff()
    {
        return (
            <div class="cnc-light-control__button">
                <vBtn text on-click={this.turnOff}>{this.$t('Off')}</vBtn>
            </div>
        );
    },

    render()
    {
        return (
            <div class="cnc-light-control">
                {[
                    this.ctor('renderIcon')(),
                    this.ctor('renderOn')(),
                    this.ctor('renderOff')()
                ]}
            </div>
        );
    }
};
</script>
<style lang="scss">

@import "../../scss/vars";

.cnc-light-control {
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    padding: 15px 15px 15px 80px;
    background: $color-box-dark;
    border-radius: 5px;
}

.theme--light .cnc-light-control {
    background: $color-box-light;
}

.cnc-light-control > div:not(:last-child) {
    margin-right: 5px;
}

.cnc-light-control__icon {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 65px;
    height: 100%;
    background: rgba(#fff, 0.1);
}

.theme--light .cnc-light-control__icon {
    background: rgba(#000, 0.05);
}

.cnc-light-control__icon i {
    font-size: 18px !important;
}

</style>