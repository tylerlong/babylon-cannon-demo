import {Howl} from 'howler';

import rollingWav from './rolling.wav';
import clinkWav from './clink.wav';
import dingWav from './ding.wav';

export const clinkSound = new Howl({
  src: clinkWav,
  volume: 1 / 16,
});

export const dingSound = new Howl({
  src: dingWav,
  volume: 1,
});

export const rollingSound = new Howl({
  src: rollingWav,
  volume: 0,
  loop: true,
  rate: 4.0,
});
