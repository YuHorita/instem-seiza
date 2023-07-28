import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const ResultPage = () => {
  const router = useRouter();
  const { answer } = router.query;

  // p5.jsを動的に読み込む
  const DynamicP5Sketch = dynamic(() => import("../components/P5Sketch"), {
    ssr: false, // サーバーサイドでのレンダリングを無効にする
  });

  return (
    <div>
      <h1>Result Page</h1>
      <p>Your answer: {answer}</p>
      {/* p5.jsスケッチを表示 */}
      <DynamicP5Sketch answer={answer} />
    </div>
  );
};

export default ResultPage;
