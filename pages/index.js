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
    // チェックボックスの選択状態を更新
    const checkboxValue = event.target.value;
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
                  value="editorial"
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  エディトリアルデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="logo"
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  ロゴデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="graphic"
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  グラフィックデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="brand"
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  ブランドデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="industrial"
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  インダストリアルデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="interaction"
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  インタラクションデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="ui"
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  UIデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="product"
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  プロダクトデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="service"
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  サービスデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="experience"
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  エクスペリエンスデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="sound"
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  サウンドデザイン
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="social"
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" htmlFor="flexCheckDefault">
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
