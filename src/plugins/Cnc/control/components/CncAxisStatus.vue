<script lang="jsx">
import store from "@/store";
import { Arr } from "@kizmann/pico-js";

export default {

    name: 'CncAxisStatus',

    props: {

        vertical: {
            default()
            {
                return false;
            },
            type: [Boolean]
        }

    },

    data()
    {
        return {
            currentWorkplace: 0,
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

        async homeAllAxis()
        {
            await store.dispatch("machine/sendCode", `G28`);
        },

        async zeroAxis(axis)
        {
            await store.dispatch("machine/sendCode", `G10 L20 P${this.currentWorkplace} ${axis.letter}0`);
        }

    },

    renderAxis(axis, index)
    {
        return (
            <div class="cnc-axis-status__axis">
                <div class="cnc-axis-status__label">
                    <strong>{axis.letter}</strong>
                </div>
                <div class="cnc-axis-status__value">
                    <span><i>{axis.machinePosition}</i> {axis.userPosition}</span>
                </div>
                <div class="cnc-axis-status__button">
                    <vBtn color="primary" disabled={this.uiFrozen} on-click={() => this.zeroAxis(axis)}>
                        {this.$t(`Ref ${axis.letter}`)}
                    </vBtn>
                </div>
            </div>
        );
    },

    renderHome()
    {
        let homeProps = {
            block: true
        };

        let homeEvents = {
            //
        };

        homeEvents['click'] = () => {
            this.homeAllAxis();
        }

        return (
            <ConfirmBtn class="cnc-axis-status__home" props={homeProps} on={homeEvents}>
                {this.$t('Home all')}
            </ConfirmBtn>
        );
    },

    render()
    {
        let classList = [
            'cnc-axis-status'
        ];

        if ( this.vertical ) {
            classList.push('is-vertical');
        }

        let slots = Arr.each(this.visibleAxes, (axis, index) => {
            return this.ctor('renderAxis')(axis, index);
        });

        return (
            <div class={classList}>
                {slots} {this.ctor('renderHome')()}
            </div>
        );
    }
};
</script>
<style lang="scss">

@import "../../scss/vars";

.cnc-axis-status {
    display: flex;
    padding: 15px;
    color: #fff;
    background: $color-box-primary;
    border-radius: 5px;
}

@media (max-width: 1024px) {
    .cnc-axis-status {
        flex-direction: column;
    }
}

.cnc-axis-status.is-vertical {
    flex-direction: column;
}

.cnc-axis-status > div {
    display: flex;
    align-items: center;
    padding: 0 10px;
}

.cnc-axis-status.is-vertical > div {
    padding: 0;
}

@media (max-width: 1024px) {
    .cnc-axis-status > div {
        padding: 0;
    }
}

.cnc-axis-status__axis {
    display: flex;
    flex: 1 1 auto;
    width: 33.332%;
}

.cnc-axis-status.is-vertical > .cnc-axis-status__axis {
    width: 100%;
}

@media (max-width: 1024px) {
    .cnc-axis-status > .cnc-axis-status__axis {
        width: 100%;
    }
}

.cnc-axis-status__axis > div {
    flex: 0 0 auto;
}

.cnc-axis-status.is-vertical > div:not(:last-child) {
    margin-bottom: 15px;
}

@media (max-width: 1024px) {
    .cnc-axis-status > div:not(:last-child) {
        margin-bottom: 15px;
    }
}

.cnc-axis-status__axis > div:not(:last-child) {
    margin-right: 15px;
}

.cnc-axis-status__value {
    flex: 1 1 auto !important;
}

.cnc-axis-status__value > span {
    display: block;
    padding: 6px 0;
    text-align: center;
    background: rgba(#000, 0.1);
    border-radius: 4px;
    font-weight: 600;
}

.cnc-axis-status__value > span i {
    opacity: 0.5;
    font-weight: 400;
    font-style: normal;
}

.cnc-axis-status__value > span i:after {
    content: '/';
    margin-left: 5px;
}

</style>