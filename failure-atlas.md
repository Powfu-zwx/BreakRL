# RL 失败模式图鉴

训练不收敛时，从**你看到的症状**出发查表。每条失败模式给出根因机制、可复现的消融实验与修复手段；所有实验都来自本教材各章的 Notebook，点击链接即可在线阅读，或在本地重跑验证。

## 1. 回报曲线噪声大，看不出趋势

- **症状**：原始回报剧烈波动，偶尔冲高又回落，平滑后仍在低位徘徊。
- **机制**：REINFORCE 用整回合蒙特卡洛回报直接进梯度，方差随回合长度放大，梯度方向不可靠。
- **复现**：[Policy Gradient 章](notes/policy-gradient/pg_experiments.ipynb) Figure 1。
- **修复**：价值基线（期望不变、方差下降）；进一步用 Actor-Critic / GAE。

## 2. 熵迅速塌到 0，回报却不涨

- **症状**：策略熵快速下降、策略几乎确定化，但回报停滞在低位。
- **机制**：高方差信号下策略过早锁死在坏的确定性策略；没有熵正则时，没有任何力量维持探索。
- **复现**：[Policy Gradient 章](notes/policy-gradient/pg_experiments.ipynb) Figure 3；连续控制版本见 [SAC 章](notes/sac/sac_experiments.ipynb) Figure 1 的 $\alpha=0$ 对照。
- **修复**：熵正则 / 最大熵框架；SAC 的自动温度调节把目标熵当约束、免手调。

## 3. 回报从一开始就钉死不动

- **症状**：episode return 全程停在起步水平（如 CartPole 上 $\approx 9$），多个种子一致失败。
- **机制**：优势塌缩——Critic 迅速「自洽」但没学到有用价值，$|\hat{A}_t| \to 0$，策略梯度消失，Actor 冻结。
- **复现**：[Actor-Critic 章](notes/actor-critic/ac_experiments.ipynb) Figure 1、Figure 3。
- **修复**：A2C 组合拳——GAE 降方差、Critic 学习率大于 Actor（双时间尺度）、熵正则、梯度裁剪、整回合批量更新。

## 4. 训练中途回报断崖式崩盘

- **症状**：前期正常，某次更新后回报暴跌（可到 $-8000$ 量级），之后缓慢恢复或不再恢复。
- **机制**：同一批数据复用多轮、更新无约束，策略被推离数据来源策略；个别 transition 的重要性比值远超界限，错误梯度被放大累积。
- **复现**：[PPO 章](notes/ppo/ppo_experiments.ipynb) Figure 1、Figure 3。
- **修复**：PPO clip 截断越界比值的梯度，或 TRPO 式信任域。注意：均值比值看不出问题，要看尾部分布。

## 5. 在线 Q 学习完全学不动

- **症状**：去掉回放的 DQN 回报停在极低水平（CartPole 上 $\sim 10$）。
- **机制**：相邻样本强相关，破坏随机梯度的独立同分布假设，更新互相抵消或偏向局部。
- **复现**：[DQN 章](notes/dqn/dqn_experiments.ipynb) Figure 2。
- **修复**：经验回放——去相关，同时反复利用旧经验。

## 6. 训练曲线剧烈震荡、种子间方差大

- **症状**：曲线锯齿状，不同种子结果差异悬殊。
- **机制**：自举目标随在线网络每步漂移（「追着自己的尾巴学」）；或目标网络硬拷贝导致目标周期性跳变。
- **复现**：[DQN 章](notes/dqn/dqn_experiments.ipynb) Figure 3；[SAC 章](notes/sac/sac_experiments.ipynb) Figure 3（$\tau=1.0$ 对照）。
- **修复**：目标网络 + 定期同步；更平滑的软更新（$\tau \ll 1$）。

## 7. Q 值一路上涨，策略却在变差

- **症状**：Q 估计持续攀升，实际回报下降或停滞。
- **机制**：$\max$ 与估计噪声共同造成系统性高估，自举把高估滚雪球。
- **复现**：[SAC 章](notes/sac/sac_experiments.ipynb) Figure 2（单 Q vs 双 Q）；离线场景的极端版本见第 8 条。
- **修复**：Clipped Double Q（自举目标取 $\min(Q_1, Q_2)$）。

## 8. 离线训练：损失正常，回报却塌缩

- **症状**：离线数据上 TD 损失正常下降，但学出的贪心策略真实回报先升后跌、始终远低于行为克隆（BC）基线；Q 估计不再反映策略的真实价值。
- **机制**：外推误差——目标值里的 $\max$ 遍历数据中从未出现的动作，对它们的高估没有依据，被自举放大；这是分布漂移在价值学习上的表现。
- **复现**：[离线强化学习章](notes/offline-rl/offline-rl_experiments.ipynb) Figure 1。
- **修复**：CQL 把悲观写进价值函数（保守惩罚），或 IQL 把悲观写进动作集合（in-sample 学习）；离线方法上线前先和 BC 基线比。

