<script lang="jsx">
import { Any, Arr } from "@kizmann/pico-js";

export default {

    name: 'ConfirmBtn',

    props: {

        label: {
            default()
            {
                return null;
            },
            type: [String]
        },

        color: {
            default()
            {
                return 'default';
            },
            type: [String]
        },

        headline: {
            default()
            {
                return 'Be careful';
            },
            type: [String]
        },

        modal: {
            default()
            {
                return 'Do you want to continue with ":label"';
            },
            type: [String]
        },

        block: {
            default()
            {
                return false;
            },
            type: [Boolean]
        },

        text: {
            default()
            {
                return false;
            },
            type: [Boolean]
        },

        disabled: {
            default()
            {
                return false;
            },
            type: [Boolean]
        },

    },

    data()
    {
        return {
            showConfirm: false,
        };
    },

    renderButton()
    {
        let btnProps = {
            color: this.color,
            block: this.block,
            text: this.text,
            disabled: this.disabled
        };

        let btnEvents = {
            //
        };

        btnEvents['click'] = () => {
            this.showConfirm = true;
        };

        return (
            <vBtn props={btnProps} on={btnEvents}>{this.$slots.default || this.label}</vBtn>
        );
    },

    renderSpacer()
    {
        return (
            <vSpacer></vSpacer>
        );
    },

    renderYes()
    {
        let yesProps = {
            color: 'blue darken-1'
        };

        let yesEvents = {
            //
        };

        yesEvents['click'] = () => {
            this.$emit('click'); this.showConfirm = false;
        };

        return (
            <vBtn props={yesProps} on={yesEvents}>{this.$t("generic.ok")}</vBtn>
        );
    },

    renderNo()
    {
        let noProps = {
            color: 'blue darken-1', text: true
        };

        let noEvents = {
            //
        };

        noEvents['click'] = () => {
            this.showConfirm = false;
        };

        return (
            <vBtn props={noProps} on={noEvents}>{this.$t("generic.cancel")}</vBtn>
        );
    },

    renderConfirm()
    {
        if ( !this.showConfirm ) {
            return false;
        }

        let label = this.label;

        if ( Any.isEmpty(label) && this.$slots.default ) {
            label = Arr.first(this.$slots.default).text;
        }

        let confirmProps = {
            value: true, maxWidth: 420
        };

        let confirmEvents = {
            //
        };

        confirmEvents['input'] = (input) => {
            this.showConfirm = input;
        };

        return (
            <vDialog props={confirmProps} on={confirmEvents}>
                <vCard>
                    <vCardTitle>
                        <span class="headline">{this.headline}</span>
                    </vCardTitle>
                    <vCardText class="content">
                        {this.modal.replace(':label', label)}
                    </vCardText>
                    <vCardActions>
                        {[this.ctor('renderNo')(), this.ctor('renderSpacer')(), this.ctor('renderYes')()]}
                    </vCardActions>
                </vCard>
            </vDialog>
        );
    },

    render()
    {
        return (
            <div>{[this.ctor('renderButton')(), this.ctor('renderConfirm')()]}</div>
        );
    }
};
</script>
<style lang="scss">

</style>