import { useState, useEffect } from "react";
import { designs } from "../components/library";
import Script from "next/script";

const Home = () => {
  const [designerName, setDesignerName] = useState("");
  const [selectedDesigns, setSelectedDesigns] = useState([]);

  useEffect(() => {
    var forms = document.querySelectorAll(".needs-validation");
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener(
        "submit",
        function (event) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add("was-validated");
        },
        false
      );
    });

    // 次のページから戻ってきたときに、入力した内容を復元する
    try {
      setDesignerName(JSON.parse(localStorage.getItem("designerName")));
      setSelectedDesigns(JSON.parse(localStorage.getItem("selectedDesigns")));
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("designerName", JSON.stringify(designerName));
    localStorage.setItem("selectedDesigns", JSON.stringify(selectedDesigns));
    window.location.href = "/page2";
  };

  return (
    <>
      <div className="container p-0" style={{ maxWidth: "600px" }}>
        <img src="/top_thumbnail.png" className="img-fluid" />
      </div>
      <main className="bg-body text-body px-4">
        <section className="container-fluid p-0">
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
            <h3 className="text-primary fs-5 fw-bold">Step 1/3</h3>
            <h2 className="fw-bold">デザインの星を探そう</h2>
          </div>

          <p className="mt-3 mb-5">
            まずは以下の質問に答えて、あなたにとってのデザインの星を夜空の中から見つけてみましょう。
          </p>

          <p className="fw-light">
            <span className="text-danger">*</span>必須の項目です
          </p>
          <form
            onSubmit={handleSubmit}
            className="bg-body-secondary px-4 py-4 mb-5 rounded needs-validation"
            noValidate
          >
            <div>
              <label htmlFor="nameInput" className="form-label">
                お名前
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control p-3"
                id="nameInput"
                value={designerName}
                onChange={(e) => setDesignerName(e.target.value)}
                required
                maxLength="50"
                placeholder="例：デザイン太郎"
              />
              <div className="invalid-feedback">名前を入力してください。</div>
            </div>
            <div className="mt-4">
              <label className="form-label" htmlFor="designSelect">
                あなたにとっての「デザイン」
                <span className="text-danger">*</span>
              </label>
              <select
                className="form-select p-3"
                id="designSelect"
                required
                multiple
                aria-label="design select"
                onChange={(e) =>
                  setSelectedDesigns(
                    Array.from(e.target.selectedOptions, (elm) =>
                      parseInt(elm.value)
                    )
                  )
                }
              >
                {designs.map((design) => (
                  <option
                    value={design.index}
                    key={design.name}
                    suppressHydrationWarning={true}
                  >
                    {design.name}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                最低１つのデザインを選択してください。
              </div>
            </div>

            <div className="d-flex justify-content-center mt-5">
              <button
                type="submit"
                className="btn btn-primary rounded-5 px-5 py-3 fs-5 fw-bold"
              >
                次へ進む
              </button>
            </div>
          </form>
        </section>
        <Script
          type="text/javascript"
          src="//typesquare.com/3/tsst/script/ja/typesquare.js?64fe9ab4c940489b8184031bac1e02d5"
          charset="utf-8"
        />
      </main>
    </>
  );
};

export default Home;
