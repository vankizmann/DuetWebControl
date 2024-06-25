<script lang="jsx">
import store from "@/store";
import { Arr } from "@kizmann/pico-js";

export default {

    name: 'CncAxisControl',

    props: {

        sizes: {
            default()
            {
                return [0.1, 0.5, 1, 5, 10, 50, 100];
            }
        },

    },

    data()
    {
        return {
            size: Arr.first(this.sizes)
        };
    },

    computed: {

        uiFrozen() {
            return store.getters["uiFrozen"];
        },

        visibleAxes()
        {
            return store.state.machine.model.move.axes.filter(axis => axis.visible);
        },

    },

    methods: {

        getAxis(letter)
        {
            let axis = null;

            this.visibleAxes.forEach((item) => {
                if ( item.letter.toLowerCase() == letter ) axis = item;
            });

            return axis;
        },

        async sendAction(action)
        {
            await store.dispatch("machine/sendCode",
                `M98 P"cnc-axis-${action}.g"`);
        },

        async sendStep(letter, action)
        {
            let size = this.size;

            if ( action === '-' ) {
                size *= -1;
            }

            let code = `M120\nG91\nG1 ${letter.toUpperCase()}${size} ` +
                `F${store.state.machine.settings.moveFeedrate}\nM121`;

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

            this.size = this.sizes[target];
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

            this.size = this.sizes[target];
        }

    },

    renderStepUp()
    {
        return (
            <div class="cnc-axis-control__step-down">
                <vBtn color="primary" on-click={this.stepDown}>
                    <vIcon>mdi-chevron-left</vIcon>
                </vBtn>
            </div>
        );
    },

    renderStepSize()
    {
        return (
            <div class="cnc-axis-control__step-size">
                <span>{ this.$t(':value mm').replace(':value', this.size)}</span>
            </div>
        );
    },

    renderStepDown()
    {
        return (
            <div class="cnc-axis-control__step-up">
                <vBtn color="primary" on-click={this.stepUp}>
                    <vIcon>mdi-chevron-right</vIcon>
                </vBtn>
            </div>
        );
    },

    renderMove(letter, action)
    {
        let icon = 'mdi-arrow';

        if ( letter === 'x' && action === '-' ) {
            icon += '-left';
        }

        if ( letter === 'x' && action === '+' ) {
            icon += '-right';
        }

        if ( letter === 'y' && action === '-' ) {
            icon += '-down';
        }

        if ( letter === 'y' && action === '+' ) {
            icon += '-up';
        }

        if ( letter === 'z' && action === '-' ) {
            icon += '-down';
        }

        if ( letter === 'z' && action === '+' ) {
            icon += '-up';
        }

        return (
            <vBtn disabled={this.uiFrozen} on-click={() => this.sendStep(letter, action)}>
                <vIcon>{icon}</vIcon>
            </vBtn>
        );
    },

    renderZero(letter)
    {
        let confirmProps = {
            color: 'primary', disabled: this.uiFrozen
        };

        if ( letter === 'xy' ) {
            confirmProps.label = 'Move to XY zero';
        }

        if ( letter === 'z' ) {
            confirmProps.label = 'Move to Z zero';
        }

        let confirmEvents = {
            click: () => this.sendAction(`zero-${letter}`)
        };

        return (
            <ConfirmBtn class="cnc-axis-control__square" props={confirmProps} on={confirmEvents}>
                <vIcon>mdi-adjust</vIcon>
            </ConfirmBtn>
        );
    },

    renderMatrix(letter, action = null)
    {
        if ( action === '$' ) {
            return this.ctor('renderZero')(letter);
        }

        if ( letter === 'spacer' ) {
            return (<div class="cnc-axis-control__spacer"></div>);
        }

        return (
            <div class="cnc-axis-control__square">
                {this.ctor('renderMove')(letter, action)}
            </div>
        );
    },

    render()
    {
        return (
            <div class="cnc-axis-control">
                <div class="cnc-axis-control__row">
                    {[
                        this.ctor('renderMatrix')('spacer'),
                        this.ctor('renderMatrix')('y', '+'),
                        this.ctor('renderMatrix')('spacer'),
                        this.ctor('renderMatrix')('z', '+'),
                    ]}
                </div>
                <div class="cnc-axis-control__row">
                    {[
                        this.ctor('renderMatrix')('x', '-'),
                        this.ctor('renderMatrix')('xy', '$'),
                        this.ctor('renderMatrix')('x', '+'),
                        this.ctor('renderMatrix')('z', '$'),
                    ]}
                </div>
                <div class="cnc-axis-control__row">
                    {[
                        this.ctor('renderMatrix')('spacer'),
                        this.ctor('renderMatrix')('y', '-'),
                        this.ctor('renderMatrix')('spacer'),
                        this.ctor('renderMatrix')('z', '-'),
                    ]}
                </div>
                <div class="cnc-axis-control__step">
                    {[
                        this.ctor('renderStepUp')(),
                        this.ctor('renderStepSize')(),
                        this.ctor('renderStepDown')(),
                    ]}
                </div>
            </div>
        );
    }
};
</script>
<style lang="scss">

@import "../../scss/vars";

.cnc-axis-control {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 20px 15px;
    border-radius: 5px;
    background: $color-box-dark;
}

.theme--light .cnc-axis-control {
    background: $color-box-light;
}

.cnc-axis-control__step {
    width: calc(100% + 30px);
    display: flex;
    align-items: stretch;
    padding: 10px 15px 10px;
    margin: 20px -15px -20px;
    background: $color-box-primary;
}

.cnc-axis-control__step-up,
.cnc-axis-control__step-down {
    flex: 0 0 auto;
}

.cnc-axis-control__step-up button,
.cnc-axis-control__step-down button {
    width: 50px !important;
    min-width: 50px !important;
    height: 50px !important;
    padding: 0 !important;
}

.cnc-axis-control__step-size {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cnc-axis-control__step-size span {
    font-size: 17px;
    font-weight: 500;
}

.cnc-axis-control__row {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
}

.cnc-axis-control__row > div {
    flex: 0 1 auto;
    width: 33.332%;
    max-width: 110px;
    overflow: hidden;
}

.cnc-axis-control__row > div:before {
    content: '\00a0';
    display: block;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
}

.cnc-axis-control__row button {
    min-width: 0 !important;
}

.cnc-axis-control__square {
    position: relative;
}

.cnc-axis-control__square > button {
    position: absolute;
    top: 8px;
    left: 8px;
    width: calc(100% - 16px) !important;
    height: calc(100% - 16px) !important;
}

</style>