import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { designs } from "../components/library";

const Home = () => {
  const [designerName, setDesignerName] = useState("");
  const [selectedDesigns, setSelectedDesigns] = useState([]);

  useEffect(() => {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll(".needs-validation");

    // Loop over them and prevent submission
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
  }, []);
  // Example starter JavaScript for disabling form submissions if there are invalid fields

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("designerName", JSON.stringify(designerName));
    // localStorage.setItem("selectedDesigns", JSON.stringify(selectedCheckboxes));
    localStorage.setItem("selectedDesigns", JSON.stringify(selectedDesigns));

    window.location.href = "/page2";
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
          <h3 className="text-primary fs-5 fw-bold">Step 1/3</h3>
          <h2 className="fw-bold">デザインの星を探そう</h2>
        </div>

        <p className="mt-3">
          まずは以下の質問に答えて、あなたにとってのデザインの星を夜空の中から見つけてみましょう。
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-body-secondary px-4 py-5 my-5 rounded needs-validation"
          noValidate
        >
          <div>
            <label htmlFor="nameInput" className="form-label">
              表示名
            </label>
            <input
              type="text"
              className="form-control p-3"
              id="nameInput"
              value={designerName}
              onChange={(e) => setDesignerName(e.target.value)}
              // placeholder="デザイン太郎"
              required
            />
            <div className="invalid-feedback">表示名を入力してください。</div>
          </div>
          <div className="mt-4">
            <label className="form-label" htmlFor="designSelect">
              あなたにとっての「デザイン」
            </label>
            <select
              className="form-select p-3"
              id="designSelect"
              required
              multiple
              aria-label="design select"
              // selectedOptionsの値はobject型になっているので、valueを取り出した配列に変換し、selectedDesignsに格納する
              onChange={(e) =>
                setSelectedDesigns(
                  Array.from(e.target.selectedOptions, (elm) =>
                    parseInt(elm.value)
                  )
                )
              }
            >
              {designs.map((design) => (
                <option value={design.index} key={design.name}>
                  {design.name}
                </option>
              ))}
            </select>
            <div className="invalid-feedback">
              最低１つのデザインを選択してください。
            </div>
            {/* {designs.map((design, index) => (
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
              ))} */}
          </div>

          <div className="d-flex justify-content-center mt-5">
            <button
              type="submit"
              className="btn btn-primary rounded-5 px-5 py-2 fs-5"
            >
              回答を送信する
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Home;
