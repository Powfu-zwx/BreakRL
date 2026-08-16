# The RL Failure Atlas

When training won't converge, look up the **symptom you're seeing**. Each entry gives the causal mechanism, a reproducible ablation, and a fix; every experiment comes from this book's chapter notebooks — follow the links to read the English editions online, or re-run locally to verify. The full book is available in both Chinese and English. [中文版](failure-atlas.md)

## 1. Return curves are pure noise; no trend to be seen

- **Symptom**: Raw returns swing wildly — occasional spikes followed by drops — and even the smoothed curve sits at a low level.
- **Mechanism**: REINFORCE feeds whole-episode Monte Carlo returns directly into the gradient; variance scales with episode length, making the gradient direction unreliable.
- **Reproduce**: [Policy Gradient chapter](notes/policy-gradient/pg_experiments_en.ipynb) Figure 1.
- **Fix**: A value baseline (expectation unchanged, variance reduced); better still, Actor-Critic / GAE.

## 2. Entropy collapses to zero fast; returns don't move

- **Symptom**: Policy entropy drops rapidly and the policy becomes nearly deterministic, but returns stall at a low level.
- **Mechanism**: Under a high-variance signal the policy locks early into a bad deterministic choice; without an entropy term, nothing maintains exploration.
- **Reproduce**: [Policy Gradient chapter](notes/policy-gradient/pg_experiments_en.ipynb) Figure 3; for continuous control, see the $\alpha=0$ arm in Figure 1 of the [SAC chapter](notes/sac/sac_experiments_en.ipynb).
- **Fix**: Entropy regularization / the maximum-entropy framework; SAC's automatic temperature tuning treats target entropy as a constraint — no hand-tuning.

## 3. Returns pinned at the starting level from the very first episode

- **Symptom**: Episode return never leaves the starting level (e.g., $\approx 9$ on CartPole); all seeds fail the same way.
- **Mechanism**: Advantage collapse — the critic quickly becomes self-consistent without learning useful values, $|\hat{A}_t| \to 0$, the policy gradient vanishes, and the actor freezes.
- **Reproduce**: [Actor-Critic chapter](notes/actor-critic/ac_experiments_en.ipynb) Figures 1 and 3.
- **Fix**: The A2C combination — GAE to cut variance, a critic learning rate above the actor's (two timescales), an entropy bonus, gradient clipping, and whole-episode batched updates.

## 4. A mid-training cliff: returns collapse

- **Symptom**: Early progress is normal; after some update the return plunges (to the $-8000$ range), then recovers slowly — or never.
- **Mechanism**: The same batch of data is reused for many epochs with unconstrained updates, pushing the policy away from the data-collecting policy; a few transitions' importance ratios blow far past the boundary and erroneous gradients accumulate.
- **Reproduce**: [PPO chapter](notes/ppo/ppo_experiments_en.ipynb) Figures 1 and 3.
- **Fix**: PPO's clip truncates the gradient on out-of-bound ratios, or use a TRPO-style trust region. Note: the mean ratio hides the problem — inspect the tail of the distribution.

## 5. Online Q-learning simply doesn't learn

- **Symptom**: DQN without replay stays at a very low return ($\sim 10$ on CartPole).
- **Mechanism**: Adjacent samples are strongly correlated, breaking the i.i.d. assumption behind stochastic gradients; updates cancel each other or skew toward a local bias.
- **Reproduce**: [DQN chapter](notes/dqn/dqn_experiments_en.ipynb) Figure 2.
- **Fix**: Experience replay — decorrelates samples while reusing old experience.

## 6. Violently oscillating curves; huge variance across seeds

- **Symptom**: Saw-tooth curves; drastically different outcomes across seeds.
- **Mechanism**: The bootstrap target drifts with every step of the online network ("chasing its own tail"); or hard-copied target networks make the target jump periodically.
- **Reproduce**: [DQN chapter](notes/dqn/dqn_experiments_en.ipynb) Figure 3; [SAC chapter](notes/sac/sac_experiments_en.ipynb) Figure 3 (the $\tau=1.0$ arm).
- **Fix**: Target networks with periodic sync; smoother still, soft updates ($\tau \ll 1$).

