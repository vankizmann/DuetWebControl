<script lang="jsx">
import { Num } from "@kizmann/pico-js";
import store from "@/store";

let zprobe = require('../../assets/z-probe.svg');

export default {

    name: 'CncProbeControl',

    props: {

        sizes: {
            default()
            {
                return [0, 1, 2, 3, 3.175, 4, 5, 6, 6.35, 7, 8];
            }
        },

    },

    computed: {

        size()
        {
            return store.state.cnc_settings.drill;
        },

        uiFrozen() {
            return store.getters["uiFrozen"];
        },

    },

    methods: {

        async toolchangePark()
        {
            await store.dispatch("machine/sendCode", `M98 P"cnc/toolchange-park.g"`);
        },

        async toolchangeProbe()
        {
            await store.dispatch("machine/sendCode",`M98 P"cnc/toolchange-probe.g"`);
        },

        async sendAction(action)
        {
            let code = `M98 P"cnc/probe-${action}.g" S100 ` +
                `D${this.size} R${this.size/2}`;

            await store.dispatch("machine/sendCode", code);
        },

        stepUp()
        {
            let target = 0;

            this.sizes.forEach((value, index) => {
                if ( value == this.size ) target = index;
            });

            if ( target < this.sizes.length - 1 ) {
                target = target + 1;
            }

            store.commit('cnc_settings/updateDrill', this.sizes[target]);
        },

        stepDown()
        {
            let target = 0;

            this.sizes.forEach((value, index) => {
                if ( value == this.size ) target = index;
            });

            if ( target !== 0 ) {
                target = target - 1;
            }

            store.commit('cnc_settings/updateDrill', this.sizes[target]);
        }

    },

    renderDrillUp()
    {
        return (
            <div class="cnc-axis-control__drill-down">
                <vBtn color="primary" on-click={this.stepDown}>
                    <vIcon>mdi-chevron-left</vIcon>
                </vBtn>
            </div>
        );
    },

    renderDrillSize()
    {
        let size = Num.format(this.size, '.', ' ', 3);

        return (
            <div class="cnc-axis-control__drill-size">
                <span>{ this.$t(':value mm').replace(':value', size)}</span>
            </div>
        );
    },

    renderDrillDown()
    {
        return (
            <div class="cnc-axis-control__drill-up">
                <vBtn color="primary" on-click={this.stepUp}>
                    <vIcon>mdi-chevron-right</vIcon>
                </vBtn>
            </div>
        );
    },

    renderImage()
    {
        return (
            <div class="cnc-probe-control__image">
                <img src={zprobe} alt="" />
            </div>
        );
    },

    renderButton(action)
    {
        let icon = 'mdi-arrow-collapse';

        if ( action === 'x-high' ) {
            icon += '-left';
        }

        if ( action === 'x-low' ) {
            icon += '-right';
        }

        if ( action === 'y-high' ) {
            icon += '-down';
        }

        if ( action === 'y-low' ) {
            icon += '-up';
        }

        let label = 'Undefined';


        if ( action === 'x-high' ) {
            label = 'Probe X from high to low';
        }

        if ( action === 'x-low' ) {
            label = 'Probe X from low to high';
        }

        if ( action === 'y-high' ) {
            label = 'Probe Y from high to low';
        }

        if ( action === 'y-low' ) {
            label = 'Probe Y from low to high';
        }

        let classList = [
            'cnc-probe-control__button',
            'is-' + action
        ];

        let confirmProps = {
            color: 'primary', label: label, disabled: this.uiFrozen,
        };

        let confirmEvents = {
            click: () => this.sendAction(action)
        };

        return (
            <ConfirmBtn class={classList} props={confirmProps} on={confirmEvents}>
                <vIcon>{icon}</vIcon>
            </ConfirmBtn>
        );
    },

    renderZPlain()
    {
        let confirmProps = {
            color: 'default', block: true, disabled: this.uiFrozen,
        };

        let confirmEvents = {
            click: () => this.sendAction('z-plain')
        };

        return (
            <ConfirmBtn class="cnc-probe-control__probe" props={confirmProps} on={confirmEvents}>
                {this.$t('Probe as zero')}
            </ConfirmBtn>
        );
    },

    renderZPlate()
    {
        let confirmProps = {
            color: 'primary', block: true, disabled: this.uiFrozen,
        };

        let confirmEvents = {
            click: () => this.sendAction('z-plate')
        };

        return (
            <ConfirmBtn class="cnc-probe-control__probe" props={confirmProps} on={confirmEvents}>
                {this.$t('Probe on plate')}
            </ConfirmBtn>
        );
    },

    renderZFrame()
    {
        return (
            <div class="cnc-probe-control__frame">
                {[
                    this.ctor('renderImage')(),
                    this.ctor('renderZPlate')(),
                    this.ctor('renderZPlain')(),
                ]}
            </div>
        );
    },

    renderToolchangePark()
    {
        return (
            <div class="cnc-probe-control__park">
                <ConfirmBtn color="primary" label="Park tool" block={true}>
                    <vIcon>mdi-home</vIcon> Park tool
                </ConfirmBtn>
            </div>
        );
    },

    renderToolchangeProbe()
    {
        return (
            <div class="cnc-probe-control__probe">
                <ConfirmBtn color="primary" label="Change tool" block={true}>
                    <vIcon>mdi-tools</vIcon> Change tool
                </ConfirmBtn>
            </div>
        );
    },

    render()
    {
        return (
            <div class="cnc-probe-control">
                <div class="cnc-probe-control__toolchange">
                    {[
                        this.ctor('renderToolchangePark')(),
                        this.ctor('renderToolchangeProbe')(),
                    ]}
                </div>
                <div class="cnc-probe-control__workpiece">
                    {[
                        this.ctor('renderButton')('x-high'),
                        this.ctor('renderButton')('x-low'),
                        this.ctor('renderButton')('y-high'),
                        this.ctor('renderButton')('y-low'),
                        this.ctor('renderZFrame')()
                    ]}
                </div>
                <div class="cnc-axis-control__drill">
                    {[
                        this.ctor('renderDrillUp')(),
                        this.ctor('renderDrillSize')(),
                        this.ctor('renderDrillDown')(),
                    ]}
                </div>
            </div>
        );
    }
};
</script>
<style lang="scss">

