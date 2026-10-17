import type { FC } from "hono/jsx";
import type { Data } from "../db";
import { Icon, ICON_CLOSE } from "./Icon";

// ボトムシート。家事を押すと記録、ごほうびを押すと交換して、シートを閉じる
export const Sheet: FC<Pick<Data, "users" | "chores" | "rewards"> & { who: number }> = ({ users, chores, rewards, who }) => (
  <dialog id="sheet" class="sheet" aria-labelledby="sheet-title">
    {/* 外側の dialog に余白を持たせず、背景タップを dialog 自身へのクリックとして判定する */}
    <div class="sheet-body">
      <div class="sheet-handle" aria-hidden="true"></div>
      <div class="sheet-head">
        <div class="seg" role="radiogroup" aria-label="種類">
          <label>
            <input type="radio" name="sheet-tab" value="chores" checked />
            家事をやった
          </label>
          <label>
            <input type="radio" name="sheet-tab" value="rewards" />
            ごほうび
          </label>
        </div>
        <h2 id="sheet-title" class="visually-hidden">
          記録する
        </h2>
        <button class="icon-btn" data-close-sheet aria-label="閉じる">
          <Icon d={ICON_CLOSE} />
        </button>
      </div>
      <fieldset class="who">
        <legend class="label">だれ？</legend>
        {users.map((u) => (
          <label>
            <input type="radio" name="user_id" value={u.id} checked={u.id === who} data-balance={u.balance} />
            {u.name}
            <span class="label">{u.balance}pt</span>
          </label>
        ))}
      </fieldset>
      <div class="panel panel-chores">
        {chores.length === 0 ? (
          <p class="empty">家事がまだありません。右下の「編集」から追加してください。</p>
        ) : (
          <div class="chores">
            {chores.map((ch) => (
              <button class="chore" hx-post="/logs" hx-vals={JSON.stringify({ chore_id: ch.id })} hx-include="#sheet [name=user_id]" hx-swap="none">
                {ch.name}
                <span class="label">+{ch.points} pt</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div class="panel panel-rewards">
        {rewards.length === 0 ? (
          <p class="empty">ごほうびがまだありません。右下の「編集」から追加してください。</p>
        ) : (
          <div class="chores">
            {rewards.map((r) => (
              <button class="chore reward" data-cost={r.points} hx-post="/redeem" hx-vals={JSON.stringify({ reward_id: r.id })} hx-include="#sheet [name=user_id]" hx-swap="none">
                {r.name}
                <span class="label">-{r.points} pt</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </dialog>
);
