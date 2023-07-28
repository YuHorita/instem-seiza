import styles from "./page.module.css";
// add bootstrap css
import "bootstrap/dist/css/bootstrap.css";

export default function Home() {
  return (
    <main className={styles.main} data-bs-theme="dark">
      <section className="container-sm p-4">
        <div className="mb-5">
          <h4 className="text-light">Designship 2023</h4>
          <h2 className="text-light">Visual Thinking Test Page</h2>
        </div>
        <div className="text-light">
          <form>
            <div class="form-floating mb-3">
              <input
                type="email"
                class="form-control"
                id="floatingInput"
                placeholder="デザイン太郎"
              ></input>
              <label for="floatingInput">表示名</label>
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">
                あなたを象徴するデザインの種別を選んでください
              </label>

              <div class="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" for="flexCheckDefault">
                  エディトリアルデザイン
                </label>
              </div>
              <div class="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" for="flexCheckDefault">
                  ロゴデザイン
                </label>
              </div>
              <div class="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" for="flexCheckDefault">
                  グラフィックデザイン
                </label>
              </div>
              <div class="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" for="flexCheckDefault">
                  ブランドデザイン
                </label>
              </div>
              <div class="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" for="flexCheckDefault">
                  インダストリアルデザイン
                </label>
              </div>
              <div class="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" for="flexCheckDefault">
                  インタラクションデザイン
                </label>
              </div>
              <div class="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" for="flexCheckDefault">
                  UIデザイン
                </label>
              </div>
              <div class="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" for="flexCheckDefault">
                  プロダクトデザイン
                </label>
              </div>
              <div class="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" for="flexCheckDefault">
                  サービスデザイン
                </label>
              </div>
              <div class="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" for="flexCheckDefault">
                  エクスペリエンスデザイン
                </label>
              </div>
              <div class="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" for="flexCheckDefault">
                  サウンドデザイン
                </label>
              </div>
              <div class="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                ></input>
                <label className="form-check-label" for="flexCheckDefault">
                  ソーシャルデザイン
                </label>
              </div>
            </div>
            <div class="mb-3">
              <label for="exampleColorInput" class="form-label">
                星座の色を選んでください
              </label>
              <input
                type="color"
                class="form-control form-control-color"
                id="exampleColorInput"
                value="#563d7c"
                title="Choose your color"
              ></input>
            </div>
            <button type="submit" class="btn btn-primary w-100">
              送信
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