## 7. Q values keep rising while the policy gets worse

- **Symptom**: Q estimates climb continuously while actual returns fall or stall.
- **Mechanism**: The $\max$ operator combined with estimation noise produces systematic overestimation, and bootstrapping snowballs it.
- **Reproduce**: [SAC chapter](notes/sac/sac_experiments_en.ipynb) Figure 2 (single vs double Q); the extreme offline version is entry 8.
- **Fix**: Clipped Double Q — the bootstrap target uses $\min(Q_1, Q_2)$.

## 8. Offline training: healthy loss, collapsing returns

- **Symptom**: TD loss on offline data decreases normally, but the learned greedy policy's true return rises briefly then falls, staying far below the behavior-cloning (BC) baseline; Q estimates no longer track the policy's true value.
- **Mechanism**: Extrapolation error — the $\max$ in the target probes actions that never appear in the data; their overestimates have no empirical basis and are amplified by bootstrapping. This is distribution shift manifesting in value learning.
- **Reproduce**: [Offline RL chapter](notes/offline-rl/offline-rl_experiments_en.ipynb) Figure 1.
- **Fix**: CQL writes pessimism into the value function (a conservative penalty), or IQL writes it into the action set (in-sample learning); benchmark any offline method against BC before deployment.

## 9. Some seeds converge, others get permanently stuck

- **Symptom**: Same algorithm, same hyperparameters — seeds bifurcate.
- **Mechanism**: Insufficient exploration — early luck locks the agent onto a suboptimal choice and regret grows linearly.
- **Reproduce**: [Bandits chapter](notes/multi-armed-bandit/multi-armed-bandit_experiments_en.ipynb) Figures 1 and 2 (greedy strands about a third of seeds on a suboptimal arm).
- **Fix**: Uncertainty-driven exploration (UCB / Thompson Sampling); if using $\varepsilon$-exploration, decay it — but not too fast.

## 10. Training returns look terrible; the final policy is actually fine

- **Symptom**: Cumulative rewards during training are ugly, yet greedy evaluation is near-optimal.
- **Mechanism**: In off-policy learning the behavior policy ($\varepsilon$-greedy, which "falls off the cliff" during training) is not the target policy (greedy); training curves reflect the behavior policy.
- **Reproduce**: [TD learning chapter](notes/temporal-difference-learning/temporal-difference-learning_experiments_en.ipynb) Figure 3 (Cliff Walking: SARSA vs Q-learning).
- **Fix**: Not necessarily a bug — evaluate the final policy greedily, without exploration; align evaluation protocols before comparing algorithms.

## 11. Hypersensitive to step size / n-step settings

- **Symptom**: Change $n$ or $\alpha$ slightly and learning speed changes drastically.
- **Mechanism**: The bias–variance trade-off — larger $n$ approaches MC (low bias, high variance); smaller $n$ bootstraps more (high bias, low variance); the optimum sits in between and is problem-dependent.
- **Reproduce**: [TD learning chapter](notes/temporal-difference-learning/temporal-difference-learning_experiments_en.ipynb) Figures 1 and 2.
- **Fix**: Treat $n$ (or $\lambda$) as a first-class hyperparameter; TD tolerates larger step sizes than MC.

## 12. Model-based methods: more planning, worse performance

- **Symptom**: Increasing the number of planning steps lowers or destabilizes success rates in stochastic environments.
- **Mechanism**: Model bias is amplified by planning — a wrong model representation (e.g., a last-observation model that records a stochastic transition as whatever was last observed) makes planning overgeneralize.
- **Reproduce**: [Model-based RL chapter](notes/model-based-rl/model-based-rl_experiments_en.ipynb) Figure 3 (contrast Figure 1: in deterministic environments planning is nearly free).
- **Fix**: Approximate the true transition distribution with an empirical count model; planning returns diminish marginally, so match the planning budget to model quality (see Figure 2 of that chapter).

## 13. RLHF: the proxy reward keeps rising while true quality collapses

