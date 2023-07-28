"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./page.module.css";
import "bootstrap/dist/css/bootstrap.css";

const Home = () => {
  const [displayName, setDisplayName] = useState("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#563d7c");
  const router = useRouter();

  const handleCheckboxChange = (event) => {
    const checkboxValue = parseInt(event.target.value, 10);
    if (event.target.checked) {
      setSelectedCheckboxes([...selectedCheckboxes, checkboxValue]);
    } else {
      setSelectedCheckboxes(
        selectedCheckboxes.filter((item) => item !== checkboxValue)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // フォームの入力内容を取得し、遷移先のページに渡す
    const formData = {
      displayName: displayName,
      selectedCheckboxes: selectedCheckboxes,
      selectedColor: selectedColor,
    };
    router.push({
      pathname: "/result",
      query: formData,
    });
  };
  return (
    <main className={styles.main} data-bs-theme="dark">
      <section className="container-sm p-4">
        <div className="mb-5">
          <h4 className="text-light">Designship 2023</h4>
          <h2 className="text-light">Visual Thinking Test Page</h2>
        </div>
        <div className="text-light">
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="name"
                className="form-control"
                id="floatingInput"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="デザイン太郎"
              />
              <label htmlFor="floatingInput">表示名</label>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                あなたを象徴するデザインの種別を選んでください
              </label>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={0}
                  id="editorial"
                  checked={selectedCheckboxes.includes(0)}
                  onChange={handleCheckboxChange}
                ></input>
                <label className="form-check-label" htmlFor="editorial">
                  エディトリアルデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={1}
                  id="logo"
                  checked={selectedCheckboxes.includes(1)}
                  onChange={handleCheckboxChange}
                ></input>
                <label className="form-check-label" htmlFor="logo">
                  ロゴデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={2}
                  id="graphic"
                  checked={selectedCheckboxes.includes(2)}
                  onChange={handleCheckboxChange}
                ></input>
                <label className="form-check-label" htmlFor="graphic">
                  グラフィックデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={3}
                  id="brand"
                  checked={selectedCheckboxes.includes(3)}
                  onChange={handleCheckboxChange}
                ></input>
                <label className="form-check-label" htmlFor="brand">
                  ブランドデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={4}
                  id="industrial"
                  checked={selectedCheckboxes.includes(4)}
                  onChange={handleCheckboxChange}
                ></input>
                <label className="form-check-label" htmlFor="industrial">
                  インダストリアルデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={5}
                  id="interaction"
                  checked={selectedCheckboxes.includes(5)}
                  onChange={handleCheckboxChange}
                ></input>
                <label className="form-check-label" htmlFor="interaction">
                  インタラクションデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={6}
                  id="ui"
                  checked={selectedCheckboxes.includes(6)}
                  onChange={handleCheckboxChange}
                ></input>
                <label className="form-check-label" htmlFor="ui">
                  UIデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={7}
                  id="product"
                  checked={selectedCheckboxes.includes(7)}
                  onChange={handleCheckboxChange}
                ></input>
                <label className="form-check-label" htmlFor="product">
                  プロダクトデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={8}
                  id="service"
                  checked={selectedCheckboxes.includes(8)}
                  onChange={handleCheckboxChange}
                ></input>
                <label className="form-check-label" htmlFor="service">
                  サービスデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={9}
                  id="experience"
                  checked={selectedCheckboxes.includes(9)}
                  onChange={handleCheckboxChange}
                ></input>
                <label className="form-check-label" htmlFor="experience">
                  エクスペリエンスデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={10}
                  id="sound"
                  checked={selectedCheckboxes.includes(10)}
                  onChange={handleCheckboxChange}
                ></input>
                <label className="form-check-label" htmlFor="sound">
                  サウンドデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={"11"}
                  id="social"
                  checked={selectedCheckboxes.includes(11)}
                  onChange={handleCheckboxChange}
                ></input>
                <label className="form-check-label" htmlFor="social">
                  ソーシャルデザイン
                </label>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleColorInput" className="form-label">
                Color picker
              </label>
              <input
                type="color"
                className="form-control form-control-color"
                id="exampleColorInput"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                title="Choose your color"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              送信
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Home;
