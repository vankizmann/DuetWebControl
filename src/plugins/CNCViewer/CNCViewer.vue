<style>

</style>

<template>

  <div style="margin: 30px 0;">
    <v-row>
      <v-col cols="12" class="pt-0 pb-0">
        <cnc-move-axis-panel class="mb-2" />
      </v-col>
      <v-col cols="12" class="pt-0 pb-0">
        <cnc-3d-viewer :file="file" extension="gcode" />
      </v-col>
      <v-col cols="6" md="6" v-if="false">
        <v-row dense>
          <v-col cols="12">
            {{ loop }}
            <button @click="increase">increase</button>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="3" v-if="false">
        <v-row dense>
          <macro-list class="macro" />
        </v-row>
      </v-col>
    </v-row>

  </div>
</template>

<script lang="ts">
import Vue from "vue";

import store from "@/store";
import { MachineEvent } from "@/store/machine";
import { mapState } from "vuex";
import ObjectModel from "@duet3d/objectmodel";
const benchy = require('arraybuffer-loader!./benchy.gcode');
const holes = require('arraybuffer-loader!./CutManyHoles.cnc.gcode');

export default Vue.extend({
  data() {
    return {
      file: holes
    };
  },

  computed: {
    loop() : Number {
      return store.state.tooloffset.loop;
    },
    model() : ObjectModel {
      return store.state.machine.model;
    },
  },
  mounted() {
    console.log(this.file);
    store.commit('tooloffset/patch');
  },

  methods: {
    increase() {
      store.commit('tooloffset/patch');
    }
  }
});
</script>
