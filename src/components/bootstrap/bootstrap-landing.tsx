"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  loadAppContext,
  type AppBootstrapState
} from "@/lib/bootstrap/load-app-context";
import { clearDeviceBinding } from "@/lib/device/device-binding";
import { getMockChildDashboard, type ChildDashboardState } from "@/lib/mock/child-dashboard";
import { getMockDayStage } from "@/lib/mock/day-stage";
import { resolveChildDashboard } from "@/lib/mock/resolve-child-dashboard";
import { MainHub } from "@/components/hub/main-hub";

const initialState: AppBootstrapState = {
  status: "loading",
  binding: null
};

export function BootstrapLanding() {
  const [state, setState] = useState<AppBootstrapState>(initialState);
  const [dashboard, setDashboard] = useState<ChildDashboardState | null>(null);

  useEffect(() => {
    let active = true;

    void loadAppContext()
      .then((nextState) => {
        if (active) {
          setState(nextState);
        }
      })
      .catch(() => {
        if (active) {
          setState({
            status: "unavailable",
            binding: null,
            reason: "Bootstrap failed unexpectedly"
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Load dashboard when state becomes "ready"
  useEffect(() => {
    if (state.status !== "ready") {
      return;
    }

    let active = true;

    const timeout = setTimeout(() => {
      if (active) {
        setDashboard(getMockChildDashboard(state.binding.childId));
      }
    }, 5000);

    void resolveChildDashboard(state.binding.childId)
      .then((result) => {
        if (active) {
          clearTimeout(timeout);
          setDashboard(result);
        }
      })
      .catch(() => {
        if (active) {
          clearTimeout(timeout);
          setDashboard(getMockChildDashboard(state.binding.childId));
        }
      });

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [state]);

  if (state.status === "loading") {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f1e6ff,_#fff_50%,_#e8f5ff)] px-6 py-10">
        <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
          불러오는 중...
        </div>
      </main>
    );
  }

  if (state.status === "needs_provision") {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f1e6ff,_#fff_50%,_#e8f5ff)] px-6 py-10">
        <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
          <h1 className="text-3xl font-black text-slate-950">가족 설정이 필요합니다</h1>
          <p className="text-slate-600">
            이 iPad는 아직 child profile에 연결되지 않았습니다.
          </p>
          <Link className="big-button bg-slate-950 text-white" href="/provision">
            Provision 시작
          </Link>
        </div>
      </main>
    );
  }

  if (state.status === "stale_binding") {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f1e6ff,_#fff_50%,_#e8f5ff)] px-6 py-10">
        <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
          <h1 className="text-3xl font-black text-slate-950">기기 연결을 다시 확인해야 합니다</h1>
          <p className="text-slate-600">{state.reason}</p>
          <div className="flex flex-col gap-3 md:flex-row">
            <button
              className="big-button border-0 bg-slate-950 text-white"
              onClick={() => {
                clearDeviceBinding();
                window.location.href = "/provision";
              }}
              type="button"
            >
              연결 초기화 후 다시 설정
            </button>
            <Link className="big-button bg-white text-slate-950 ring-1 ring-slate-200" href="/provision">
              Provision 보기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (state.status === "unavailable") {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f1e6ff,_#fff_50%,_#e8f5ff)] px-6 py-10">
        <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
          <h1 className="text-3xl font-black text-slate-950">설정이 아직 준비되지 않았습니다</h1>
          <p className="text-slate-600">{state.reason}</p>
          <Link className="big-button bg-slate-950 text-white" href="/provision">
            Provision 화면으로 이동
          </Link>
        </div>
      </main>
    );
  }

  if (state.status === "preview_ready") {
    const previewDashboard = getMockChildDashboard(state.binding.childId);
    const dayStage = getMockDayStage(previewDashboard.childId, previewDashboard.currentDayId);

    return (
      <MainHub
        childId={previewDashboard.childId}
        currentDayId={previewDashboard.currentDayId}
        childName={previewDashboard.childName}
        level={previewDashboard.level}
        streak={previewDashboard.streak}
        currentDayTitle={previewDashboard.currentDayTitle}
        dayStage={dayStage}
        previewMode
      />
    );
  }

  if (!dashboard) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f1e6ff,_#fff_50%,_#e8f5ff)] px-6 py-10">
        <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
          불러오는 중...
        </div>
      </main>
    );
  }

  const dayStage = getMockDayStage(dashboard.childId, dashboard.currentDayId);

  return (
    <MainHub
      childId={dashboard.childId}
      currentDayId={dashboard.currentDayId}
      childName={dashboard.childName}
      level={dashboard.level}
      streak={dashboard.streak}
      currentDayTitle={dashboard.currentDayTitle}
      dayStage={dayStage}
      previewMode={false}
    />
  );
}
