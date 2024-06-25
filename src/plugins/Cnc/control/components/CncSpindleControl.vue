<script lang="jsx">
import store from "@/store";
import { SpindleState } from "@duet3d/objectmodel";
import { Num, Arr } from "@kizmann/pico-js";

export default {

    name: 'CncSpindleControl',

    computed: {

        uiFrozen()
        {
            return store.getters["uiFrozen"];
        },

        activeSpindles()
        {
            return store.state.machine.model.spindles;
        },

    },

    methods: {

        getName(spindleIndex) {
            return `${this.$t('panel.spindle.spindle')} ${spindleIndex}`;
        },

        isConfigured(spindle) {
            return spindle.state !== SpindleState.unconfigured;
        },

        isActive(spindle) {
            return (spindle.state == SpindleState.forward) || (spindle.state == SpindleState.reverse);
        },

    },

    renderSpindle(spindle, index)
    {
        spindle = Object.assign(spindle || {}, {
            current: 10000
        });

        let value = Num.format(spindle.current, '.', ' ', 0);

        return (
            <div class="cnc-spindle-control">
                <div class="cnc-spindle-control__label">
                    <strong>{this.getName(index)}</strong>
                </div>
                <div class="cnc-spindle-control__value">
                    <span>{this.$t(':value RPM').replace(':value', value)}</span>
                </div>
                <div class="cnc-spindle-control__button">
                    <vBtn disabled={this.uiFrozen}>-</vBtn>
                </div>
                <div class="cnc-spindle-control__button">
                    <vBtn disabled={this.uiFrozen}>+</vBtn>
                </div>
            </div>
        )
    },

    render()
    {
        // if ( Any.isEmpty(this.activeSpindles) ) {
        //     return null;
        // }

        return this.ctor('renderSpindle')(Arr.first(this.activeSpindles), 0);
    }
};
</script>
<style lang="scss">

@import "../../scss/vars";

.cnc-spindle-control {
    display: flex;
    align-items: center;
    padding: 15px 25px;
    border-radius: 5px;
    background: $color-box-dark;
}

.cnc-spindle-control > div {
    flex: 0 0 auto;
}

.cnc-spindle-control > div:not(:last-child) {
    margin-right: 15px;
}

.cnc-spindle-control__button button {
    //padding: 0 !important;
    min-width: 36px !important;
}

.cnc-spindle-control__value {
    flex: 1 1 auto !important;
    min-width: 120px;
    padding: 5px 0;
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

</style>