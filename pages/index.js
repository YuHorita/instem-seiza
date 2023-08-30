"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.css";
import { designs } from "../components/library";


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
    // フォームの入力内容を取得し、localStorageで遷移先のページに渡す
    const formData = {
      displayName: displayName,
      selectedCheckboxes: selectedCheckboxes,
    };
    localStorage.setItem("formData", JSON.stringify(formData));
    router.push({
      pathname: "/step2",
    });

    // e.preventDefault();
    // // フォームの入力内容を取得し、遷移先のページに渡す
    // const formData = {
    //   displayName: displayName,
    //   selectedCheckboxes: selectedCheckboxes,
    //   selectedColor: selectedColor,
    // };
    // router.push({
    //   pathname: "/result",
    //   query: formData,
    // });
  };
  return (
    <main data-bs-theme="designship" className="bg-body text-body ">
      <section className="container-sm p-4">
        <div className="mb-5">
          <h1 className="text-center mt-4 mb-4 lh-base fw-bold">
            デザイナーの
            <br />
            星座を描こう
          </h1>

          <p>
            デザインが広がりすぎた時代において、一言で「デザイン」と言っても捉え方は人それぞれ。本企画は参加者の皆さんがひとりひとりの「デザイナーの星座」を発見していくためのものです。
          </p>
        </div>

        <div className="text-center">
          <h3 className="text-primary fs-5 fw-bold">Step 1/2</h3>
          <h2 className="fw-bold">デザインの星を探そう</h2>
        </div>

        <p className="mt-3">
          まずは以下の質問に答えて、あなたにとってのデザインの星を夜空の中から見つけてみましょう。
        </p>

        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-body-secondary p-4 my-5 rounded"
          >
            <div className="py-3">
              <label htmlFor="nameInput" className="form-label">
                表示名
              </label>
              <input
                type="text"
                className="form-control p-3"
                id="nameInput"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="デザイン太郎"
              />
            </div>
            <div className="pt-4">
              <label className="form-label">あなたにとっての「デザイン」</label>
              {designs.map((design, index) => (
                <div className="form-check" key={index}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`design-${index}`}
                    value={index}
                    checked={selectedCheckboxes.includes(index)}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`design-${index}`}
                  >
                    {design.name}
                  </label>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-center my-3">
              <button
                type="submit"
                className="btn btn-primary rounded-5 px-5 py-2 fs-5"
              >
                回答を送信する
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Home;
