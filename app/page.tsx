"use client";

import { useEffect, useMemo, useState } from "react";

type Milestone = {
  id: string;
  title: string;
  date: string;
  note: string;
};

type Countdown = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ddayLabel: string;
  done: boolean;
};

const ENLISTMENT = "2026-03-23T00:00:00+09:00";
const DISCHARGE_END = "2027-09-23T00:00:00+09:00"; // 2027-09-22 24:00 KST

type Progress = {
  percent: number;
  clockHours: number;
  clockMinutes: number;
  clockSeconds: number;
};

function calculateProgress(now: number): Progress {
  const start = new Date(ENLISTMENT).getTime();
  const end = new Date(DISCHARGE_END).getTime();
  const total = end - start;
  const elapsed = Math.min(Math.max(now - start, 0), total);
  const fraction = elapsed / total;

  const clockTotalSeconds = fraction * 86400;
  return {
    percent: fraction * 100,
    clockHours: Math.floor(clockTotalSeconds / 3600),
    clockMinutes: Math.floor((clockTotalSeconds % 3600) / 60),
    clockSeconds: Math.floor(clockTotalSeconds % 60),
  };
}

const milestones: Milestone[] = [
  {
    id: "private-first-class",
    title: "일병 진급일",
    date: "2026-06-01T00:00:00+09:00",
    note: "2026. 06. 01",
  },
  {
    id: "corporal",
    title: "상병 진급일",
    date: "2026-12-01T00:00:00+09:00",
    note: "2026. 12. 01",
  },
  {
    id: "sergeant",
    title: "병장 진급일",
    date: "2027-06-01T00:00:00+09:00",
    note: "2027. 06. 01",
  },
  {
    id: "discharge",
    title: "전역일",
    date: "2027-09-22T00:00:00+09:00",
    note: "2027. 09. 22",
  },
];

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

function calculateCountdown(targetDate: string, now: number): Countdown {
  const target = new Date(targetDate).getTime();
  const diff = target - now;
  const remaining = Math.max(diff, 0);

  const days = Math.floor(remaining / DAY);
  const hours = Math.floor((remaining % DAY) / HOUR);
  const minutes = Math.floor((remaining % HOUR) / MINUTE);
  const seconds = Math.floor((remaining % MINUTE) / SECOND);

  const dday = Math.ceil(Math.abs(diff) / DAY);

  if (diff >= 0) {
    return {
      totalMs: remaining,
      days,
      hours,
      minutes,
      seconds,
      ddayLabel: `D-${dday}`,
      done: false,
    };
  }

  return {
    totalMs: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ddayLabel: `D+${dday}`,
    done: true,
  };
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export default function Home() {
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(timer);
  }, []);

  const rows = useMemo(
    () => milestones.map((item) => ({ ...item, countdown: calculateCountdown(item.date, now) })),
    [now],
  );

  const progress = useMemo(() => calculateProgress(now), [now]);

  return (
    <main className="countdown-page">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <section className="countdown-panel">
        <p className="eyebrow">Military Milestones</p>
        <h1 className="title">은호 군생활 계산기</h1>

        <div className="service-progress">
          <div className="service-progress-header">
            <span className="service-progress-label">복무 진행률</span>
            <span className="service-progress-percent">{progress.percent.toFixed(8)}%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(progress.percent, 100)}%` }}
            />
          </div>
        </div>

        <div className="discharge-clock-panel">
          <p className="eyebrow">전역 시계</p>
          <div className="discharge-clock">
            <div className="discharge-clock-segment">
              <strong>{pad(progress.clockHours)}</strong>
              <span>시</span>
            </div>
            <div className="discharge-clock-colon">:</div>
            <div className="discharge-clock-segment">
              <strong>{pad(progress.clockMinutes)}</strong>
              <span>분</span>
            </div>
            <div className="discharge-clock-colon">:</div>
            <div className="discharge-clock-segment">
              <strong>{pad(progress.clockSeconds)}</strong>
              <span>초</span>
            </div>
          </div>
        </div>

        <ul className="grid">
          {rows.map((item) => (
            <li key={item.id} className="card">
              <div className="card-head">
                <h2>{item.title}</h2>
                <span className={`dday ${item.countdown.done ? "done" : ""}`}>
                  {item.countdown.ddayLabel}
                </span>
              </div>

              <p className="date">기준일: {item.note}</p>

              <div className="clock" aria-label={`${item.title} 남은 시간`}>
                <div>
                  <strong>{item.countdown.days}</strong>
                  <span>일</span>
                </div>
                <div>
                  <strong>{pad(item.countdown.hours)}</strong>
                  <span>시간</span>
                </div>
                <div>
                  <strong>{pad(item.countdown.minutes)}</strong>
                  <span>분</span>
                </div>
                <div>
                  <strong>{pad(item.countdown.seconds)}</strong>
                  <span>초</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