@import "../../scss/vars";

.cnc-probe-control {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 30px;
    border-radius: 5px;
    background: $color-box-dark;
}

.theme--light .cnc-probe-control {
    background: $color-box-light;
}

.cnc-probe-control__workpiece {
    flex: 1 1 auto;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border: 3px solid $color-box-primary;
    border-radius: 10px;
    padding: 70px;
}

.cnc-probe-control__frame {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100px;
    padding-left: 110px;
}

.cnc-probe-control__probe:not(:last-child) {
    margin-bottom: 15px;
}

.cnc-probe-control__image {
    position: absolute;
    top: 50%;
    left: 0;
    width: 75px;
    height: 100px;
    margin-top: -50px;
}

.cnc-probe-control__image img {
    max-width: 75px;
    max-height: 100px;
}

.cnc-probe-control__button {
    position: absolute;
    border-radius: 500px;
    background: $color-primary;
}

.cnc-probe-control__button button {
    width: 50px !important;
    min-width: 50px !important;
    height: 50px !important;
    padding: 0 !important;
    border-radius: 500px !important;
}

.cnc-probe-control__button button i {
    font-size: 20px !important;
}

.cnc-probe-control__button.is-y-low {
    bottom: -15px;
    left: 50%;
    margin-left: -25px;
}

.cnc-probe-control__button.is-y-high {
    top: -15px;
    left: 50%;
    margin-left: -25px;
}

.cnc-probe-control__button.is-x-low {
    left: -15px;
    top: 50%;
    margin-top: -25px;
}

.cnc-probe-control__button.is-x-high {
    right: -15px;
    top: 50%;
    margin-top: -25px;
}

.cnc-axis-control__drill {
    width: calc(100% + 60px);
    display: flex;
    align-items: stretch;
    padding: 10px 15px 10px;
    margin: 30px -30px -30px;
    background: $color-box-primary;
}

.cnc-axis-control__drill-up,
.cnc-axis-control__drill-down {
    flex: 0 0 auto;
}

.cnc-axis-control__drill-up button,
.cnc-axis-control__drill-down button {
    width: 50px !important;
    min-width: 50px !important;
    height: 50px !important;
    padding: 0 !important;
}

.cnc-axis-control__drill-size {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cnc-axis-control__drill-size span {
    font-size: 17px;
    font-weight: 500;
}

.cnc-probe-control__toolchange {
    display: flex;
    margin-bottom: 40px;
}

.cnc-probe-control__toolchange > div {
    flex: 1 1 auto;
    width: 50%;
}

.cnc-probe-control__toolchange i {
    font-size: 18px !important;
    margin-right: 5px;
}

.cnc-probe-control__park {
    margin-right: 15px;
}

.cnc-probe-control__probe {
    margin-left: 15px;
}

</style>