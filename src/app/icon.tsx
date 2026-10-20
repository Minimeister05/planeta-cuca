import { ImageResponse } from "next/og";
import { fundoMarca, pipoDataUri } from "@/lib/marca";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: fundoMarca, borderRadius: 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pipoDataUri} width={29} height={30} alt="" style={{ marginTop: 2 }} />
      </div>
    ),
    size,
  );
}
