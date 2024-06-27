<script lang="jsx">
import store from "@/store";
import { Num } from "@kizmann/pico-js";

export default {

    name: 'CncMachineSpeed',

    props: {

        vertical: {
            default()
            {
                return false;
            },
            type: [Boolean]
        },

        speedFactorMin: {
            default()
            {
                return 5;
            },
            type: [Number]
        },

        speedFactorMax: {
            default()
            {
                return 200;
            },
            type: [Number]
        },

    },

    computed: {

        uiFrozen()
        {
            return store.getters["uiFrozen"];
        },

        speedFactor()
        {
            return (store.state.machine.model.move.speedFactor !== null) ?
                (store.state.machine.model.move.speedFactor * 100) : 100;
        },

    },

    methods: {

        async decreaseSpeed()
        {
            await store.dispatch("machine/sendCode", `M220 S${this.speedFactor - 5}`);
        },

        async increaseSpeed()
        {
            await store.dispatch("machine/sendCode", `M220 S${this.speedFactor + 5}`);
        },

    },

    render()
    {
        let value = Num.format(this.speedFactor, '.', ' ', 0);

        let classList = [
            'cnc-machine-speed'
        ];

        if ( this.vertical ) {
            classList.push('is-vertical');
        }

        return (
            <div class={classList}>
                <div class="cnc-machine-speed__label">
                    <strong>{this.$t('Speed')}</strong>
                </div>
                <div class="cnc-machine-speed__value">
                    <span>{this.$t(':value %').replace(':value', value)}</span>
                </div>
                <div class="cnc-machine-speed__button">
                    <vBtn disabled={this.uiFrozen || this.speedFactor <= this.speedFactorMin} on-click={this.decreaseSpeed}>-</vBtn>
                </div>
                <div class="cnc-machine-speed__button">
                    <vBtn disabled={this.uiFrozen || this.speedFactor >= this.speedFactorMax} on-click={this.increaseSpeed}>+</vBtn>
                </div>
            </div>
        );
    }
};
</script>
<style lang="scss">

@import "../../scss/vars";

.cnc-machine-speed {
    display: flex;
    align-items: center;
    padding: 15px 25px;
    color: #fff;
    background: $color-box-dark;
    border-radius: 5px;
}

.theme--light .cnc-machine-speed {
    background: $color-box-light;
}

.cnc-machine-speed.is-vertical {
    flex-direction: column;
}

.cnc-machine-speed > div {
    flex: 0 0 auto;
}

.cnc-machine-speed > div:not(:last-child) {
    margin-right: 15px;
}

.cnc-machine-speed__button button {
    //padding: 0 !important;
    min-width: 36px !important;
}

.cnc-machine-speed__value {
    flex: 1 1 auto !important;
    min-width: 120px;
    padding: 5px 0;
    text-align: center;
    background: rgba(#fff, 0.05);
    border-radius: 4px;
}

.theme--light .cnc-machine-speed__value {
    background: rgba(#000, 0.05);
}

</style>