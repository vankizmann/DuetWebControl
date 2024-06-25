<script lang="jsx">
export default {

    name: 'CncMenu',

    renderItem(path, label)
    {
        let route = () => {
            if ( this.$route.path !== path ) {
                this.$router.push({ path: path });
            }
        };

        let routeClass = [];

        if ( this.$route.path === path ) {
            routeClass.push('is-active');
        }

        return (
            <a class={routeClass} href="javascript:void(0)" on-click={route}>
                {this.$t(label)}
            </a>
        )
    },

    render()
    {
        return (
            <div class="cnc-menu">
                {this.ctor('renderItem')('/Cnc/Control', 'Control')}
                {this.ctor('renderItem')('/Cnc/Viewer', 'Viewer')}
                {this.ctor('renderItem')('/Cnc/Toolchanger', 'Toolchanger')}
            </div>
        );
    }
};
</script>
<style lang="scss">

@import "../scss/vars";

.cnc-menu {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border-bottom: 2px solid $color-primary;
}

.cnc-menu > a {
    padding: 6px 16px;
    font-size: 19px;
    display: inline-block;
    margin-right: 10px;
    color: rgba(255, 255, 255, 0.4);
    border-radius: 5px;
    text-decoration: none;
}

.cnc-menu > a.is-active {
    color: $color-primary;
}

.cnc-menu > a:hover {
    background: rgba(255, 255, 255, 0.1);
}
</style>