- **Symptom**: Reward-model scores keep climbing; human spot checks show true quality rising then collapsing; outputs grow degenerate (repetition, over-length, stuffing certain tokens).
- **Mechanism**: Reward hacking — the reward model is only trustworthy within the preference data's coverage; outside it, networks extrapolate monotonically, and PPO seeks exactly the directions where proxy and truth diverge (Goodhart's law).
- **Reproduce**: [RLHF chapter](notes/rlhf/rlhf_experiments_en.ipynb) Figure 2 ($\beta=0$ collapses throughout), Figure 1 (the extrapolation fork).
- **Fix**: KL anchoring with a $\beta$ sweep (Figure 3 of that chapter); widen preference coverage and collect iteratively; whiten rewards to stabilize $\beta$'s units; monitor true metrics, not just the proxy reward.

## 14. DPO: the loss is still decreasing while generations get worse

- **Symptom**: DPO loss decreases and pairwise margins keep growing, while generation quality rises then falls; smaller $\beta$ collapses faster.
- **Mechanism**: DPO's implicit reward $\beta\log(\pi/\pi_{\mathrm{ref}})$, like an explicit reward model, is only trustworthy within the preference data's coverage; $\beta$ is a soft anchor hidden inside the loss and it loosens with training — even without sampling, token-level generalization pushes the generation distribution out of coverage.
- **Reproduce**: [DPO chapter](notes/dpo/dpo_experiments_en.ipynb) Figure 3 ($\beta$ sweep and drift), Figure 2 (implicit-reward extrapolation).
- **Fix**: Increase $\beta$; treat the number of training steps as a hyperparameter with early stopping on generation quality or KL; monitor the generation distribution, not just the loss.

## 15. GRPO: the reward is fine — it just won't learn

- **Symptom**: With verifiable (right/wrong) rewards, GRPO accuracy never moves from the very start; mean reward is constant and the gradient norm is near zero.
- **Mechanism**: Group-relative advantages require within-group variance — when the initial policy's success rate on hard problems is $\approx 0$, every group is either all-correct (easy problems) or all-wrong (hard ones): zero within-group standard deviation, zero advantage, zero gradient. The learning signal vanishes entirely at cold start.
- **Reproduce**: [GRPO chapter](notes/grpo/grpo_experiments_en.ipynb) Figure 3 (cold start vs weak-teacher start; the zero-signal group fraction stays at 100%).
- **Fix**: Cold-start SFT to provide a nonzero initial success rate; curricula from easy to hard; mixed difficulty to preserve within-group variance; process rewards to densify the signal when necessary.

## 16. No matter how high you set the return target, the policy won't improve

- **Symptom**: A Decision Transformer conditioned on a target return above the best in its training data sees returns fall and variance explode; when the task requires exceeding the data's best, no target setting works.
- **Mechanism**: The RTG is itself an input dimension — targets beyond the data push the conditional distribution outside its support (the same principle as "rewards are only trustworthy within coverage" in the RLHF/DPO chapters); moreover, sequence modeling only replays behaviors present in the data, so the ceiling is data quality.
- **Reproduce**: [Decision Transformer chapter](notes/decision-transformer/decision-transformer_experiments_en.ipynb) Figure 1 right (OOD targets fail), Figure 2 (three data-quality ceilings).
- **Fix**: Keep targets inside the data's return range; when the data is near-optimal, DT/SFT suffices — to exceed the data, use value-based methods such as CQL/IQL.

## 17. The offline data clearly suffices, yet the optimal policy can't be stitched together

- **Symptom**: The data covers every transition the optimal path needs (just never within a single trajectory); Q-learning-style methods stitch out the optimum, while DT/BC-style sequence or imitation methods cannot — it looks like poor generalization but is actually the inability to stitch.
- **Mechanism**: A sequence model's context is a within-trajectory history — it retrieves whole sequences it has seen; it does not compose transitions across trajectories. Dynamic-programming backups never ask which trajectory a transition came from, so they stitch naturally.
- **Reproduce**: [Decision Transformer chapter](notes/decision-transformer/decision-transformer_experiments_en.ipynb) Figure 3 (gridworld: offline Q-learning stitches the 14-step optimum; DT at the optimal target fails to reach the goal in 60/90 episodes).
- **Fix**: Choose value methods (Q-learning/CQL/IQL) when stitching matters; or online fine-tuning to add cross-trajectory composition.
