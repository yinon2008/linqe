"use client";

import Link from "next/link";

interface DevicePreviewProps {
  projectId: string;
  onNewProject?: () => void;
}

const PHONE_W = 390;
const PHONE_H = 844;
const PHONE_SCALE = 0.5;

const IPAD_W = 768;
const IPAD_H = 1024;
const IPAD_SCALE = 0.37;

const DESK_W = 1440;
const DESK_H = 900;
const DESK_SCALE = 0.31;

export function DevicePreview({ projectId, onNewProject }: DevicePreviewProps) {
  const url = `/project/${projectId}`;

  const phoneInnerW = PHONE_W * PHONE_SCALE;
  const phoneInnerH = PHONE_H * PHONE_SCALE;

  const ipadInnerW = IPAD_W * IPAD_SCALE;
  const ipadInnerH = IPAD_H * IPAD_SCALE;

  const deskInnerW = DESK_W * DESK_SCALE;
  const deskInnerH = DESK_H * DESK_SCALE;

  return (
    <div
      className="w-full"
      style={{ animation: "slideUp 0.5s ease-out" }}
    >
      {/* Label */}
      <p className="text-center text-[#444] text-xs uppercase tracking-widest mb-10 font-medium">
        Preview across devices
      </p>

      {/* Device row */}
      <div className="flex items-end justify-center gap-8 overflow-x-auto pb-2 px-4">

        {/* ── Desktop / laptop ── */}
        <div className="flex flex-col items-center flex-shrink-0">
          {/* Screen */}
          <div
            style={{
              width: deskInnerW + 20,
              background: "#1a1a1a",
              borderRadius: 10,
              padding: "6px 6px 4px",
              boxShadow: "0 0 0 1px #333, 0 20px 60px rgba(0,0,0,0.7)",
            }}
          >
            {/* Notch bar */}
            <div
              style={{
                height: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 4,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#333" }} />
            </div>
            {/* Screen area */}
            <div
              style={{
                width: deskInnerW,
                height: deskInnerH,
                overflow: "hidden",
                borderRadius: 4,
                position: "relative",
                background: "#000",
              }}
            >
              <iframe
                src={url}
                title="Desktop preview"
                style={{
                  width: DESK_W,
                  height: DESK_H,
                  border: "none",
                  transform: `scale(${DESK_SCALE})`,
                  transformOrigin: "top left",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            </div>
          </div>
          {/* Stand */}
          <div
            style={{
              width: 60,
              height: 16,
              background: "linear-gradient(to bottom, #1a1a1a, #111)",
              clipPath: "trapezoid",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#1a1a1a",
                clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
              }}
            />
          </div>
          <div
            style={{
              width: 100,
              height: 5,
              background: "#1a1a1a",
              borderRadius: 4,
            }}
          />
          <span className="text-[10px] text-[#333] mt-3 tracking-wider uppercase">Desktop</span>
        </div>

        {/* ── iPad ── */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            style={{
              width: ipadInnerW + 28,
              height: ipadInnerH + 56,
              background: "#1a1a1a",
              borderRadius: 22,
              padding: "28px 14px",
              boxShadow: "0 0 0 1px #333, 0 20px 50px rgba(0,0,0,0.7)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Home button top */}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#2a2a2a",
                border: "1px solid #3a3a3a",
                position: "absolute",
                top: 9,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
            {/* Screen */}
            <div
              style={{
                width: ipadInnerW,
                height: ipadInnerH,
                overflow: "hidden",
                borderRadius: 6,
                position: "relative",
                background: "#000",
              }}
            >
              <iframe
                src={url}
                title="iPad preview"
                style={{
                  width: IPAD_W,
                  height: IPAD_H,
                  border: "none",
                  transform: `scale(${IPAD_SCALE})`,
                  transformOrigin: "top left",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            </div>
            {/* Home button bottom */}
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#222",
                border: "1px solid #333",
                position: "absolute",
                bottom: 9,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
          </div>
          <span className="text-[10px] text-[#333] mt-3 tracking-wider uppercase">iPad</span>
        </div>

        {/* ── iPhone ── */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            style={{
              width: phoneInnerW + 24,
              height: phoneInnerH + 48,
              background: "#1a1a1a",
              borderRadius: 40,
              padding: "24px 12px",
              boxShadow: "0 0 0 1px #333, 0 0 0 2px #111, 0 20px 50px rgba(0,0,0,0.8)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Dynamic island */}
            <div
              style={{
                width: 70,
                height: 10,
                borderRadius: 8,
                background: "#000",
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1,
              }}
            />
            {/* Side buttons */}
            <div
              style={{
                position: "absolute",
                left: -4,
                top: 60,
                width: 3,
                height: 28,
                background: "#2a2a2a",
                borderRadius: "2px 0 0 2px",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: -4,
                top: 96,
                width: 3,
                height: 40,
                background: "#2a2a2a",
                borderRadius: "2px 0 0 2px",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: -4,
                top: 72,
                width: 3,
                height: 56,
                background: "#2a2a2a",
                borderRadius: "0 2px 2px 0",
              }}
            />
            {/* Screen */}
            <div
              style={{
                width: phoneInnerW,
                height: phoneInnerH,
                overflow: "hidden",
                borderRadius: 28,
                position: "relative",
                background: "#000",
              }}
            >
              <iframe
                src={url}
                title="Phone preview"
                style={{
                  width: PHONE_W,
                  height: PHONE_H,
                  border: "none",
                  transform: `scale(${PHONE_SCALE})`,
                  transformOrigin: "top left",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            </div>
          </div>
          <span className="text-[10px] text-[#333] mt-3 tracking-wider uppercase">Phone</span>
        </div>

      </div>

      {/* CTA */}
      <div className="flex justify-center mt-10 gap-4">
        <Link
          href={url}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-[#f0f0f0] transition-colors"
        >
          View full project
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
        <button
          onClick={onNewProject}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-transparent text-[#555] text-sm border border-[#222] hover:border-[#444] hover:text-white transition-colors"
        >
          New project
        </button>
      </div>
    </div>
  );
}
