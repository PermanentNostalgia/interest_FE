const learnPageMetadata = {
  interest: {
    title: "금리",
    unit: "unit1",
    steps: [
      {
        type: "explain",
        label: "용어 정리",
        lines: [
          "금리는 쉽게 말해 '돈의 가격'이자, '돈을 빌려 쓴 것에 대한 사용료'야!",
        ],
      },
      {
        type: "explain",
        label: "상황 가정",
        lines: [
          "(주)WAP상사가 공장을 짓기 위해 은행에서 현금 10,000원을 1년 동안 빌리려고 해.",
          "은행은 돈을 빌려주는 대신 사용료(이자)를 요구하는데, 이때 금리가 5%라면 1년 뒤에 원금과 이자를 합쳐 10,500원을 갚아야 해.",
          "그런데 만약 갑자기 금리가 10%로 훌쩍 뛴다면? 11,000원을 갚아야 하니 WAP상사는 이자 갚기가 부담스러워서 공장 짓는 걸 포기할지도 몰라.",
          "반대로 금리가 1%로 뚝 떨어진다면? 이자가 100원밖에 안 되니 기분 좋게 돈을 더 빌려서 공장을 크게 짓겠지!",
        ],
      },
      {
        type: "explain",
        label: "재설명",
        lines: [
          "금리가 오르면 이자 부담이 커져서 기업이 투자를 줄이고, 금리가 내리면 이자 부담이 줄어 기업의 투자가 활발해져!",
        ],
      },
      {
        type: "quiz",
        label: "OX 퀴즈",
        questions: [
          {
            question: "금리가 오르면 기업들은 은행에서 돈을 빌리기가 더 좋아진다.",
            options: ["O", "X"],
            answerIndex: 1,
          },
          {
            question: "금리는 돈을 빌릴 때 내는 일종의 '사용료'라고 볼 수 있다.",
            options: ["O", "X"],
            answerIndex: 0,
          },
        ],
      },
      {
        type: "simulation",
        label: "금리 조절 체험",
      },
    ],
  },
};

export default learnPageMetadata;