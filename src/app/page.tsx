"use client";

import { useState } from "react";

const Button = (props: any) => (
  <button
    className="p-2 rounded-md border border-solid hover:bg-white hover:text-black transition-colors duration-300"
    type="button"
    {...props}
  />
);

export default function Home() {
  const [_2faStatus, set2FAStatus] = useState<
    "enabled" | "disabled" | "initializing"
  >("disabled");
  const [qrData, setQRData] = useState<string>();
  const [qrSecret, setQRSecret] = useState<string>();
  const [userToken, setUserToken] = useState<string>();
  const [errorText, setErrorText] = useState<string>();
  return (
    <main className="flex flex-col gap-4 items-center p-4 md:p-24">
      <div className="flex gap-1">
        <span>2FA is</span>
        <span
          className={
            _2faStatus === "enabled" ? "text-green-500" : "text-red-500"
          }
        >
          {_2faStatus === "enabled" ? "enabled" : "disabled"}
        </span>
      </div>
      {_2faStatus !== "enabled" && qrData && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span>1. Scan the QR code with Google Authenticator:</span>
            <img src={qrData} alt="2FA QR Code" />
          </div>
          <div className="flex flex-col gap-2">
            <span>2. Enter the 6-digits code from Google Authenticator:</span>
            <input
              type="text"
              className="rounded-md text-black p-2 border border-solid text-center"
              maxLength={6}
              onChange={(e) => setUserToken(e.target.value)}
              value={userToken}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span>3. Click Verify:</span>
            <Button
              onClick={async () => {
                const response = await fetch(
                  `/api/2fa/verify?secret=${qrSecret}&token=${userToken}`
                );
                const data = await response.json();
                if (data.verified) {
                  set2FAStatus("enabled");
                  setErrorText("");
                } else {
                  setUserToken("");
                  setErrorText(
                    "Failed. Please scan the QR code and repeat verification."
                  );
                }
              }}
            >
              Verify
            </Button>
            {errorText && (
              <span className="text-sm text-center text-red-500">
                {errorText}
              </span>
            )}
          </div>
        </div>
      )}
      {_2faStatus === "disabled" && (
        <Button
          onClick={async () => {
            set2FAStatus("initializing");
            const response = await fetch("/api/2fa/qrcode");
            const data = await response.json();
            setQRData(data.data);
            setQRSecret(data.secret);
          }}
        >
          Enable 2FA
        </Button>
      )}
    </main>
  );
}
