import { useEffect, useMemo, useRef, useState } from 'react';
import { project, earliestFeasibleAge, gapToRetireNow, bestPath } from './engine/engine';
import { statutoryAge, DEFAULTS, DEFAULT_CHILD_TOTAL } from './engine/defaults';
import type { Scenario, PensionPath } from './engine/types';
import { FundingChart } from './ui/FundingChart';
import { YearExplainerPanel } from './ui/YearExplainerPanel';
import { Slider, MoneyInput, NumberField, PctField, SwrBadge, ChildrenEditor } from './ui/Controls';
import { fmt, fmtK } from './ui/format';
import { loadState, saveState, clearState } from './persist';

// Illustrative demo profile — round, fictional figures, not a real person.
const INITIAL: Scenario = {
  person: { currentAge: 40, sex: 'male', birthYear: 1986, grossMonthlySalary: 32000 },
  buckets: { liquid: 1_200_000, kerenHishtalmut: 500_000, pension: 1_300_000 },
  monthlyExpense: 17000,
  monthlyRent: 7000,
  monthlySaving: 5000,
  children: [{ currentAge: 2 }],
  childTotal: DEFAULT_CHILD_TOTAL,
  assumptions: DEFAULTS,
  pensionPath: 'wait67',
};

const PATHS: PensionPath[] = ['wait67', 'annuitize60', 'commute60'];
const PATH_LABEL: Record<PensionPath, string> = {
  wait67: 'קצבה מלאה (67)', annuitize60: 'קצבה מוקדמת (60)', commute60: 'היוון חלקי (60)',
};
const PATH_CAP: Record<PensionPath, string> = {
  wait67: 'הפנסיה הופכת לקצבה בגיל 67 (קצבה מלאה).',
  annuitize60: 'מושכים קצבת פנסיה כבר מגיל 60 — מופחתת, אך מוקדמת.',
  commute60: 'בגיל 60 מושכים ~30% מהפנסיה כסכום חד-פעמי לחיסכון הנזיל, והשאר כקצבה.',
};

