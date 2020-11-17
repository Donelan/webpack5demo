<template>
  <div>hello,about page! {{ time }}</div>
</template>

<script>
import { parseTime } from "@common/utils";
export default {
  data() {
    return {
      time: parseTime(Date.now(), "{y}-{m}-{d} {h}:{i}:{s}"),
    };
  },
};
</script>

<style>
</style>