## 9. 有的种子收敛，有的被困死

- **症状**：同一算法、同一超参，多个种子结果两极分化。
- **机制**：探索不足——被早期好运锁定在次优选择，懊悔线性增长。
- **复现**：[多臂老虎机章](notes/multi-armed-bandit/multi-armed-bandit_experiments.ipynb) Figure 1、Figure 2（Greedy 约三成种子被次优臂困死）。
- **修复**：不确定性驱动的探索（UCB / Thompson Sampling）；用 ε 探索时要衰减，但不能衰减太快。

## 10. 训练回报很低，但最终策略其实不错

- **症状**：训练期累计奖励难看，贪心评估却接近最优。
- **机制**：off-policy 学习中，行为策略（ε-greedy，训练中会「坠崖」）不等于目标策略（贪心）；训练曲线反映的是行为策略的表现。
- **复现**：[时序差分学习章](notes/temporal-difference-learning/temporal-difference-learning_experiments.ipynb) Figure 3（Cliff Walking：SARSA vs Q-Learning）。
- **修复**：这不一定是 bug——评估最终策略要用无探索的贪心评估；比较算法时先对齐评估协议。

## 11. 对步长 / n 步设置异常敏感

- **症状**：换一个 $n$ 或 $\alpha$，学习速度天差地别。
- **机制**：偏差-方差权衡——$n$ 越大越接近 MC（低偏差高方差），$n$ 越小 bootstrapping 越多（高偏差低方差），最优点在中间且依赖问题。
- **复现**：[时序差分学习章](notes/temporal-difference-learning/temporal-difference-learning_experiments.ipynb) Figure 1、Figure 2。
- **修复**：把 $n$（或 $\lambda$）当一等公民超参对待；TD 可以用比 MC 更大的步长。

## 12. 模型式方法：规划越多反而越差

- **症状**：加大规划步数后，随机环境中成功率不升反降或波动巨大。
- **机制**：模型偏差被规划放大——错误的模型表示（如 last-observation 把随机转移记成最后一次观测）让规划以偏概全。
- **复现**：[模型式强化学习章](notes/model-based-rl/model-based-rl_experiments.ipynb) Figure 3（对照 Figure 1：确定性环境中规划几乎免费）。
- **修复**：用经验计数模型逼近真实转移分布；规划收益边际递减，预算要与模型质量匹配（见该章 Figure 2）。

## 13. RLHF：代理奖励一直涨，真实质量却在崩

- **症状**：奖励模型给分持续上升，人工抽查的真实质量先升后崩；策略输出越来越单一（重复、超长、堆砌某类 token）。
- **机制**：reward hacking——奖励模型只在偏好数据覆盖区内可信，网络在覆盖区外单调外推；PPO 专找代理与真实分叉的方向（Goodhart 定律）。
- **复现**：[RLHF 章](notes/rlhf/rlhf_experiments.ipynb) Figure 2（β=0 全程崩塌）、Figure 1（外推分叉机制）。
- **修复**：KL 锚定并扫描 β（该章 Figure 3）；扩大偏好数据覆盖、迭代收集；奖励白化稳定 β 量纲；监控真实指标而非只看代理奖励。

## 14. DPO：损失还在降，生成越来越糟

- **症状**：DPO 损失正常下降、偏好对上的 margin 持续增大，生成质量却先升后降；β 越小崩得越快。
- **机制**：DPO 的隐式奖励 β·log(π/π_ref) 与显式奖励模型一样只在偏好数据覆盖区内可信；β 是藏在损失里的软锚，会随训练松动——不采样，token 级泛化也会把生成分布推出覆盖区。
- **复现**：[DPO 章](notes/dpo/dpo_experiments.ipynb) Figure 3（β 扫描与漂移）、Figure 2（隐式奖励外推）。
- **修复**：加大 β；把训练步数当超参、用生成质量或 KL 做 early stopping；监控生成分布而非只看损失。

## 15. GRPO：奖励没问题，就是学不动

- **症状**：可验证奖励（对/错）下 GRPO 准确率从训练开始就纹丝不动；奖励均值恒定，梯度范数接近零。
- **机制**：组相对优势依赖组内差异——起点策略在难题上采样成功率≈0 时，每组要么全对（简单题）要么全错（难题），组内标准差为零，优势与梯度恒为零：学习信号在冷启动处完全消失。
- **复现**：[GRPO 章](notes/grpo/grpo_experiments.ipynb) Figure 3（冷启动 vs 弱教师起点，零信号组占比恒为 100%）。
- **修复**：冷启动 SFT 提供非零成功率的起点；课程设计从易到难；混合难度让组内保持方差；必要时加过程奖励加密信号。
