#!/bin/sh
# Every case at the display grid (28 mm) and the check grid (40 mm): node tools/cfd/run.mjs per case. About 70 min.
cd "$(dirname "$0")/../.." && for h in 40 28; do for c in base flap lip arch; do node tools/cfd/run.mjs $c $h 9000 | tail -1; done; done
