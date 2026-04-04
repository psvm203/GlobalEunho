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
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const rows = useMemo(
    () => milestones.map((item) => ({ ...item, countdown: calculateCountdown(item.date, now) })),
    [now],
  );

  return (
    <main className="countdown-page">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <section className="countdown-panel">
        <p className="eyebrow">Military Milestones</p>
        <h1 className="title">진급/전역 D-day 카운트다운</h1>

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
