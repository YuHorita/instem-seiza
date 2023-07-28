import styles from "./page.module.css";
// add bootstrap css
import "bootstrap/dist/css/bootstrap.css";

export default function Home() {
  return (
    <main className={styles.main} data-bs-theme="dark">
      <div>
        <h1 className="text-light">Designship Visual Thinking Test Page</h1>
      </div>
      <div className="text-light">
        <form>
          <div class="mb-3">
            <label for="exampleInputEmail1" className="form-label">
              表示名
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
            ></input>
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
                ほにゃららデザイン
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
                ほにゃららデザイン
              </label>
            </div>
          </div>
          <div className="mb-3">
            <label class="form-label">あなたの星座の色を選んでください</label>
          </div>
          <button type="submit" class="btn btn-primary">
            送信
          </button>
        </form>
      </div>
    </main>
  );
}