export default function App() {
  // Rehydrate inputs from this tab's sessionStorage (survives reload, cleared on tab close).
  const persisted = useMemo(() => loadState({ scenario: INITIAL, autoPath: true }), []);
  const [scn, setScn] = useState<Scenario>(persisted.scenario);
  const [autoPath, setAutoPath] = useState(persisted.autoPath);
  const [pinnedAge, setPinnedAge] = useState<number | null>(null);
  const ctrlRef = useRef<HTMLDivElement>(null);

  // Persist inputs on change, lightly debounced so a slider drag doesn't write on every tick.
  useEffect(() => {
    const id = setTimeout(() => saveState({ scenario: scn, autoPath }), 200);
    return () => clearTimeout(id);
  }, [scn, autoPath]);

  // Clear the saved state and return every input to its default.
  const resetAll = () => {
    clearState();
    setScn(INITIAL);
    setAutoPath(true);
    setPinnedAge(null);
  };

  // Wheel anywhere at/right of the knobs pane — including the empty margin outside the app on wide
  // screens — scrolls the knobs. A window listener is needed to catch events beyond the app box.
  // The chart/left side stays inert; when the pointer is over the knobs, native scrolling handles it.
  useEffect(() => {
    const onWheel = (e: globalThis.WheelEvent) => {
      const cp = ctrlRef.current;
      if (!cp || cp.contains(e.target as Node)) return;
      if (e.clientX >= cp.getBoundingClientRect().left) cp.scrollTop += e.deltaY;
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  const best = useMemo(() => bestPath(scn), [scn]);
  const effPath = autoPath ? best : scn.pensionPath;
  const s: Scenario = useMemo(() => ({ ...scn, pensionPath: effPath }), [scn, effPath]);

  const earliest = useMemo(() => earliestFeasibleAge(s), [s]);
  const gap = useMemo(() => gapToRetireNow(s), [s]);
  const statAge = statutoryAge(s.person);
  const annuitizeAge = effPath === 'wait67' ? statAge : 60;
  const planAge = earliest ?? statAge;
  const proj = useMemo(() => project(s, planAge), [s, planAge]);

  // The pinned year's breakdown (ticket 05). Drop a stale pin when the scenario no longer
  // makes that age a retirement year (e.g. the earliest-feasible age moved past it).
  const pinnedEx = pinnedAge == null ? undefined : proj.explanations.find((e) => e.age === pinnedAge);
  useEffect(() => {
    if (pinnedAge != null && !proj.explanations.some((e) => e.age === pinnedAge)) setPinnedAge(null);
  }, [proj, pinnedAge]);

  const update = (patch: Partial<Scenario>) => setScn((p) => ({ ...p, ...patch }));
  const setA = (patch: Partial<Scenario['assumptions']>) => update({ assumptions: { ...scn.assumptions, ...patch } });
  const setB = (patch: Partial<Scenario['buckets']>) => update({ buckets: { ...scn.buckets, ...patch } });
  const pickPath = (p: PensionPath) => { setAutoPath(false); setScn((prev) => ({ ...prev, pensionPath: p })); };

  return (
    <div className="app">
      <div className="brand"><span className="dot" /><b>פרישה מוקדמת בישראל</b><small>· סימולטור</small></div>

      <div className="canvas split2">
        <div className="chartpane">
          <div className="card verdict">
            {earliest === null ? (
              <>
                <div className="big bad">עדיין לא</div>
                <div className="sub">כדי לפרוש כבר עכשיו דרושים עוד כ־<b>{fmtK(gap.lumpSumToday)}</b></div>
              </>
            ) : earliest <= scn.person.currentAge ? (
              <>
                <div className="big good">אפשר לפרוש כבר עכשיו! 🎉</div>
                <div className="sub">לפי הנתונים שלך הכסף מספיק עד גיל {scn.assumptions.planningAge}</div>
              </>
            ) : (
              <>
                <div className="big good">אפשר לפרוש בגיל {earliest}</div>
                <div className="sub">המוקדם ביותר לפי הנתונים. כדי לפרוש <b>כבר עכשיו</b> דרושים עוד כ־<b>{fmtK(gap.lumpSumToday)}</b>.</div>
              </>
            )}
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <FundingChart proj={proj} fireAge={planAge} statAge={statAge} annuitizeAge={annuitizeAge}
              pinnedAge={pinnedAge} onPin={setPinnedAge} />
          </div>

          {pinnedEx ? (
            <div className="card yex-card" style={{ marginTop: 16 }}>
              <YearExplainerPanel ex={pinnedEx} onClose={() => setPinnedAge(null)} />
            </div>
          ) : (
            <div className="pinhint muted" style={{ marginTop: 12 }}>
              לחצו על עמודה בגרף (או השתמשו בחצים ←/→) כדי לראות פירוט מלא של הוצאות, מימון ומס באותה שנה.
            </div>
          )}
        </div>

        <div className="ctrlpane" ref={ctrlRef}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <button type="button" className="btn ghost" style={{ padding: '6px 12px', fontSize: 13 }}
              onClick={resetAll}>אפס נתונים</button>
          </div>
          <div className="realnote">
            כל הסכומים בשקלים של היום. שיעורי התשואה והצמיחה — כולל עליית שכר הדירה — הם <b>ריאליים</b>, כלומר מעבר לאינפלציה.
          </div>
          <div className="toprow" style={{ display: 'flex', gap: 14 }}>
            <NumberField label="גיל נוכחי" value={scn.person.currentAge} width={104} max={150}
              hint="הגיל הנוכחי שלך. הפרישה מחושבת קדימה מגיל זה."
              onChange={(v) => update({ person: { ...scn.person, currentAge: v } })} />
            <NumberField label="גיל תכנון" value={scn.assumptions.planningAge} width={104} max={150}
              hint="אופק התכנון — הגיל שעד אליו הכסף צריך להספיק (גיל מרבי)."
              onChange={(v) => setA({ planningAge: v })} />
          </div>

          <div className="advsec">
            <div className="advtitle">הוצאות</div>
            <div className="sliders">
              <Slider label="הוצאה חודשית" value={scn.monthlyExpense} min={5000} max={60000} step={250} format={fmt}
                hint="כמה אתה מוציא בחודש היום (בשקלים של היום) — סך ההוצאה שהתיק יצטרך לממן, כולל שכר דירה."
                onChange={(v) => update({ monthlyExpense: v, monthlyRent: Math.min(scn.monthlyRent, v) })}
                extra={<SwrBadge monthlyExpense={scn.monthlyExpense} liquidPortfolio={scn.buckets.liquid + scn.buckets.kerenHishtalmut} horizon={scn.assumptions.planningAge - scn.person.currentAge} />} />
              <Slider label="מתוכה שכר דירה" value={scn.monthlyRent} min={0} max={scn.monthlyExpense} step={250} format={fmt}
                hint="חלק ההוצאה החודשית שהוא שכר דירה. 0 אם בבעלותך דירה. שכר הדירה גדל בקצב נפרד (בד״כ מהיר יותר מיתר ההוצאות)."
                onChange={(v) => update({ monthlyRent: v })} />
            </div>
            <div className="row">
              <PctField label="עליית שאר ההוצאות (%)" value={scn.assumptions.realExpenseGrowth}
                hint="עלייה ריאלית שנתית של ההוצאות שאינן שכר דירה, מעבר לאינפלציה. 0 = קבוע ריאלית."
                onChange={(v) => setA({ realExpenseGrowth: v })} />
              <PctField label="עליית שכר דירה (%)" value={scn.assumptions.rentRealGrowth}
                hint="עלייה ריאלית שנתית של שכר הדירה מעבר לאינפלציה. שכר דירה נוטה לעלות מהר מהמדד — לכן חלקו בהוצאה גדל עם הזמן."
                onChange={(v) => setA({ rentRealGrowth: v })} />
            </div>
          </div>

          <div className="advsec">
            <div className="advtitle">חיסכון ונכסים</div>
            <div className="sliders">
              <Slider label="חיסכון נזיל" value={scn.buckets.liquid} min={0} max={30_000_000} step={50000} format={fmt}
                hint="חיסכון נזיל להשקעה (תיק ני״ע, פיקדונות, עו״ש) — לא כולל פנסיה וקרן השתלמות."
                onChange={(v) => setB({ liquid: v })} />
              <Slider label="קרן השתלמות" value={scn.buckets.kerenHishtalmut} min={0} max={3_000_000} step={25000} format={fmt}
                hint="יתרת קרן ההשתלמות — נזילה ופטורה ממס לאחר 6 שנים, ולכן משמשת לגישור עד הפנסיה."
                onChange={(v) => setB({ kerenHishtalmut: v })} />
              <Slider wide label="חיסכון חודשי" value={scn.monthlySaving} min={0} max={40000} step={250} format={fmt}
                hint="כמה אתה חוסך בחודש עד הפרישה, מעבר להפרשות לפנסיה. מתווסף לחיסכון הנזיל."
                onChange={(v) => update({ monthlySaving: v })} />
            </div>
          </div>

          <ChildrenEditor kids={scn.children} childTotal={scn.childTotal}
            onKidsChange={(k) => update({ children: k })} onTotalChange={(t) => update({ childTotal: t })} />

          <div className="advsec">
            <div className="advtitle">פנסיה</div>
            <div className="row">
              <MoneyInput label="צבירת פנסיה" value={scn.buckets.pension}
                hint="היתרה הצבורה בקרן הפנסיה היום. נעולה עד גיל 60, ממשיכה לצמוח והופכת לקצבה חודשית."
                onChange={(v) => setB({ pension: v })} />
              <NumberField label="מקדם קצבה" value={scn.assumptions.coefficient} width={130}
                hint="מחלק את צבירת הפנסיה לקצבה חודשית (יתרה ÷ מקדם). מקדם נמוך = קצבה גבוהה יותר. טיפוסי ~200."
                onChange={(v) => setA({ coefficient: v })} />
              <PctField label="סחף מקדם (%)" value={scn.assumptions.coefficientDrift}
                hint="עלייה שנתית צפויה של המקדם עקב תוחלת חיים עולה — מקטינה מעט את הקצבה העתידית. ~0.4% שמרני."
                onChange={(v) => setA({ coefficientDrift: v })} />
            </div>
            <div className="advtitle" style={{ marginTop: 14 }}>מסלול משיכה</div>
            <label className="autopath">
              <input type="checkbox" checked={autoPath} onChange={(e) => setAutoPath(e.target.checked)} /> עדכן אוטומטית למסלול הפרישה המוקדם ביותר
            </label>
            <div className="seg">
              {PATHS.map((p) => (
                <button key={p} type="button" className={effPath === p ? 'on' : ''} data-tip={PATH_CAP[p]} onClick={() => pickPath(p)}>{PATH_LABEL[p]}</button>
              ))}
            </div>
          </div>

          <div className="advsec">
            <div className="advtitle">הנחות שוק ומיסוי</div>
            <div className="row">
              <PctField label="תשואה ריאלית (%)" value={scn.assumptions.realReturn}
                hint="תשואה שנתית ריאלית (מעבר לאינפלציה) שאתה מניח על ההשקעות, נטו מדמי ניהול. ~4% ברירת מחדל."
                onChange={(v) => setA({ realReturn: v })} />
              <PctField label="גודל משבר (%)" value={scn.assumptions.crashPct}
                hint="עומק ירידת השוק בתרחיש המשבר התקופתי (למשל 35%)."
                onChange={(v) => setA({ crashPct: v })} />
              <NumberField label="משבר כל (שנים)" value={scn.assumptions.crashEvery} width={130} max={100}
                hint="כל כמה שנים מתרחש משבר שוק בתרחיש. 0 = ללא משברים."
                onChange={(v) => setA({ crashEvery: v })} />
            </div>
            <div className="row">
              <PctField label="שחיקת תקרת מס (%)" value={scn.assumptions.capErosion}
                hint="כמה תקרת הקצבה המזכה ומדרגות המס נשחקות ריאלית בשנה (הן קפואות ולא מתעדכנות לאינפלציה)."
                onChange={(v) => setA({ capErosion: v })} />
            </div>
            <label className="autopath">
              <input type="checkbox" checked={scn.assumptions.crashAtRetirement} onChange={(e) => setA({ crashAtRetirement: e.target.checked })} />
              משבר בשנת הפרישה (תרחיש קיצון לסיכון רצף התשואות)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
