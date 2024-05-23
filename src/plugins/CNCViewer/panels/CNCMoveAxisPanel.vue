<style scoped>

.select-btn {
  padding-left: 0px !important;
  padding-right: 0px !important;
  min-width: 0;
  height: 54px !important;
}

.move-btn {
  padding-left: 0px !important;
  padding-right: 0px !important;
  min-width: 0;
  height: 65px !important;
}

.move-square-div {
  position: relative;
  overflow: hidden;
  min-height: 65px;
}

.move-square-div:before {
  content: "\00a0";
  display: block;
  height: 0;
  width: 100%;
  padding-bottom: 85%;
}

.move-square-div > .move-square-btn {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
}

.wcs-selection {
  max-width: 200px;
}
</style>

<template>
  <v-card>
    <v-card-title class="pt-0">
      <v-icon small class="mr-1">mdi-swap-horizontal</v-icon>
      {{ $t("panel.movement.caption") }}
      <v-spacer />
      <v-select v-model="currentWorkplace" :items="workCoordinates" class="wcs-selection"
                hint="Work Coordinate System" @change="updateWorkplaceCoordinate" persistent-hint />
    </v-card-title>
    <v-card-text v-show="visibleAxes.length">
      <v-row>

        <v-col cols="12" order="2" md="7" order-md="1">
          <v-row>
            <v-col sm="3" offset="3">
              <div class="move-square-div">
                <code-btn :code="getMoveCode(yAxis, currentStepsize)" no-wait block class="move-btn move-square-btn">
                  {{ yAxis.letter + showSign(currentStepsize) }}
                  <v-icon>mdi-chevron-up</v-icon>
                </code-btn>
              </div>
            </v-col>
            <v-col sm="3" offset="3">
              <div class="move-square-div">
                <code-btn :code="getMoveCode(zAxis, currentStepsize)" no-wait block class="move-btn move-square-btn">
                  {{ zAxis.letter + showSign(currentStepsize) }}
                  <v-icon>mdi-chevron-up</v-icon>
                </code-btn>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="3">
              <div class="move-square-div">
                <code-btn :code="getMoveCode(xAxis, currentStepsize * -1)" no-wait block class="move-btn move-square-btn">
                  {{ xAxis.letter + showSign(currentStepsize * - 1) }}
                  <v-icon>mdi-chevron-left</v-icon>
                </code-btn>
              </div>
            </v-col>
            <v-col sm="3">
              <div class="move-square-div">
                <v-btn @click="showConfirmZeroXY = true" block v-show="visibleAxes.length" color="primary" :disabled="uiFrozen"
                       :title="$t('button.zero.move', ['XY'])" class="ml-0 move-btn move-square-btn">
                  {{ $t('button.zero.move', ['XY']) }}
                </v-btn>
                <v-dialog :value="showConfirmZeroXY" max-width="420">
                  <template v-slot:default="props">
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ $t('button.zero.move', ['XY']) }}</span>
                      </v-card-title>
                      <v-card-text class="content">
                        {{ $t('button.zero.moveConfirm', ['XY']) }}
                      </v-card-text>
                      <v-card-actions>
                        <v-btn @click="showConfirmZeroXY = false" color="blue darken-1" text>{{ $t("generic.cancel") }}</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" @click="() => goToWorkplaceZero('xy')">{{ $t("generic.ok") }}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </div>
            </v-col>
            <v-col sm="3">
              <div class="move-square-div">
                <code-btn :code="getMoveCode(xAxis, currentStepsize)" no-wait block class="move-btn move-square-btn">
                  {{ xAxis.letter + showSign(currentStepsize) }}
                  <v-icon>mdi-chevron-right</v-icon>
                </code-btn>
              </div>
            </v-col>
            <v-col sm="3">
              <div class="move-square-div">
                <v-btn @click="showConfirmZeroZ = true" block v-show="visibleAxes.length" color="primary" :disabled="uiFrozen"
                       :title="$t('button.zero.move', ['Z'])" class="ml-0 move-btn move-square-btn">
                  {{ $t('button.zero.move', ['Z']) }}
                </v-btn>
                <v-dialog :value="showConfirmZeroZ" max-width="420">
                  <template v-slot:default="props">
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ $t('button.zero.move', ['Z']) }}</span>
                      </v-card-title>
                      <v-card-text class="content">
                        {{ $t('button.zero.moveConfirm', ['Z']) }}
                      </v-card-text>
                      <v-card-actions>
                        <v-btn color="blue darken-1" text @click="showConfirmZeroZ = false">{{ $t("generic.cancel") }}</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" @click="() => goToWorkplaceZero('z')">{{ $t("generic.ok") }}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col col="3" offset="3">
              <div class="move-square-div">
                <code-btn :code="getMoveCode(yAxis, currentStepsize * -1)" no-wait block class="move-btn move-square-btn">
                  {{ yAxis.letter + showSign(currentStepsize * - 1) }}
                  <v-icon>mdi-chevron-down</v-icon>
                </code-btn>
              </div>
            </v-col>
            <v-col col="3" offset="3">
              <div class="move-square-div">
                <code-btn :code="getMoveCode(zAxis, currentStepsize * -1)" no-wait block class="move-btn move-square-btn">
                  {{ zAxis.letter + showSign(currentStepsize * - 1) }}
                  <v-icon>mdi-chevron-down</v-icon>
                </code-btn>
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" order="1" md="4" order-md="2" offset-md="1">
          <v-row dense>
            <v-col cols="12">
              <v-row style="margin-bottom: 30px;">
                <v-col col="12" md="3">
                  <v-btn block class="select-btn" @click="prevStepsize">
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                </v-col>
                <v-col col="12" md="6">
                  <v-select label="Stepsize" :items="stepsizeItems" item-value="value" item-title="title" v-model="currentStepsize">
                    <template v-slot:item="{ props, item }">
                      {{ item.title }}
                    </template>
                    <template v-slot:selection="{ item, index }">
                      {{ item.title }}
                    </template>
                  </v-select>
                </v-col>
                <v-col col="12" md="3">
                  <v-btn block class="select-btn" @click="nextStepsize">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-btn @click="() => setWorkplaceZero(null)" block class="move-btn">
                    {{ $t("panel.movement.setWorkXYZ") }}
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6">
                  <code-btn block v-show="visibleAxes.length" color="primary" code="G28"
                            :title="$t('button.home.titleAll')" class="ml-0 move-btn">
                    {{ $t("button.home.captionAll") }}
                  </code-btn>
                </v-col>
              </v-row>
              <v-row v-for="(axis, axisIndex) in visibleAxes" :key="axisIndex">
                <v-col cols="12" sm="6">
                  <v-btn @click="() => setWorkplaceZero(axis.letter)" block class="move-btn">
                    {{ $t("button.zero.caption", [axis.letter]) }}
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6">
                  <code-btn block :color="axis.homed ? 'primary' : 'warning'" :disabled="uiFrozen"
                            :title="$t('button.home.title', [/[a-z]/.test(axis.letter) ? `'${axis.letter}` : axis.letter])"
                            :code="`G28 ${/[a-z]/.test(axis.letter) ? '\'' : ''}${axis.letter}`" class="ml-0 move-btn">
                    {{ $t("button.home.caption", [axis.letter]) }}
                  </code-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

      </v-row>

    </v-card-text>

    <v-alert :value="unhomedAxes.length !== 0" type="warning" class="mb-0">
      {{ $tc("panel.movement.axesNotHomed", unhomedAxes.length) }}
      <strong>
        {{ unhomedAxes.map(axis => axis.letter).join(", ") }}
      </strong>
    </v-alert>
    <v-alert :value="visibleAxes.length === 0" type="info">
      {{ $t("panel.movement.noAxes") }}
    </v-alert>

  </v-card>
