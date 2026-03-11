type RewardPreviewInput = {
  currentDayTitle: string;
  streak: number;
  reviewBonusXp: number;
};

export function getRewardPreview({
  currentDayTitle,
  streak,
  reviewBonusXp
}: RewardPreviewInput) {
  return {
    streakMessage: `연속 학습 ${streak}일을 유지할 수 있습니다.`,
    rewardMessage: `${currentDayTitle} 완료 후 Review까지 하면 +${reviewBonusXp} XP`,
    title: currentDayTitle
  };
}
