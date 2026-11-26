# Stationarity and compute budget

## What can the saved runs establish?

### Takeaway

One tunnel transit measures how long freestream convection takes. The three saved windows cannot establish equilibration or independence, and the existing rule can accept the visibly drifting splitter. The wing data show the directions in the stored mean fields without enough local history to test stationarity.

### Cited Findings

- The code retains three one-transit splitter pairs after three settling transits. Its test uses the SD with divisor K, assumes independent batches, combines the two standard errors, and only asks that double the standard error and each case’s endpoint drift are smaller than the mean case contrast. The supplied 5 mm across-pressure contrasts are 0.990, 0.849, 0.744. The mean is 0.861 and the largest within-case endpoint shift is 0.334, so this example passes the drift limb. The generated record is explicitly a one-grid preview. [Test](/Users/kunabel/workspace/MercedesExperience/tools/cfd/part.mjs:28) · [Sampling](/Users/kunabel/workspace/MercedesExperience/tools/cfd/part.mjs:109) · [Run](/Users/kunabel/workspace/MercedesExperience/tools/cfd/results/splitter.json)
- The front-corner driver averages two transits of settling and three production windows, then computes a nonlinear metric on each window’s mean vector field. The display recomputes the metric on the pooled field. The wing’s original whole-car solver writes one pooled velocity field, plus blockwise whole-car forces. It records no blockwise velocity in the wing probe, so the force history cannot establish its angular uncertainty. With 9,000 steps and 500-step chunks, the velocity-averaging interval is steps 4,000–9,000, about 1.21 and 1.73 tunnel transits at 28 and 40 mm respectively. [Corner solver](/Users/kunabel/workspace/MercedesExperience/tools/cfd/part.mjs:171) · [Corner export](/Users/kunabel/workspace/MercedesExperience/tools/cfd/part.mjs:224) · [Wing solver](/Users/kunabel/workspace/MercedesExperience/tools/cfd/run.mjs:30) · [Run record](/Users/kunabel/workspace/MercedesExperience/tools/cfd/results/wing.json)
- The exact startup solution for idealized parallel plates contains modes decaying as exp(−n²π²νt/g²). For this gap and nominal molecular viscosity, the slowest time constant g²/(π²ν) corresponds to 5.61 original 2.6 m transits. Using g²/ν alone gives 55.4 transits before the π² factor. The calculation uses Re = U × 1 m/ν = 10,000 and g = 0.12 m. [Muñoz et al., §4.3, Eq. 60](https://arxiv.org/pdf/1203.1037) · [Geometry](/Users/kunabel/workspace/MercedesExperience/tools/cfd/part.mjs:93)

### Inferences

- Three transits could plainly be too short for a viscous underfloor profile to relax. This is an idealized *velocity* time scale, not a forecast for pressure drift. Advection/residence, an entrance developing along x, subgrid viscosity, channel flow split and boundary forcing change the answer. Estimate underfloor residence from underbody length divided by measured mean gap flux per unit gap height. Monitor it alongside the trend, density reference and mass inventory.
- Identical first and last values can surround a long oscillation. Two cases with a large common transient can also pass the present test. The confidence calculation presupposes the very stationarity in question.

### Gaps

- The saved three means cannot recover autocorrelation, independently sampled batches, or trends outside the sampled interval. Full-production uncertainty and cause of the transient remain undetermined.

## What acceptance rule fits the exhibit?

### Takeaway

Use a short pilot to select a burn-in and correlated-sample batch length. Fix the production horizon in advance, estimate uncertainty on the *contrast* on each grid, and test the same contrast after enlarging the domain on the cheap mesh.

### Cited Findings

- Oliver et al. separate sampling errors from resolution errors and show how serial correlation reduces effective sample size. Their uncertainty model assumes a stationary series. Even a third resolution does not automatically give a reliable order of convergence in the presence of sampling error. [Oliver et al., §II A–B](https://arxiv.org/abs/1311.0828)
- Rezaeiravesh et al. compare batch methods with autocorrelation methods on turbulent flow fields. Small batches can understate uncertainty and large batches can leave too few replicates. The relevant correlation time depends on the quantity and the location. [Rezaeiravesh et al., §§6.2 and 6.5](https://arxiv.org/abs/2310.08676)

### Inferences

1. Predeclare the observable, sign convention, sampling footprint, and a meaningfully small tolerance per observable. On the coarse pilot, save a cheap equally spaced history of the local pressure load, inlet/outlet and gap mass flux, average density, upstream reference and representative downstream velocity. Choose cadence to resolve shedding and the relevant slow modes. Saving field snapshots over the full domain is unnecessary for these quantities.
2. Exclude startup. Check rolling averages and half-record averages after the transient, individual cases as well as the contrast, inlet/outlet mass balance including storage, absence of secular mass/density or gap-flow evolution and no large changes when discarding another block. Looking for a nonsignificant slope has little power on a short record. One possible equivalence check is that the uncertainty interval for the early–late shift, or fitted end-to-end change using block means, lies inside a prespecified drift tolerance small relative to the minimum interesting effect. Persistence of a few flat windows is a screen, never a proof. For steady or periodic numerical solutions use residual or successive-cycle convergence and sensitivity to added cycles rather than fictitious stochastic confidence intervals.
3. Estimate the integral correlation time on the stationary pilot for the measured signals. As an engineering starting point take nonoverlapping batches of several correlation times, spanning many shedding cycles if present. Look for small adjacent-block correlation and comparable mean SE on doubling the block length while keeping enough blocks. Aim for at least about 8–12 reasonably independent batches per case for a rough uncertainty; this is a target, not a guarantee, and 8 short blocks are no improvement. The production duration in physical or nondimensional time should be comparable across grids.
4. For a scalar linear time mean and separate, effectively independent case runs, with K batches per case, use Δ = mean(B) − mean(A), SE = sqrt(s_A²/K_A + s_B²/K_B), sample standard deviations with K_i−1 denominator, and a Welch t interval (e.g. 95%). Keep the experimental design separate from the inference. Synchronizing the two time counters does not pair eddies. A valid jointly forced/matched design can estimate the variance of paired block differences, including covariance. For a nonlinear function of a mean field such as a threshold width, streamline endpoint, or angle, retain block sums of the actual velocity components in the necessary region. Rebuild the pooled mean and recompute the observable in a block bootstrap or delete-block jackknife for the contrast. For widths where the selected connected band jumps, inspect jumps and use the integrated-deficit observable first. An average of instantaneous widths/angles estimates a different quantity.
5. Require the same sign with an interval wholly on that side of zero at each grid separately, plus unchanged sign under the coarse-domain paired-case perturbation. Do not pool grids into an ensemble. If asserting domain influence is smaller than the contrast, bound the change of contrasts including sampling uncertainty against a prechosen domain tolerance smaller than the smaller credible effect. A one-case box enlargement cannot show that. Two meshes support a tested model sign, not an order, continuum force, or road-car validation. Report all planned perturbations. Plan one fixed production horizon based on the pilot or prespecified interim looks with appropriate coverage. Stop early for instability or failed sensitivity; if a budget cap leaves long correlation, secular drift, or interval crossing zero, show geometry/flow only.

### Gaps

- No universal number of settling transits, blocks, or percentage thresholds; no short-run test excludes all unknown slow modes. Coarse production can be cheaper than nominal here if the primary observable is linear and does not require full-field statistics each step.

## How should the Mac hours be spent?

### Takeaway

Fix the pressure/gap forcing and measurement first, then screen both settings in the original and enlarged coarse boxes before buying the pair of fine runs. Budget by N times the number of time steps. Uniform two-dimensional full-car meshes extending far into the far field become expensive quickly.

### Cited Findings

- At the user’s stated throughput, one splitter transit on the current 5 mm grid needs (520×500)(5,200)/16M = 84.5 s or 1.41 minutes; 2.5 mm needs 11.27 minutes. The present larger 5 mm domain would need 5.65 minutes per transit and per case. At 30 M/s and using the actual chunk-rounded windows, W 196 needs 1.11 min at 24 mm versus 5.32 min at 16 mm. The 5 mm splitter-forward log took approximately 3.4 min per production window, and the 16 mm W 196 enclosed log spent 8.9–9.7 min per production window. Treat advertised rates as optimistic budgets and measure the first blocks locally. These are elapsed-machine estimates on the stated hardware, not aggregate CPU-core hours. [Dimensioning and timing](/Users/kunabel/workspace/MercedesExperience/tools/cfd/part.mjs:103) · [3-D schedule](/Users/kunabel/workspace/MercedesExperience/tools/cfd/part.mjs:167) · [2-D timing](/Users/kunabel/workspace/MercedesExperience/tools/cfd/out/logs/split-fwd-5.log) · [3-D timing](/Users/kunabel/workspace/MercedesExperience/tools/cfd/out/logs/3d.log)

### Inferences

- At fixed physical box and lattice U, one physical transit scales as h⁻³ in 2-D and h⁻⁴ in 3-D. Doubling the streamwise box length also doubles both the cell count and the number of steps per standard tunnel transit. For cross-domain comparison use fixed model-based physical time in addition to reported transit count. A six-transit baseline fine splitter pair alone consumes about 2.25 wall-hours at the quoted rate and can cost more in practice. A costly uniformly resolved full-size outer box can therefore be disproved by costing a single transit; use a coarse whole-car background plus tested local patches when it cannot fit.
- Current exporter probes the enlarged splitter box for the tucked lip only, and for the W 196 the exposed wheel only. Screen *both* configurations on the coarse large domain; otherwise the sensitivity of the exhibit contrast is unmeasured. [Splitter export](/Users/kunabel/workspace/MercedesExperience/tools/cfd/part.mjs:130) · [Wheel export](/Users/kunabel/workspace/MercedesExperience/tools/cfd/part.mjs:211)
- If production cannot collect enough independent batches in the remaining hours, report the observed fields and the unresolved claim. If an extra pair is possible, allocate to W 196 coarse-domain and missing fine comparison before a refined wing-local solve; the latter lacks validated local inflow and would not repair the existing uncertainty.

### Gaps

- Revised-domain runtimes and actual autocorrelation lengths are unavailable. A fixed number of CPU-hours cannot guarantee a resolved sign.