</template>

<script lang="ts">
import { Axis, AxisLetter, KinematicsName, MoveCompensationType } from "@duet3d/objectmodel";
import Vue from "vue";

import store from "@/store";

export default Vue.extend({
  computed: {
    stepsizeItems() : { value: number, title: string }[] {
      return [
        { value: 0.1, title: '0.1 mm' },
        { value: 0.5, title: '0.5 mm' },
        { value: 1, title: '1 mm' },
        { value: 5, title: '5 mm' },
        { value: 10, title: '10 mm' },
        { value: 50, title: '50 mm' },
        { value: 100, title: '100 mm' },
      ];
    },
    yAxis() : Axis | null {

      let axis = null;

      this.visibleAxes.forEach((item) => {
        if ( item.letter.toLowerCase() == 'y' ) axis = item;
      });

      return axis;
    },
    xAxis() : Axis | null {

      let axis = null;

      this.visibleAxes.forEach((item) => {
        if ( item.letter.toLowerCase() == 'x' ) axis = item;
      });

      return axis;
    },
    zAxis() : Axis | null {

      let axis = null;

      this.visibleAxes.forEach((item) => {
        if ( item.letter.toLowerCase() == 'z' ) axis = item;
      });

      return axis;
    },
    uiFrozen() : boolean {
      return store.getters["uiFrozen"];
    },
    moveSteps() : (axisLetter : AxisLetter) => Array<number> {
      return ((axisLetter : AxisLetter) => store.getters["machine/settings/moveSteps"](axisLetter));
    },
    numMoveSteps() : number {
      return store.getters["machine/settings/numMoveSteps"];
    },
    isCompensationEnabled() : boolean {
      return store.state.machine.model.move.compensation.type !== MoveCompensationType.none;
    },
    compensationType() : MoveCompensationType {
      return store.state.machine.model.move.compensation.type;
    },
    visibleAxes() : Array<Axis> {
      return store.state.machine.model.move.axes.filter(axis => axis.visible);
    },
    isDelta() : boolean {
      return [KinematicsName.delta, KinematicsName.rotaryDelta].includes(store.state.machine.model.move.kinematics.name);
    },
    unhomedAxes() : Array<Axis> {
      return store.state.machine.model.move.axes.filter(axis => axis.visible && !axis.homed);
    },
    workCoordinates() : Array<number> {
      return [...Array(9).keys()].map(i => i + 1);
    },
    workplaceNumber() : number {
      return store.state.machine.model.move.workplaceNumber;
    }
  },
  data() {
    return {
      currentWorkplace: 0,
      currentStepsize: 1,
      showConfirmZeroXY: false,
      showConfirmZeroZ: false,
      showConfirmHomeX: false,
      showConfirmHomeY: false,
      showConfirmHomeZ: false,
    };
  },
  methods: {
    getMoveCode(axis : Axis, steps : number) {
      return `M120\nG91\nG1 ${/[a-z]/.test(axis.letter) ? '\'' : ""}${axis.letter}${steps} F${store.state.machine.settings.moveFeedrate}\nM121`;
    },
    showSign: (value : number) => (value > 0 ? `+${value}` : value),
    async sendCode(code : string) {
      await store.dispatch("machine/sendCode", code);
    },
    async setWorkplaceZero(letter = null) {
      let code = `G10 L20 P${this.currentWorkplace}`;
      this.visibleAxes.forEach(axis => {
        if ( letter == null || axis.letter == letter ) (code += ` ${axis.letter}0`);
      });
      await store.dispatch("machine/sendCode", `${code}\nG10 L20 P${this.currentWorkplace}`);
    },
    async goToWorkplaceZero(letter = null) {

      let code = 'M98 P"workzero.g"';

      if ( letter != null ) {
        code = `M98 P"workzero-${letter}.g"`;
      }

      this.showConfirmZeroXY = this.showConfirmZeroZ = false;

      await store.dispatch("machine/sendCode", code);
    },
    async updateWorkplaceCoordinate() {
      let code;
      if ( this.currentWorkplace < 7 ) {
        code = `G${53 + this.currentWorkplace}`;
      } else {
        code = `G59.${this.currentWorkplace - 6}`;
      }

      if ( code ) {
        await store.dispatch("machine/sendCode", `${code}\nG10 L20 P${this.currentWorkplace}`);
      }
    },
    prevStepsize()
    {
      let target = 0;

      this.stepsizeItems.forEach((value, index) => {
        if ( value.value == this.currentStepsize ) target = index;
      });

      if ( target === 0 ) {
        target = this.stepsizeItems.length-1;
      } else {
        target = target - 1;
      }

      this.currentStepsize = this.stepsizeItems[target].value;
    },
    nextStepsize()
    {
      let target = 0;

      this.stepsizeItems.forEach((value, index) => {
        if ( value.value == this.currentStepsize ) target = index;
      });

      if ( target >= this.stepsizeItems.length - 1 ) {
        target = 0;
      } else {
        target = target + 1;
      }

      this.currentStepsize = this.stepsizeItems[target].value;
    },
  },
  mounted() {
    this.currentWorkplace = this.workplaceNumber + 1;
  },
  watch: {
    isConnected() {
      // Hide dialogs when the connection is interrupted
    },
    workplaceNumber(to : number) {
      this.currentWorkplace = to + 1;
    }
  },
});
</script>
