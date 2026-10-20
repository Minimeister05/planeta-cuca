import { ImageResponse } from "next/og";
import { fundoMarca, pipoDataUri } from "@/lib/marca";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: fundoMarca }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pipoDataUri} width={136} height={141} alt="" style={{ marginTop: 8 }} />
      </div>
    ),
    size,
  );
}
