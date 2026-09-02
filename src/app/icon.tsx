import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Ícone da aba. O lockup da marca é 3:1 e fica ilegível num quadrado de 16px,
 * então usamos o monograma — o mesmo que já aparece no botão flutuante e nos
 * avatares do site.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#081F4C",
          color: "#E0CD9A",
          fontSize: 34,
          fontFamily: "Georgia, 'Times New Roman', serif",
          letterSpacing: "-0.02em",
        }}
      >
        LG
      </div>
    ),
    size,
  );
}
