import { useState, useEffect } from "react";
import { designs } from "../components/library";
import Script from "next/script";

const Home = () => {
  const [designerName, setDesignerName] = useState("");
  const [selectedDesigns, setSelectedDesigns] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(navigator.userAgent.match(/iPhone|iPad|Android/));

    var form = document.getElementById("designs-form");
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
    try {
      setDesignerName(JSON.parse(localStorage.getItem("designerName")));
      setSelectedDesigns(JSON.parse(localStorage.getItem("selectedDesigns")));
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleCheckboxChange = (event) => {
    const value = parseInt(event.target.value);
    if (event.target.checked) {
      setSelectedDesigns((prevSelectedDesigns) => {
        // コールバック内で正確な状態を更新
        const updatedSelectedDesigns = prevSelectedDesigns
          ? [...prevSelectedDesigns, value]
          : [value];
        console.log(updatedSelectedDesigns); // 正確な状態をコンソールに表示
        setIsFormValid(updatedSelectedDesigns.length > 0);
        return updatedSelectedDesigns;
      });
    } else {
      setSelectedDesigns((prevSelectedDesigns) => {
        // コールバック内で正確な状態を更新
        const updatedSelectedDesigns = prevSelectedDesigns.filter(
          (design) => design !== value
        );
        console.log(updatedSelectedDesigns); // 正確な状態をコンソールに表示
        setIsFormValid(updatedSelectedDesigns.length > 0);
        return updatedSelectedDesigns;
      });
    }
  };

  const handleSelectChange = (event) => {
    setSelectedDesigns(
      Array.from(event.target.selectedOptions, (option) =>
        parseInt(option.value)
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.checkValidity()) {
      // バリデーションが成功した場合の処理
      setIsFormValid(true);
      // 他のフォームの送信処理などを実行
    } else {
      // バリデーションが失敗した場合の処理
      setIsFormValid(false);
      // エラーメッセージを表示するなどの処理
    }
    console.log(isFormValid);
    localStorage.setItem("designerName", JSON.stringify(designerName));
    localStorage.setItem("selectedDesigns", JSON.stringify(selectedDesigns));
    window.location.href = "/page2";
  };

  // const handleCheckboxChange = (event) => {
  //   const value = parseInt(event.target.value);
  //   if (event.target.checked) {
  //     // チェックが付いたら選択済みデザインに追加
  //     setSelectedDesigns([...selectedDesigns, value]);
  //   } else {
  //     // チェックが外れたら選択済みデザインから削除
  //     setSelectedDesigns(selectedDesigns.filter((design) => design !== value));
  //   }
  //   validateDesigns(selectedDesigns); // チェックボックスの変更時にバリデーションを実行
  // };

  // const handleSelectChange = (event) => {
  //   const selectedOptions = Array.from(event.target.selectedOptions, (option) =>
  //     parseInt(option.value)
  //   );
  //   setSelectedDesigns(selectedOptions);
  //   validateDesigns(selectedOptions); // multipleSelectの変更時にバリデーションを実行
  // };

  // const validateDesigns = (designs) => {
  //   // バリデーションロジックを実行
  //   const isValid = designs.length > 0;
  //   setIsDesignsValid(isValid);
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   localStorage.setItem("designerName", JSON.stringify(designerName));
  //   localStorage.setItem("selectedDesigns", JSON.stringify(selectedDesigns));
  //   if (isDesignsValid) {
  //     window.location.href = "/page2";
  //   }
  // };

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
            id="designs-form"
            noValidate
          >
            <div>
              <label htmlFor="nameInput" className="form-label">
                お名前（展示はされません）
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

            <div
              className="mt-4"
              style={isMobile ? {} : { height: "0", overflow: "hidden" }}
              suppressHydrationWarning={true}
            >
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
                onChange={handleSelectChange}
                value={selectedDesigns} // 選択状態を指定
              >
                {designs.map((design) => (
                  <option
                    value={design.index}
                    key={design.index}
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

            <div
              className={isFormValid ? "is-valid" : "is-invalid"}
              style={isMobile ? { height: "0", overflow: "hidden" } : {}}
              suppressHydrationWarning={true}
            >
              <label className="form-label" htmlFor="designSelect">
                あなたにとっての「デザイン」
                <span className="text-danger">*</span>
              </label>

              <div
                className="bg-body rounded-3 border p-3"
                style={{
                  width: "100%",
                  height: "300px",
                  overflowY: "scroll",
                }}
              >
                {designs.map((design) => (
                  <div
                    className="form-check py-1"
                    key={`${design.name}-div`}
                    suppressHydrationWarning={true}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={design.index}
                      id={`design-option-${design.index}`}
                      key={`${design.name}-input`}
                      onChange={handleCheckboxChange}
                      checked={
                        selectedDesigns
                          ? selectedDesigns.includes(design.index)
                          : false
                      }
                      suppressHydrationWarning={true}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`design-option-${design.index}`}
                      key={`${design.name}-label`}
                      suppressHydrationWarning={true}
                    >
                      {design.name}
                    </label>
                  </div>
                ))}
              </div>

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
